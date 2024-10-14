const TicketModel = require('../models/Ticketmodel');
const stripe = require('stripe')("sk_test_51Q8Y4kRsqhDc2VKgLa2PjKTRXPgDdM9WjafgceaAXAASS6IfijsebbjB0RX1e0DE2KBPJPqrZevbpuNkZ9hUD33L002waprK2X");

// Function to book a ticket
exports.getTickets = async (req, res) => {
    try {
        console.log("control inside getTickets")
        const { user_id, Bus_id,Passenger, seatNumber, date, from, to } = req.body;
        console.log("Request body : ",req.body)
        // Create a new ticket document
        const newTicket = new TicketModel({
            user_id,
            Bus_id,
            Passenger,
            seatNumber,
            date,
            from,
            to,
        });
        console.log("The new ticket : ",newTicket)
 
        // Save the ticket to the database
        await newTicket.save();
        res.status(201).json({ message: 'Ticket booked successfully', ticket: newTicket });
    } catch (error) {
        console.error('Error booking ticket:', error);
        res.status(500).json({ error: 'Failed to book ticket' });
    }
};

exports.ChecktwoTickets = async (req, res) => {
    try {
        console.log("Control inside ChecktwoTickets");
        const { user_id, Bus_id, Passenger, seatNumber, date, from, to } = req.body;
        console.log("Request body:", req.body);
        
        // Create a new ticket document
        const newTicket = {
            user_id,
            Bus_id,
            Passenger,
            seatNumber,
            date,
            from,
            to,
        };
        console.log("The new ticket:", newTicket);

        // Find tickets that match the same criteria
        const tickets = await TicketModel.find({ user_id, Bus_id, Passenger, seatNumber, date, from, to });

        if (tickets.length === 0) {
            // If no matching tickets, proceed with booking
            return res.json({ message: 'yes' });
        } else if (tickets.length > 1) {
            // If more than one matching ticket is found, delete one of them
            const ticketToDelete = tickets[0]._id; // Get the ID of the first duplicate ticket
            await TicketModel.findByIdAndDelete(ticketToDelete); // Delete the duplicate ticket
            console.log(`Deleted duplicate ticket with ID: ${ticketToDelete}`);
            return res.json({ message: 'duplicate_deleted' });
        } else {
            // If only one matching ticket is found, no need to delete
            return res.json({ message: 'no' });
        }
    } catch (error) {
        console.error('Error checking tickets:', error);
        res.status(500).json({ error: 'Failed to check and delete duplicate tickets' });
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

exports.AdmincancelTicket = async (req, res) => {
    const Bus_num = req.params.id;
    console.log("BODY : ",Bus_num) 
    try {
        const result = await TicketModel.deleteMany({ Bus_id: Bus_num }); 
        if (result.deletedCount === 0) { 
            return res.status(404).json({ message: 'No tickets found for the given Bus number' });
        }

        res.status(200).json({ message: `Successfully canceled ${result.deletedCount} tickets` }); 
    } catch (error) {
        console.error('Error canceling tickets:', error);
        res.status(500).json({ error: 'Failed to cancel tickets' });
    }
};

// Function to book a ticket
exports.getTickets = async (req, res) => {
    try {
        console.log("control inside getTickets");
        const { user_id, Bus_id, Passenger, seatNumber, date, from, to } = req.body;
        console.log("Request body: ", req.body);
        
        // Create a new ticket document
        const newTicket = new TicketModel({
            user_id,
            Bus_id,
            Passenger,
            seatNumber,
            date,
            from,
            to,
        });
        console.log("The new ticket: ", newTicket);

        // Save the ticket to the database
        await newTicket.save();
        res.status(201).json({ message: 'Ticket booked successfully', ticket: newTicket });
    } catch (error) {
        console.error('Error booking ticket:', error);
        res.status(500).json({ error: 'Failed to book ticket' });
    }
};

exports.Checkingwindow = async (req, res) => {
    try {
        const price = parseInt(req.body.price);
        const ticketData = req.body.ticketData; 
        const uid = req.body.user_id; // Get user ID
        console.log("PAYMENT WINDOW SAYS: ", req.body);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'HyperBus Tickets!!',
                        },
                        unit_amount: price * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/success/${uid}?status=success&ticketData=${JSON.stringify(ticketData)}`, 
            cancel_url : 'http://localhost:3000/failure',// Pass ticketData in the URL
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ message: 'Failed to create checkout session' });
    }
};

// New function to book tickets

// Function to finalize ticket booking after payment
const BusModel = require('../models/Busmodel'); // Import your Bus model
exports.finalizeBooking = async (ticketData) => {
    try {
        // Retrieve ticketData directly
        const ticketdata = ticketData.query.ticketData; 
        const tickets = Array.isArray(ticketdata) ? ticketdata : [ticketdata]; // Ensure we have an array

        console.log("tickets : ", typeof(tickets)); // Log the type of tickets

        for (let i = 0; i < tickets.length; i++) {
            // Access each ticket using the index
            let ticketObject;

            // Check if the ticket is a string and parse it to JSON
            if (typeof tickets[i] === 'string') {
                ticketObject = JSON.parse(tickets[i]);
            } else {
                ticketObject = tickets[i];
            }

            console.log("Processed ticket: ", ticketObject[i]); // Log the processed ticket
            
            const { Bus_id, seatNumber, date } = ticketObject[i]; // Extract relevant data

            // Find the specific bus entry
            const bus = await BusModel.findOne({ Bus_num: Bus_id, date });
            if (!bus) {
                console.error(`Bus not found for ID: ${Bus_id} on date: ${date}`);
                continue; // Skip to the next ticket if the bus is not found
            }

            // Check if the seat is available
            const seatIndex = seatNumber - 1; // Assuming seatNumber starts from 1
            if (bus.no_of_pass && bus.no_of_pass[seatIndex] === 1) {
                // Book the ticket first
                await bookTickets([ticketObject]); // Call bookTickets with the current ticket
                
                // Update the bus's no_of_passenger based on seatNumber
                bus.no_of_pass[seatIndex] = 2; // Mark as booked
            } else {
                console.warn(`Seat ${seatNumber} is already booked`);
            }

            // Save the updated bus information
            await bus.save();
        }
    } catch (error) {
        console.error('Error finalizing booking:', error);
        throw error; // Rethrow error if you want it to propagate
    }
};

// Ensure bookTickets function is defined correctly
const bookTickets = async (ticketData) => {
    for (const ticket of ticketData) {
        try {
            // Logic to book the ticket, e.g., saving to DB
            const response = await TicketModel.create(ticket); // Using create to save the ticket
            console.log(`Booked ticket for: ${ticket.Passenger} (ID: ${response._id})`);
        } catch (error) {
            console.error('Error booking ticket:', error);
            // Handle errors, e.g., roll back the previous successful bookings if necessary
        }
    }
};
