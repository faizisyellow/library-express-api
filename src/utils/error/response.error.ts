import { NextFunction, Request, Response } from "express";
import multer from "multer";

class ResponseError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "ResponseError";
    this.code = code;
  }
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ResponseError) {
    res.status(err.code).json({
      status: "Failed",
      code: err.code,
      errors: err.message,
    });
    return;
  }
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      status: "Failed",
      code: 400,
      message: err.message,
      errors: err.code,
    });
    return;
  }

  console.error(err);

  res.status(500).json({
    status: "Error",
    code: 500,
    errors: "Something went wrong",
  });
}

export { ResponseError, errorHandler };
