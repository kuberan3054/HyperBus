const express = require('express');
const { getTickets, viewTickets, cancelTicket, AdmincancelTicket } = require('../controllers/TicketController');
const router = express.Router(); 

router.route('/book-ticket').post(getTickets);
router.route('/tickets').post(viewTickets);
router.route('/tickets/:id').delete(cancelTicket);
router.route('/tickets/admin-del/:id').delete(AdmincancelTicket);

module.exports = router  