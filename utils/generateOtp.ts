
// import otp
import otpGenerator from 'otp-generator';

// import bcrypt
import bcrypt from 'bcrypt';
// generate otp
export const generateOtp = async() => {
    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    const hashedOtp = await bcrypt.hash(otp, 10);
    // set expiry time
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);


    return { otp, hashedOtp, expiryTime};
}