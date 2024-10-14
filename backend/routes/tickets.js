const express = require('express');
const { getTickets, viewTickets, cancelTicket, AdmincancelTicket, Checkingwindow, finalizeBooking, ChecktwoTickets } = require('../controllers/TicketController');
const router = express.Router(); 

 
router.route('/checkout').post(Checkingwindow)
router.route('/book-ticket').post(getTickets);
router.route('/check-for-two').post(ChecktwoTickets);
router.route('/finalize-booking').get(finalizeBooking);
router.route('/tickets').post(viewTickets);
router.route('/tickets/:id').delete(cancelTicket);
router.route('/tickets/admin-del/:id').delete(AdmincancelTicket);

module.exports = router   