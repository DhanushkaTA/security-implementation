import express from "express";
import * as AuthController from '../controller/authController'

let router = express.Router();

router.post('/token',AuthController.getNewAccessToken);

router.post('/logout',AuthController.logoutUser)

router.post('/otp/verify',AuthController.verifyOtp)

export default router;