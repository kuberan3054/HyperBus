const express = require('express');
const { getAdminBuses, ClearBus } = require('../controllers/AdminBusController');
const router = express.Router(); 

router.route('/buses').post(getAdminBuses);
router.route('/clrbus').post(ClearBus);

module.exports = router;