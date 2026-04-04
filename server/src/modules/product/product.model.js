const mongoose = require('mongoose');
const { PRODUCT_GRADES, PRODUCT_RARITIES, PRODUCT_CONDITIONS } = require('../../shared/constants/productConstants');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
    },
    grade: {
      type: String,
      enum: Object.values(PRODUCT_GRADES),
      default: PRODUCT_GRADES.NONE,
    },
    series: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    rarity: {
      type: String,
      enum: Object.values(PRODUCT_RARITIES),
      default: PRODUCT_RARITIES.COMMON,
    },
    condition: {
      type: String,
      enum: Object.values(PRODUCT_CONDITIONS),
      default: PRODUCT_CONDITIONS.NEW,
    },
    specs: {
      scale: { type: String, default: '' },
      material: { type: String, default: '' },
      dimensions: { type: String, default: '' },
      weight: { type: String, default: '' },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isMain: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock', 'archived'],
      default: 'active',
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ grade: 1, series: 1 });
productSchema.index({ seller: 1 });

// Virtual for reviews (when implemented)
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

// Pre-save hook for slug
productSchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .split(' ')
      .join('-')
      .replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
