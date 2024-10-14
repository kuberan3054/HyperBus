const BusModel = require('../models/Busmodel');
const TicketModel = require('../models/Ticketmodel');

// Get all buses API - /api/v1/buses
exports.getBuses = async (req, res, next) => {
    try {
        const busData = await BusModel.find({});
        res.json(busData);
    } catch (err) {
        console.error('Error fetching buses:', err);
        res.status(500).json({ message: 'Unable to fetch buses' });
    }
};

// Get one bus by Bus_num API - /api/v1/buses/:bus_num
exports.getOneBus = async (req, res, next) => {
    const from= req.body.start ;
    const to= req.body.end ;
    const date = req.body.date;
    console.log(req.body)
    try {
        const bus = await BusModel.find({ startpt: from , endpt : to , date : date});

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found',
                bus: `No bus with vehicle number ${bus_num}`,
            });
        }


        res.json({
            success: true,
            message: 'Get one bus working',
            bus: bus,
        });
    } catch (err) {
        console.error(`Error fetching bus ${bus_num}:`, err);
        res.status(500).json({ message: 'Failed to retrieve bus' });
    }
};

// Get tickets for a bus by Bus_num API - /api/v1/buses/:bus_num/tickets
exports.getBusTickets = async (req, res, next) => {
    const bus_num  = req.body.Bus_num;
    try {
        const tickets = await TicketModel.find({ Bus_num: bus_num });
        res.json(tickets);
    } catch (err) {
        console.error(`Error fetching tickets for bus ${bus_num}:`, err);
        res.status(500).json({ message: 'Failed to retrieve tickets' });
    }
};

// Reset all elements of no_of_pass array to 1 for a bus API - /api/v1/buses/:bus_num/reset
exports.resetBusSeats = async (req, res, next) => {
    const bus_num  = req.body.Bus_num;
    const date = req.body.date;
    console.log(bus_num);
    try { 
        const bus = await BusModel.findOne({ Bus_num: bus_num , date:date});
        console.log("Bus is  : ",bus)

        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        bus.no_of_pass = bus.no_of_pass.map(() => 1); // Resetting all elements to 1
        await bus.save();
        console.log(bus.no_of_pass);

        res.json({
            success: true,
            message: `Reset seats for bus ${bus_num} successfully`,
            bus: bus,
        });
    } catch (err) {
        console.error(`Error resetting seats for bus ${bus_num}:`, err);
        res.status(500).json({ message: 'Failed to reset seats' });
    }
};
exports.addBus = async (req, res, next) => {
    try {
        const {
            Bus_num,
            Ticket_price,
            Type,
            Travels,
            startpt,
            endpt,
            no_of_pass,
            dates, // assuming this is an array of dates
        } = req.body;

        console.log(req.body);

        // Iterate over the dates array and create a new bus for each date
        const busesToSave = [];

        dates.forEach(date => {
            const newBus = new BusModel({
                Bus_num,
                Ticket_price,
                Type,
                Travels,
                startpt,
                endpt,
                no_of_pass,
                date, 
            });

            // Push the new bus object to the array
            busesToSave.push(newBus.save());
        });

        // Wait for all buses to be saved
        await Promise.all(busesToSave);

        res.status(201).json({
            success: true,
            message: 'Buses added successfully for all dates',
        });
    } catch (err) {
        console.error('Error adding buses:', err);
        res.status(500).json({ message: 'Failed to add buses' });
    }
};

exports.getTicketsForBus = async (req, res) => {
    try {
        const bus_num  = req.body.Bus_id;

        const tickets = await TicketModel.find({ Bus_id: bus_num });
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error retrieving tickets:', error);
        res.status(500).json({ error: 'Failed to retrieve tickets' });
    }
};
 

exports.updateBusSeat = async (req, res, next) => {
    const bus_num  = req.body.Bus_id;
    const date  = req.body.date;
    const seat = (req.body.seatNumber)-1;
    console.log("BUS NUM ", req.body);
    try {
        const bus = await BusModel.findOne({ Bus_num: bus_num , date : date});

        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        
        bus.no_of_pass[seat] = 0 ;
                 
        await bus.save();
        console.log(bus.no_of_pass);

        res.json({
            success: true,
            message: `Reset seats for bus ${bus_num} successfully`,
            bus: bus,
        });
    } catch (err) {
        console.error(`Error resetting seats for bus ${bus_num}:`, err);
        res.status(500).json({ message: 'Failed to reset seats' });
    }
};


exports.updateBusSeatcancel = async (req, res, next) => {
    const bus_num  = req.body.bus_num;
    const date = req.body.ticketdate;
    const seatpos = req.body.seatpos;
    console.log("BUS NUMBER : ",bus_num);
    try {
        console.log("SEAT : ",seatpos,"DATE : ",date)
        const bus = await BusModel.findOne({ Bus_num: bus_num, date:date });
        console.log(bus)
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        bus.no_of_pass[seatpos-1] = 1; 
        await bus.save();
        console.log("THIS IS : ",bus.no_of_pass);

        res.json({
            success: true,
            message: `Reset seats for bus ${bus_num} successfully`,
            bus: bus,
        });
    } catch (err) {
        console.error(`Error resetting seats for bus ${bus_num}:`, err);
        res.status(500).json({ message: 'Failed to reset seats' });
    }
};


exports.CheckOneBus = async (req, res, next) => {
    const bno= req.body.Bus_num ;
    console.log(req.body)
    try {
        const bus = await BusModel.find({ Bus_num : bno });
        console.log(bus.length)

        if (bus.length === 0) {
            return res.json({
                success: false,
                message: 'yes',
                bus: [],
            });
        }
        else{

        res.json({
            success: true,
            message: 'no',
            bus: bus,
        });
    }
    } catch (err) {
        console.error(`Error fetching bus ${bno}:`, err);
        res.status(500).json({ message: 'Failed to retrieve bus' });
    }
};
