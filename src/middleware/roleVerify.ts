import express from "express";
import {CustomResponse} from "../util/custom.response";


export const restrictTo = (...roles:string[]) => {
    return (req:any,res:express.Response,next:express.NextFunction) => {
        //check user role with permission roles
        if (!roles.includes(req.tokenData.user.role)){
            return res.status(403).send(
                new CustomResponse(403,"This user don't have permission to perform this action")
            );
        }

        //Access to perform this action
        next();
    }
}