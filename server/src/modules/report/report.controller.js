const reportService = require('./report.service');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');

class ReportController {
  createTradeListingReport = asyncHandler(async (req, res) => {
    const report = await reportService.createTradeListingReport(req.params.id, req.user._id, req.body);
    res.status(201).json(ApiResponse.created(report, 'Report submitted successfully'));
  });

  getAllReports = asyncHandler(async (req, res) => {
    const reports = await reportService.getAllReports(req.query.status);
    res.status(200).json(ApiResponse.success(reports, 'Reports retrieved successfully'));
  });

  updateStatus = asyncHandler(async (req, res) => {
    const report = await reportService.updateReportStatus(req.params.id, req.user._id, req.body);
    res.status(200).json(ApiResponse.success(report, 'Report status updated successfully'));
  });
}

module.exports = new ReportController();
