import type { Request, Response, NextFunction } from "express";

import { HttpError } from "../errors/http-error.js";

class UnauthorizedApiKeyError extends HttpError {
    constructor() {
        super("Invalid API key.", 401);
    }
}


export function apiKeyMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): void {


    const apiKey = req.headers["x-api-key"];


    if (
        !apiKey ||
        apiKey !== process.env.API_KEY
    ) {
        next(new UnauthorizedApiKeyError());
        return;
    }


    next();

}