import type { Request, Response, NextFunction } from "express";

import { EmailError } from "../../../domain/email/errors/email-error.js";
import { ApplicationError } from "../../../application/email/errors/application-error.js";


export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {


    if (error instanceof EmailError) {

        res.status(400).json({
            success: false,
            message: error.message
        });

        return;
    }


    if (error instanceof ApplicationError) {

        res.status(500).json({
            success: false,
            message: error.message
        });

        return;
    }


    console.error(error);


    res.status(500).json({
        success: false,
        message: "An unexpected error occurred."
    });

}