const mongoose = require('mongoose');

const ticketSChema = new mongoose.Schema({
    user_id : String,
    Bus_id : String,
    Passenger : String,
    seatNumber : Number,
    date : Date,
    from : String,
    to : String,
    
})

const TicketModel = mongoose.model('Ticket',ticketSChema);

module.exports = TicketModel; 