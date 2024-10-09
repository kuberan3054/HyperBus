const BusModel = require('../models/Busmodel');

//get all bus API - /api/v1/buses
exports.PostUser = (req,res,next) =>{

    res.json({
        success : true,
        message : 'Redirected to user'
    })

}
 
exports.PostAdmin = (req,res,next) =>{

    res.json({
        success : true,
        message : 'Redirected to Admin'
    })
    
}