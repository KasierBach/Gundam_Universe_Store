/**
 * Standardized API Response class
 */
class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  static success(data = null, message = 'Success', statusCode = 200) {
    return new ApiResponse(statusCode, message, data);
  }

  static created(data = null, message = 'Created successfully') {
    return new ApiResponse(201, message, data);
  }

  static paginated(data, pagination, message = 'Success') {
    return new ApiResponse(200, message, data, { pagination });
  }

  /**
   * Send response via Express res object
   * @param {import('express').Response} res
   */
  send(res) {
    const responseBody = { success: this.success, message: this.message };
    if (this.data !== null) responseBody.data = this.data;
    if (this.meta) responseBody.meta = this.meta;
    return res.status(this.statusCode).json(responseBody);
  }
}

module.exports = ApiResponse;
