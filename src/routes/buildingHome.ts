import express, { Request, Response, NextFunction } from "express";
import Building from "../schemas/buildings";

const router = express.Router();

router.get("/", getAllBuildings);

async function getAllBuildings(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("getAllBuildings");
    try {
        const buildings = await Building.find({ isActive: true });
        res.send(buildings);
    } catch (err) {
        next(err);
    }
}

export default router;
