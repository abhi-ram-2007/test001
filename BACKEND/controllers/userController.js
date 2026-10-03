import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/handleError.js";
import {sendToken} from "../utils/jwtToken.js";
export const registerUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create(
        { name, 
        email,
        password, 
        avatar: { public_id: "sample_id", url: "sample_url" } 
    });
    sendToken(user, 201, res);
})

//Login user
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.verifyPassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

//Logout user
export const logout= handleAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

//reset password

export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Here you would typically send an email with the reset token
    // For now, we'll just return the token in the response
    const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    console.log(`Password reset URL: ${resetUrl}`);
    res.status(200).json({
        success: true,
        message: "Password reset token sent successfully",
        token: resetToken
    });
});