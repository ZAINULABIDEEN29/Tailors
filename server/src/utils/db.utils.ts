import Tailor from "../model/tailor.model.js"
import type { ITailor } from "../model/tailor.model.js";

export const findTailorByEmail = async (email: string): Promise<ITailor | null> => {
    return await Tailor.findOne({ email }) as ITailor | null;
}

export const findTailorById = async (id: string): Promise<ITailor | null> => {
    return await Tailor.findById(id) as ITailor | null;
}

