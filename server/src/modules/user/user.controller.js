const BaseController = require('../../shared/base/BaseController');
const userService = require('./user.service');
const ApiResponse = require('../../shared/utils/ApiResponse');

class UserController extends BaseController {
  constructor() {
    super(userService);
  }

  /** GET /api/users/me */
  getMe = this.handler(async (req, res) => {
    const user = await this.service.getProfile(req.user._id);
    ApiResponse.success(user, 'Profile retrieved').send(res);
  });

  /** PUT /api/users/me */
  updateMe = this.handler(async (req, res) => {
    const user = await this.service.updateProfile(req.user._id, req.body);
    ApiResponse.success(user, 'Profile updated').send(res);
  });

  /** PUT /api/users/me/avatar */
  updateAvatar = this.handler(async (req, res) => {
    const user = await this.service.updateAvatar(req.user._id, req.file);
    ApiResponse.success(user, 'Avatar updated').send(res);
  });

  /** GET /api/users/:id */
  getPublicProfile = this.handler(async (req, res) => {
    const user = await this.service.getPublicProfile(req.params.id);
    ApiResponse.success(user, 'User profile').send(res);
  });
}

module.exports = new UserController();
