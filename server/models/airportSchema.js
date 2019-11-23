import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;

const airport = new Schema({
    //Airport IATA Code 
    airportIC: {
        type: String,
        uppercase: true
    },
    airportName: {
        type: String,
        uppercase: true,
        required: true
    },
    continent: {
        region: String,
        subregion: String
    },
    country:{
        countryIC: {
            type: String,
            uppercase: true
        },
        countryName: {
            type: String,
            uppercase: true
        }
    },
    city: {  
        cityIC: {
            type: String,
            uppercase: true
        },
        cityName: {
            type: String,
            uppercase: true
        }
    }
});

airport.plugin(uniqueValidator);

export default mongoose.model('Airports',airport);