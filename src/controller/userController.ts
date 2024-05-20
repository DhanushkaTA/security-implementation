import express from "express";
import {CustomResponse} from "../util/custom.response";
import {UserInterface} from "../type/SchemaTypes";
import {userArray} from "../db/db";
import * as AuthController from './authController'
import * as UserService from '../service/userService'


export const userRegister = (req:express.Request,res:express.Response,next:express.NextFunction) => {
    UserService.register(req,res,next)
}

export const testMethod = (req:any, res:express.Response, next:express.NextFunction) => {
    res.status(200).send(
        new CustomResponse(200,"Wade hari")
    )
}