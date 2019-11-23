import Airport from '../models/airportSchema';
import fetch from 'node-fetch';

export async function getAirports(req,res){
    const airports = await Airport.find({});
    return res.json(airports);
}

export async function getAirportsQuery(req,res){
    const q = `.*${req.params.text}.*`;
    let airports = await Airport.find({airportIC:{$regex:q}},{__v:0});
    if(airports.length==0){
        airports = await Airport.find(
            {$or:[
                {"country.countryName":{$regex:q}},
                {"city.cityName":{$regex:q}}
            ]}
            ,{__v:0});    
    }
    return res.json(airports);
}

export async function fixed(req,res){
    const airports = await Airport.find({},{_id:0,__v:0});
    return res.json(airports);
}

export async function createAirport(req,res){
    const airportTest = new Airport(req.body);
    await airportTest.save();
    return res.json({status: 'New airport has been created.'});
}