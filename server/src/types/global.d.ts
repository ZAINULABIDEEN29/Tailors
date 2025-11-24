import type { ITailor } from "../model/tailor.model";

declare global {
    namespace Express {
        interface Request {
            tailor?: ITailor | null;
        }
    }
}

export {};