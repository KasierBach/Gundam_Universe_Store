const { Router } = require('express');
const reportController = require('./report.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { authorize } = require('../../shared/middlewares/role.middleware');
const { validate } = require('../../shared/middlewares/validate.middleware');
const { ROLES } = require('../../shared/constants/roles');
const {
  createTradeReportSchema,
  queryReportsSchema,
  updateReportStatusSchema,
} = require('./report.validator');

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(queryReportsSchema),
  reportController.getAllReports
);

router.patch(
  '/:id/status',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateReportStatusSchema),
  reportController.updateStatus
);

module.exports = router;
