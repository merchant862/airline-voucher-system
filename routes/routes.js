const express = require('express');
const router  = express.Router();

/* const rateLimiter               = require('../middlewares/rateLimiter');
const refererCheckerForThankyou = require('../middlewares/refererCheckerForThankyou');

const views = require('../controllers/views/views'); */

const addVoucherController = require('../controllers/actions/addVoucher');

router.post('/', addVoucherController);

module.exports = router;
