const mongoose = require('mongoose'); 

const BusSchema = new mongoose.Schema({
    Bus_num : String,
    Ticket_price : Number,
    Type : String,
    Travels : String,
    startpt : String,
    endpt : String,
    no_of_pass : [],
    
});

const BusModel = mongoose.model('Bus',BusSchema);

module.exports = BusModel;