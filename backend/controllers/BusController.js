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
    console.log(req.body)
    try {
        const bus = await BusModel.find({ startpt: from , endpt : to });

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
    console.log(bus_num);
    try {
        const bus = await BusModel.findOne({ Bus_num: bus_num });

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
        } = req.body;
        console.log(req.body)

        

        const newBus = new BusModel({
            Bus_num,
            Ticket_price,
            Type,
            Travels,
            startpt,
            endpt,
            no_of_pass,
        });

        await newBus.save();

        res.status(201).json({
            success: true,
            message: 'Bus added successfully',
            bus: newBus,
        });
    } catch (err) {
        console.error('Error adding bus:', err);
        res.status(500).json({ message: 'Failed to add bus' });
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
    const bus_num  = req.body.bus_num;
    const bus_data = req.body.bus;
    console.log(bus_num);
    try {
        const bus = await BusModel.findOne({ Bus_num: bus_num });

        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        bus.no_of_pass = bus_data.no_of_pass; // Resetting all elements to 1
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
    const seatpos = req.body.seatpos;
    console.log(bus_num);
    try {
        const bus = await BusModel.findOne({ Bus_num: bus_num });

        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        bus.no_of_pass[seatpos-1] = 1; // Resetting all elements to 1
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
