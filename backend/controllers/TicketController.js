const TicketModel = require('../models/Ticketmodel');
const BusModel = require('../models/Busmodel');

// Function to book a ticket
exports.getTickets = async (req, res) => {
    try {
        const { user_id, Passenger, seatNumber, date, from, to } = req.body;

        // Create a new ticket document
        const newTicket = new TicketModel({
            user_id,
            Passenger,
            seatNumber,
            date,
            from,
            to,
        });
 
        // Save the ticket to the database
        await newTicket.save();
        res.status(201).json({ message: 'Ticket booked successfully', ticket: newTicket });
    } catch (error) {
        console.error('Error booking ticket:', error);
        res.status(500).json({ error: 'Failed to book ticket' });
    }
};

// Function to view all tickets
exports.viewTickets = async (req, res) => {
    try {
        // Extract user_id from query parameters or request body
        const uid  = req.body.user_id;
        console.log(uid) // Use req.body if sending user_id in the body

        // Validate user_id
        if (!uid) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Find tickets where user_id matches the provided user_id
        const tickets = await TicketModel.find({ user_id : uid }); 

        // Check if tickets exist for the given user_id
        if (tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found for this user' });
        }

        res.status(200).json(tickets); 
    } catch (error) {
        console.error('Error retrieving tickets:', error);
        res.status(500).json({ error: 'Failed to retrieve tickets' });
    }
};

exports.cancelTicket = async (req, res) => {
    const ticketId  = req.params.id;
    console.log(ticketId);
    try {
        const result = await TicketModel.findByIdAndDelete(ticketId);
        if (!result) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket canceled successfully' });
    } catch (error) {
        console.error('Error canceling ticket:', error);
        res.status(500).json({ error: 'Failed to cancel ticket' });
    }
};
