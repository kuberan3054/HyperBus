const express = require('express');
const { getBuses, getOneBus, addBus, resetBusSeats, getTicketsForBus, updateBusSeat, updateBusSeatcancel, CheckOneBus } = require('../controllers/BusController');//auto generated
const router = express.Router();

router.route('/addbus').post(addBus);
router.route('/buses').get(getBuses);
router.route('/checkadd').post(CheckOneBus);
router.route('/findbuses').post(getOneBus);
router.route('/buses/:id/reset').put(resetBusSeats);
router.route('/update-bus').put(updateBusSeat);
router.route('/update-bus-cancel').put(updateBusSeatcancel);
router.post('/buses/tickets', getTicketsForBus);

module.exports = router;  