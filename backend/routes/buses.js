const express = require('express');
const { getBuses, getOneBus } = require('../controllers/BusController');//auto generated
const router = express.Router();

router.route('/buses').get(getBuses);
router.route('/bus/:id').post(getOneBus);

module.exports = router;