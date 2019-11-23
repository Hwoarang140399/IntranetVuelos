import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;

const airline = new Schema({
    //Airline IATA Code
    airlineIC: {
        type: String,
        uppercase: true
    },
    airlineName: {
        type: String,
        uppercase: true
    },
    airlineImage: String
});

airline.plugin(uniqueValidator);

// module.exports = mongoose.model('airlines',airline);
export default mongoose.model('Airlines',airline);