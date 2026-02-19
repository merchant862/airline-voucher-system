const express = require('express');
const router = express.Router();

const loginViewController     = require('../controllers/views/login');
const dashboardViewController = require('../controllers/views/dashboard');
const createVoucherController = require('../controllers/views/create_voucher');

const loginController      = require('../controllers/actions/login');
const dashboardController  = require('../controllers/actions/dashboard');
const addVoucherController = require('../controllers/actions/addVoucher') 

const auth   = require('../middlewares/auth');
const deauth = require('../middlewares/deauth');

router.get('/login',          deauth, loginViewController);
router.get('/dashboard',      auth(), dashboardViewController);
router.get('/voucher/create', auth(), createVoucherController)

router.get('/api/dashboard', auth(), dashboardController);
router.post('/login', loginController);
router.post('/api/voucher/create', addVoucherController);

module.exports = router;
