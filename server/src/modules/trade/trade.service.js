const tradeListingRepository = require('./tradeListing.repository');
const tradeOfferRepository = require('./tradeOffer.repository');
const conversationRepository = require('../chat/conversation.repository');
const notificationService = require('../notification/notification.service');
const { TRADE_LISTING_STATUS, TRADE_OFFER_STATUS } = require('../../shared/constants/tradeStatus');
const ApiError = require('../../shared/utils/ApiError');
const { uploadFilesToCloudinary } = require('../../shared/utils/cloudinaryAsset');
const wishlistRepository = require('../wishlist/wishlist.repository');

class TradeService {
  /**
   * Create a new trade listing
   */
  async createListing(listingData, ownerId, files = []) {
    const images = await this._resolveTradeImages(listingData.images, files, 'gundam-universe/trades/listings');

    return tradeListingRepository.create({
      ...listingData,
      images,
      owner: ownerId,
      status: TRADE_LISTING_STATUS.OPEN,
    });
  }

  /**
   * Get all listings with filters
   */
  async queryListings(filter, options) {
    return tradeListingRepository.findFiltered(filter, options);
  }

  async getUserOffers(userId) {
    return tradeOfferRepository.findByOffererId(userId);
  }

  /**
   * Get listing by ID
   */
  async getListingById(id) {
    const listing = await tradeListingRepository.findWithDetails(id);
    if (!listing) {
      throw new ApiError(404, 'Trade listing not found');
    }
    return listing;
  }

  /**
   * Create a trade offer and an associated conversation
   */
  async createOffer(listingId, offerData, offererId, files = []) {
    const listing = await tradeListingRepository.findById(listingId);
    if (!listing) {
      throw new ApiError(404, 'Trade listing not found');
    }

    if (listing.owner.toString() === offererId.toString()) {
      throw new ApiError(400, 'You cannot offer to your own listing');
    }

    if (listing.status !== TRADE_LISTING_STATUS.OPEN) {
      throw new ApiError(400, 'This listing is no longer accepting offers');
    }

    // 1. Create the Trade Offer
    const offer = await tradeOfferRepository.create({
      listing: listingId,
      offerer: offererId,
      ...offerData,
      images: await this._resolveTradeImages(offerData.images, files, 'gundam-universe/trades/offers'),
      status: TRADE_OFFER_STATUS.PENDING,
    });

    // 2. Create a Conversation for the offer
    const conversation = await conversationRepository.create({
      kind: 'trade_offer',
      participants: [listing.owner, offererId],
      relatedOffer: offer._id,
      relatedTradeListing: listingId,
    });

    // 3. Update the offer with the conversation ID
    offer.conversationId = conversation._id;
    await offer.save();

    await notificationService.createNotification({
      user: listing.owner,
      type: notificationService.constructor.NOTIFICATION_TYPES
        ? notificationService.constructor.NOTIFICATION_TYPES.TRADE_OFFER
        : 'trade_offer',
      title: 'New trade proposal received',
      message: 'A pilot has sent a new proposal for your trade listing.',
      link: `/trade/${listingId}`,
      metadata: {
        listingId,
        offerId: offer._id,
        conversationId: conversation._id,
      },
    });

    return offer;
  }

  /**
   * Accept a trade offer
   * - Marks accepted offer as ACCEPTED
   * - Marks all other offers for this listing as REJECTED
   * - Marks listing as COMPLETED
   */
  async acceptOffer(listingId, offerId, userId) {
    const listing = await tradeListingRepository.findById(listingId);
    if (!listing) {
      throw new ApiError(404, 'Trade listing not found');
    }

    if (listing.owner.toString() !== userId.toString()) {
      throw new ApiError(403, 'Only the listing owner can accept offers');
    }

    const targetOffer = await tradeOfferRepository.findById(offerId);
    if (!targetOffer || targetOffer.listing.toString() !== listingId.toString()) {
      throw new ApiError(404, 'Trade offer not found for this listing');
    }

    // Update target offer to ACCEPTED
    await tradeOfferRepository.updateById(offerId, { status: TRADE_OFFER_STATUS.ACCEPTED });

    // Reject all OTHER pending offers for this listing
    await tradeOfferRepository.updateManyStatus(
      { listing: listingId, _id: { $ne: offerId }, status: TRADE_OFFER_STATUS.PENDING },
      { status: TRADE_OFFER_STATUS.REJECTED }
    );

    // Close the listing
    await tradeListingRepository.updateById(listingId, { status: TRADE_LISTING_STATUS.COMPLETED });

    await notificationService.createNotification({
      user: targetOffer.offerer,
      type: notificationService.constructor.NOTIFICATION_TYPES
        ? notificationService.constructor.NOTIFICATION_TYPES.TRADE_STATUS
        : 'trade_status',
      title: 'Trade proposal accepted',
      message: 'Your trade proposal has been accepted. Open the mission console to continue.',
      link: `/chat?conversation=${targetOffer.conversationId}`,
      metadata: {
        listingId,
        offerId,
        conversationId: targetOffer.conversationId,
      },
    });

    return { message: 'Offer accepted successfully' };
  }

  /**
   * Reject a trade offer
   */
  async rejectOffer(listingId, offerId, userId) {
    const listing = await tradeListingRepository.findById(listingId);
    if (listing.owner.toString() !== userId.toString()) {
      throw new ApiError(403, 'Only the listing owner can reject offers');
    }

    const updatedOffer = await tradeOfferRepository.updateById(offerId, { status: TRADE_OFFER_STATUS.REJECTED });

    await notificationService.createNotification({
      user: updatedOffer.offerer,
      type: notificationService.constructor.NOTIFICATION_TYPES
        ? notificationService.constructor.NOTIFICATION_TYPES.TRADE_STATUS
        : 'trade_status',
      title: 'Trade proposal rejected',
      message: 'Your trade proposal was declined. Review other listings in the trade hub.',
      link: `/trade/${listingId}`,
      metadata: {
        listingId,
        offerId,
      },
    });

    return updatedOffer;
  }

  /**
   * Get offers for a specific listing
   */
  async getListingOffers(listingId, userId) {
    const listing = await tradeListingRepository.findById(listingId);
    if (!listing) {
      throw new ApiError(404, 'Trade listing not found');
    }

    // Only the owner can see all offers, others can only see their own (this could be restricted)
    if (listing.owner.toString() !== userId.toString()) {
       // Logic for other users to see their own offer
       return tradeOfferRepository.find({ listing: listingId, offerer: userId });
    }

    return tradeOfferRepository.findByListingId(listingId);
  }

  async getSuggestedListings(userId, limit = 6) {
    const [wishlist, listings] = await Promise.all([
      wishlistRepository.findByUserId(userId),
      tradeListingRepository.findOpenExcludingOwner(userId, 30),
    ]);

    const wishlistProducts = wishlist?.products || [];
    const keywordBag = wishlistProducts.flatMap((product) => {
      const tokens = [
        product?.name,
        product?.series,
        product?.grade,
        product?.rarity,
        ...(product?.tags || []),
      ];

      return tokens
        .filter(Boolean)
        .flatMap((value) => value.toString().toLowerCase().split(/[^a-z0-9]+/i))
        .filter((token) => token.length > 2);
    });

    const uniqueKeywords = [...new Set(keywordBag)];

    const scoredListings = listings.map((listing) => {
      const haystack = `${listing.title} ${listing.description} ${listing.wantedItems}`.toLowerCase();
      const keywordMatches = uniqueKeywords.reduce((score, keyword) => (
        haystack.includes(keyword) ? score + 1 : score
      ), 0);
      const reputationBoost = listing.owner?.reputation?.score ? listing.owner.reputation.score / 50 : 0;
      const freshnessBoost = listing.createdAt ? 1 / (1 + Math.max(1, (Date.now() - new Date(listing.createdAt).getTime()) / 86400000)) : 0;

      return {
        ...listing,
        suggestionScore: Number((keywordMatches + reputationBoost + freshnessBoost).toFixed(2)),
      };
    });

    return scoredListings
      .sort((a, b) => b.suggestionScore - a.suggestionScore || new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  async _resolveTradeImages(existingImages = [], files = [], folder) {
    const normalizedImages = Array.isArray(existingImages) ? existingImages : [];
    const uploadedImages = files.length > 0
      ? await uploadFilesToCloudinary(files, { folder })
      : [];

    const resolvedImages = uploadedImages.length > 0 ? uploadedImages : normalizedImages;

    if (!resolvedImages.length) {
      throw new ApiError(400, 'At least one trade image is required');
    }

    return resolvedImages.map((image) => ({
      url: image.url,
      publicId: image.publicId,
    }));
  }
}


module.exports = new TradeService();
