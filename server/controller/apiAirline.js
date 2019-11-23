import Airline from '../models/airlineSchema';

export async function getAirlines(req,res){
    const airlines = await Airline.find({});
    return res.json(airlines);
}

export async function fixed(req,res){
    const airlines = await Airline.find({},{_id:0,airlineIC:1,airlineName:1});
    return res.json(airlines);
}

export async function getAirlinesQuery(req,res){
    const q = `.*${req.params.text}.*`;
    let airlines = await Airline.find({airlineIC:{$regex:q}},{__v:0});
    if(airlines.length==0){
        airlines = await Airline.find({airlineName:{$regex:q}},{__v:0});    
    }
    return res.json(airlines);
}

export async function createAirline(req,res){
    const airlineTest = new Airline(req.body);
    await airlineTest.save();
    return res.json({status: 'New airline has been created.'});
}