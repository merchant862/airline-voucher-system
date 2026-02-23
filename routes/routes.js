const express = require('express');
const router = express.Router();

const rootViewController      = require('../controllers/views/root');
const loginViewController     = require('../controllers/views/login');
const dashboardViewController = require('../controllers/views/dashboard');
const createVoucherController = require('../controllers/views/create_voucher');
const voucherUpdateController = require('../controllers/views/voucher_update');

const loginController      = require('../controllers/actions/login');
const logoutController     = require('../controllers/actions/logout');
const dashboardController  = require('../controllers/actions/dashboard');
const addVoucherController = require('../controllers/actions/addVoucher'); 
const getAgenciesController = require('../controllers/actions/getLocalAgencies');
const getCustomersByVoucherController = require('../controllers/actions/getVoucherCustomers');
const getHotelsByVoucherController = require('../controllers/actions/getVoucherHotels');
const getNotesByVoucherController = require('../controllers/actions/getVoucherNotes');
const getTransportsByVoucherController = require('../controllers/actions/getVoucherTransports');
const getVoucherFormatsByVoucherController = require('../controllers/actions/getVoucherFormats');
const renderAnEJSTemplateForVoucherController = require('../controllers/actions/renderAnEjsTemplateForVoucher');
const renderAnEJSTemplateForLinkVoucherController = require('../controllers/actions/renderAnEjsTemplateForLinkVoucher');
const getVoucherDataByIdController = require('../controllers/actions/fetchVoucherDatabyId');
const updateVoucherController = require('../controllers/actions/updateVoucher');
const downloadVoucherPdfController = require('../controllers/actions/downloadVoucherPdf');
const updateVoucherStatusController = require('../controllers/actions/updateVoucherStatus');
const getTransportsandHotelsController = require('../controllers/actions/getTransportsandHotels');

const auth   = require('../middlewares/auth');
const deauth = require('../middlewares/deauth');

router.get('/', rootViewController)
router.get('/login',          deauth, loginViewController);
router.get('/dashboard',      auth(), dashboardViewController);
router.get('/voucher/create', auth(), createVoucherController)
router.get('/voucher/update/:id', auth(), voucherUpdateController);

router.get('/api/dashboard', auth(), dashboardController);
router.get('/api/agencies/:type', auth(), getAgenciesController);
router.get('/api/customers/:id', auth(),getCustomersByVoucherController);
router.get('/api/hotels/:id', auth(), getHotelsByVoucherController);
router.get('/api/notes/:id', auth(), getNotesByVoucherController);
router.get('/api/transports/:id', auth(), getTransportsByVoucherController);
router.get('/api/voucher/template/:id', renderAnEJSTemplateForVoucherController);
router.get('/api/list/:type', auth(), getTransportsandHotelsController)
router.get('/crm/data/voucher/hotel/travel/c=930390289898889s9ddcc0X9d0d90nsnwxweeddd&q=1909cnkxcjdsdudd9d9sd9sd9si9sdsdd/crm/data/voucher/hotel/travel/c=930390289898889s9ddcc0X9d0d90nsnwxweeddd&q=1909cnkxcjdsdudd9d9sd9sd9si9sdsdd/:id',  renderAnEJSTemplateForLinkVoucherController);
router.get('/api/voucher/formats/:name', auth(), getVoucherFormatsByVoucherController);
router.get('/api/voucher/:id', auth(), getVoucherDataByIdController);
router.get('/voucher/download/:id', downloadVoucherPdfController)
router.post('/api/voucher/create', auth(), addVoucherController);
router.post('/api/voucher/update/:id', auth(), updateVoucherController);
router.get('/api/voucher/update/:status/:id', auth(), updateVoucherStatusController);
router.post('/login', loginController);
router.get('/logout', logoutController);

module.exports = router;
