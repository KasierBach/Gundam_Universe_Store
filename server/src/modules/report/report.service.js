const reportRepository = require('./report.repository');
const { REPORT_STATUSES, REPORT_TARGET_TYPES } = require('./report.model');
const tradeListingRepository = require('../trade/tradeListing.repository');
const ApiError = require('../../shared/utils/ApiError');

class ReportService {
  async createTradeListingReport(listingId, reporterId, payload) {
    const listing = await tradeListingRepository.findById(listingId);
    if (!listing) {
      throw ApiError.notFound('Trade listing not found');
    }

    if (listing.owner.toString() === reporterId.toString()) {
      throw ApiError.badRequest('You cannot report your own trade listing');
    }

    const existingReport = await reportRepository.findByReporterAndTarget(
      reporterId,
      REPORT_TARGET_TYPES.TRADE_LISTING,
      listingId
    );

    if (existingReport) {
      throw ApiError.conflict('You already submitted a report for this listing');
    }

    return reportRepository.create({
      reporter: reporterId,
      targetType: REPORT_TARGET_TYPES.TRADE_LISTING,
      targetId: listingId,
      reason: payload.reason,
      details: payload.details,
      status: REPORT_STATUSES.PENDING,
    });
  }

  async getAllReports(status) {
    const filter = status ? { status } : {};
    return reportRepository.findAllWithDetails(filter);
  }

  async updateReportStatus(reportId, reviewerId, payload) {
    const report = await reportRepository.findById(reportId);
    if (!report) {
      throw ApiError.notFound('Report not found');
    }

    return reportRepository.updateById(reportId, {
      status: payload.status,
      resolutionNote: payload.resolutionNote || '',
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    });
  }
}

module.exports = new ReportService();
