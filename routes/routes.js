const express = require('express');
const router = express.Router();

const loginViewController     = require('../controllers/views/login');
const dashboardViewController = require('../controllers/views/dashboard');
const createVoucherController = require('../controllers/views/create_voucher');

const loginController      = require('../controllers/actions/login');
const dashboardController  = require('../controllers/actions/dashboard');
const addVoucherController = require('../controllers/actions/addVoucher'); 
const getAgenciesController = require('../controllers/actions/getLocalAgencies');
const getCustomersByVoucherController = require('../controllers/actions/getVoucherCustomers');
const getHotelsByVoucherController = require('../controllers/actions/getVoucherHotels');
const getNotesByVoucherController = require('../controllers/actions/getVoucherNotes');
const getTransportsByVoucherController = require('../controllers/actions/getVoucherTransports');
const getVoucherFormatsByVoucherController = require('../controllers/actions/getVoucherFormats');
const renderAnEJSTemplateForVoucherController = require('../controllers/actions/renderAnEjsTemplateForVoucher');

const auth   = require('../middlewares/auth');
const deauth = require('../middlewares/deauth');

router.get('/login',          deauth, loginViewController);
router.get('/dashboard',      auth(), dashboardViewController);
router.get('/voucher/create', auth(), createVoucherController)

router.get('/api/dashboard', auth(), dashboardController);
router.get('/api/agencies/:type', auth(), getAgenciesController);
router.get('/api/customers/:id', auth(),getCustomersByVoucherController);
router.get('/api/hotels/:id', auth(), getHotelsByVoucherController);
router.get('/api/notes/:id', auth(), getNotesByVoucherController);
router.get('/api/transports/:id', auth(), getTransportsByVoucherController);
router.get('/api/voucher/template/:id', auth(), renderAnEJSTemplateForVoucherController);
router.get('/api/voucher/formats/:name', auth(), getVoucherFormatsByVoucherController);
router.post('/api/voucher/create', auth(), addVoucherController);
router.post('/login', loginController);

module.exports = router;
