const nodemailer = require('nodemailer');

// Send Email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send Verification Email
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = process.env.FRONTEND_URL + '/verify-email?token=' + token;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification - Fitness Tracker',
        html: '<h1>Verify Your Email</h1><p>Click the link below to verify your email:</p><a href="' + verificationUrl + '">' + verificationUrl + '</a><p>This link will expire in 24 hours.</p>'
    };

    await transporter.sendMail(mailOptions);
};

// Send Reset Password Email
const sendResetPasswordEmail = async (email, token) => {
    const resetUrl = process.env.FRONTEND_URL + '/reset-password?token=' + token;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password - Fitness Tracker',
        html: '<h1>Reset Your Password</h1><p>Click the link below to reset your password:</p><a href="' + resetUrl + '">' + resetUrl + '</a><p>This link will expire in 1 hour.</p>'
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };