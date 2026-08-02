import type { Request, Response, NextFunction } from "express";

import { ApplicationError } from "../../../application/email/errors/application-error.js";


class UnauthorizedApiKeyError extends ApplicationError {

    constructor() {
        super("Invalid API key.");
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