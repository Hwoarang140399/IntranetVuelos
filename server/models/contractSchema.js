import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;

const contract = new Schema({
    IATAOwner: {type:String,uppercase:true,required:true},
    contractOwner: {type:String,uppercase:true,required:true},
    codeContract: {type:String,required:true,unique:true},
    visibility:{type: [String], required: true},
    startDate: {type:Date,required:true},
    expirationDate: {type:Date,required:true},
    creationDate : {type:Date,required:true},
    authorContract: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    editions:[
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            date: {type:Date,required:true},
            subject:{type:String,required:true},
            description: {type: String, required:true},
            logs:[{
                title: String,
                oldValue: String,
                newValue: String
            }]
        }
    ],
    ownerImage: {type: String},
    contractFile: {type: String},
    zones: [
        {
            title: {type:String, required:true},
            carriers: [{
                id: {type: Schema.Types.ObjectId, ref: 'airline'},
                categories: [{
                    title: String,
                    classess: [{
                        title: [String],
                        routes: [{
                            origin: {
                                title: String,
                                isRegion: Boolean
                            },
                            destination: {
                                title: String,
                                isRegion: Boolean
                            },
                            airport_airport: [{
                                origin: {type: Schema.Types.ObjectId, ref:'airline'},
                                destination: {type: Schema.Types.ObjectId, ref:'airline'}
                            }],
                            fareValid: Number,
                            numberRoute: Number,
                            fareType: [{
                                title: String,
                                commission: Number
                            }]
                        }]
                    }]
                }]
            }],
            restrictions: [
                {
                    index: Number,
                    data: String,
                    restriction: String,
                    example: String
                }
            ],
            restrictionFT: [
                {
                    index: Number,
                    restrictions:[{
                        title: String,
                        value: String
                    }]
                }
            ]
        }
    ],
    regions: [
        {
            title: {type:String,uppercase:true},
            typeRegion: String,
            airport: {
                selected: [{type: Schema.Types.ObjectId, ref:'airport'}]
            },
            country: {
                title: String,
                airportsIncluded: [{type: Schema.Types.ObjectId, ref:'airport'}],
                airportsExcluded: [{type: Schema.Types.ObjectId, ref:'airport'}]
            },
            continent: {
                region: String,
                subregion: String,
                countriesIncluded: [String],
                countriesExcluded: [String],
                airportsExcluded: [{type: Schema.Types.ObjectId, ref:'airport'}]
            },
            group: {
                continents: [
                    {
                        region: String,
                        subregions: [String]
                    }
                ],
                countriesIncluded: [String],
                countriesExcluded: [String],
                airportsExcluded: [{type: Schema.Types.ObjectId, ref:'airport'}]
            }
        }
    ]
});

contract.plugin(uniqueValidator);

// module.exports = mongoose.model('Contracts',contract);
export default mongoose.model('Contracts', contract);
