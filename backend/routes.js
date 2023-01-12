const router = require('express').Router();
const authController = require('./controllers/auth-controller');
const activateController = require('./controllers/activate-controllers');
const authMiddleware = require('./middleware/auth-middleware');
//const { refresh } = require('./controllers/auth-controller');
router.post('/api/send-otp',authController.sendOtp);
router.post('/api/verify-otp',authController.verifyOtp);
router.post('/api/activate', authMiddleware, activateController.activate);
router.get('/api/refresh' , authController.refresh);
router.post('/api/logout', authMiddleware, authController.logout);

module.exports = router;