import express from "express";
import * as VerifyToken from '../middleware/verifyToken'
import * as RoleVerify from '../middleware/roleVerify'
import * as UserController from '../controller/userController'
import * as OTPService from '../service/otpService'

let router = express.Router();

router.post('/register/:phoneNumber',UserController.userRegister);

router.get('/test',VerifyToken.verifyToken,RoleVerify.restrictTo('admin','cor-admin'),UserController.testMethod)

router.post('/otp/:phoneNumber',OTPService.sentOTP)

export default router;