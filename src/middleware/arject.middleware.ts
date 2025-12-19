import aj from "../config/arject.config.ts";
import { type Request, type Response, type NextFunction} from "express";
 // import { isSpoofedBot } from "@arcjet/inspect";




const arjectMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const decision = await aj.protect(req as unknown as Parameters<typeof aj.protect>[0], {
            requested: 1
        });
        
        if(decision.isDenied()) {
            if (decision.reason.isRateLimit()) return res.status(429).json({ error: "Rate limit exceed" });
            if(decision.reason.isBot()) return res.status(403).json({error: "Bot Detected"})
            return res.status(403).json({error: "Access Denied"})
        }
        
        next();
    }
    catch (error) {
        console.log(`Arject Middleware Error: ${error}`);
        next(error);
    }
}

export default arjectMiddleware;