const ApiError = require('../utils/ApiError');

/**
 * Base Service - Abstract business logic layer
 * All module services extend this for common operations
 */
class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async getById(id) {
    const doc = await this.repository.findById(id);
    if (!doc) throw ApiError.notFound('Resource not found');
    return doc;
  }

  async getAll(filter = {}, options = {}) {
    return this.repository.find(filter, options);
  }

  async create(data) {
    return this.repository.create(data);
  }

  async update(id, data) {
    const doc = await this.repository.updateById(id, data);
    if (!doc) throw ApiError.notFound('Resource not found');
    return doc;
  }

  async delete(id) {
    const doc = await this.repository.deleteById(id);
    if (!doc) throw ApiError.notFound('Resource not found');
    return doc;
  }

  async count(filter = {}) {
    return this.repository.count(filter);
  }
}

module.exports = BaseService;
