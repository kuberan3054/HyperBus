const express = require('express');
const { getTickets, viewTickets, cancelTicket } = require('../controllers/TicketController');
const router = express.Router(); 

router.route('/book-ticket').post(getTickets);
router.route('/tickets').post(viewTickets);
router.route('/tickets/:id').delete(cancelTicket);

module.exports = router 