import { AppError } from "./AppError";

export class ApiError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, "API_ERROR", statusCode);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
