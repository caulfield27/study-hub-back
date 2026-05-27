import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;;
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};