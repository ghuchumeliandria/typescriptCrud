import { NextFunction, Request, Response } from "express";

 export default async (req : Request,res : Response , next : NextFunction) =>{
try {
    const admin = req.headers['admin']

    if(admin !== "admin" ) {
        res.status(400).json({error : "You don't have permision"})
        return
    }
    next()
} catch (error) {
    res.status(400).json({error : 'ar mushaobs dzmao'})
}
 }