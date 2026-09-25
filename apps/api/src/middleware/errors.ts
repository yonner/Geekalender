import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { ApiError } from '@geekalender/shared';

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new HttpError(404, 'Not found'));
};

// Express identifies error handlers by arity, so all four parameters are required.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err instanceof HttpError ? err.status : 500;
  if (status === 500) console.error(err);
  const body: ApiError = {
    error: { message: status === 500 ? 'Internal server error' : err.message },
  };
  res.status(status).json(body);
};
