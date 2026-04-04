const { Report } = require('./report.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class ReportRepository extends BaseRepository {
  constructor() {
    super(Report);
  }

  async findByReporterAndTarget(reporter, targetType, targetId) {
    return this.model.findOne({ reporter, targetType, targetId });
  }

  async findAllWithDetails(filter = {}) {
    return this.model.find(filter)
      .populate('reporter', 'displayName email avatar')
      .populate('reviewedBy', 'displayName email')
      .sort({ createdAt: -1 });
  }
}

module.exports = new ReportRepository();
