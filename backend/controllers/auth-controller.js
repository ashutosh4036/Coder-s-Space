const otpService = require('../services/otp-service');
const hashService = require ('../services/hash-service.js');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
class AuthController{
    async sendOtp(req,res){
        //Logic
        const { phone } = req.body;
        if(!phone){
            res.status(400).json({message: 'Phone filed is required!'});
        }

        //random number genrate
        const otp = await otpService.generateOtp();
        //hash otp
        const ttl = 1000 * 60 * 2;//2 minutes
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        //send otp
        try {
           // await otpService.sendBySms(phone,otp);
            res.json({
                hash : `${hash}.${expires}`,
                phone,
                otp
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "message sending fail"})
        }

    }
    async verifyOtp(req,res){
        //Logic
        const { otp, hash, phone } = req.body;
        if (!otp || !hash || !phone) {
             res.status(400).json({ message: 'All fields are required!' });
        }
        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
             res.status(400).json({ message: 'OTP expired!' });
        }
        const data = `${phone}.${otp}.${expires}`;
        const isValid = otpService.verifyOtp(hashedOtp, data);
        if (!isValid) {
             res.status(400).json({ message: 'Invalid OTP' });
        }

        let user;
        try{
            user = await userService.findUser({phone});
            if(!user){
                user = await userService.createUser({phone});
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({ message: 'Db error' });
        }
        // token
        const { accessToken, refreshToken } = tokenService.generateTokens({
            _id: user._id,
            activated: false,
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });
        const userDto = new UserDto(user);
        res.json({ accessToken, user: userDto });
    } 
}


module.exports = new AuthController();