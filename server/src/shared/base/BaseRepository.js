/**
 * Base Repository - Abstract data access layer
 * All module repositories extend this for common CRUD operations
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id, populateOptions = '') {
    return this.model.findById(id).populate(populateOptions).lean();
  }

  async findOne(filter, populateOptions = '') {
    return this.model.findOne(filter).populate(populateOptions).lean();
  }

  async find(filter = {}, options = {}) {
    const { sort = { createdAt: -1 }, skip = 0, limit = 12, populate = '', select = '' } = options;
    return this.model.find(filter).sort(sort).skip(skip).limit(limit).populate(populate).select(select).lean();
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async create(data, options = {}) {
    return this.model.create(data, options);
  }

  async updateById(id, updateData) {
    return this.model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  async exists(filter) {
    const doc = await this.model.exists(filter);
    return !!doc;
  }
}

module.exports = BaseRepository;
