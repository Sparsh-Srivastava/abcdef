import { Response } from 'express';

export class APIError {
  private statusCode: number;
  private message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }

  description() {
    return {
      success: false,
      message: this.message,
    };
  }

  status() {
    return this.statusCode;
  }
}

export const respondWithError = (error: any, response: Response) => {
  if (error instanceof APIError) {
    const err: APIError = error;
    return response.status(err.status()).json(err.description());
  } else {
    response.status(500).json({ message: 'Something went wrong.' });
  }
};
