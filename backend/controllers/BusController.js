const BusModel = require('../models/Busmodel');
//get all bus API - /api/v1/buses
exports.getBuses = async (req,res,next) =>{

    try {
        const busData = await BusModel.find({});
        res.json(busData);
      } catch (err) {
        res.status(500).json({ message: 'Cant fetch' });
      }
}

exports.getOneBus = async (req,res,next) =>{

    const Buses = await BusModel.find({"Bus_num" : req.params.id});

    if (Buses.length == 0)
    {
        res.status(404).json({
            success : false,
            message : 'Get one Bus working',
            Buses : 'No buses with that vehicle number '
        })

    }
    else{
    res.json({
        success : true,
        message : 'Get one Bus working',
        Buses : Buses
    })
    }
}