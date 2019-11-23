import Contract from '../models/contractSchema';
import User from '../models/userSchema';
import Airline from '../models/airlineSchema';
import fetch from 'node-fetch';
import path from 'path';
import { unlink } from 'fs-extra';

export async function getContracts(req,res){
    const contracts = await Contract.find({});
    return res.json(contracts);
}

export async function getContractsBasic(req,res){
    const contracts = await Contract.find({},
        {
            IATAOwner:1,
            contractOwner:1,
            codeContract:1,
            visibility:1,
            startDate:1,
            expirationDate:1,
            creationDate:1,
            authorContract:1,
            ownerImage:1,
            editions:1
        }
    ).populate([{path:'authorContract',model:User, select: {'name':1,'lastName':1}},{path:'editions.user',model:User,select:{'name':1,'lastName':1}}]);
    
    return res.json(contracts);
}

export async function deleteContract(req,res){
    Contract.findByIdAndDelete(req.params.id)
        .then((output)=>{
            if(output.ownerImage && output.ownerImage!='default'){
                unlink(path.join(__dirname,'..','uploads','contractImg',output.ownerImage));
                unlink(path.join(__dirname,'..','uploads','contractFiles',output.contractFile)); 
            } else {
                unlink(path.join(__dirname,'..','uploads','contractFiles',output.contractFile)); 
            }
            return res.json({status:'ok'});
        })
    
}

export async function createContract(req,res){
    const tempContract = {};
    tempContract['IATAOwner'] = req.body.iata;
    tempContract['contractOwner'] = req.body.owner;
    tempContract['codeContract'] = req.body.code;
    tempContract['visibility'] = req.body.visibility.slice();
    tempContract['startDate'] = new Date(req.body.dates[0]);
    tempContract['expirationDate'] = new Date(req.body.dates[1]);
    tempContract['creationDate']= new Date();
    tempContract['authorContract'] = req.body.user;
    tempContract['editions'] = [
        {
            user: req.body.user,
            date: req.body.date,
            subject: req.body.subject,
            description: req.body.description,
            logs: req.body.logs.slice() 
        }
    ];
    tempContract['ownerImage']=null;
    tempContract['contractFile']=null;
    tempContract['regions']=[];
    if(req.body.regions){
        req.body.regions.map(region=>{
            let tempRegion = {};
            tempRegion['title'] = region.title;
            tempRegion['typeRegion'] = region.typeRegion;

            if(region.typeRegion=='airport'){
                tempRegion['airport'] = {selected:region.airport.selected.map(e=>{return e.id})};
            } else {
                tempRegion['airport'] = {selected:[]};
            }

            if(region.typeRegion=='country'){
                tempRegion['country'] = {
                    title: region.country.title,
                    airportsIncluded: region.country.airportsIncluded.map(e=>{return e.id}),
                    airportsExcluded: region.country.airportsExcluded.map(e=>{return e.id})
                };
            } else {
                tempRegion['country'] = {title: null,airportsIncluded: [],airportsExcluded: []};
            }

            if(region.typeRegion=='continent'){
                tempRegion['continent'] = {
                    region: region.continent.region,
                    subregion: region.continent.subregion,
                    countriesIncluded: region.continent.countriesIncluded.map(e=>{return e.code}),
                    countriesExcluded: region.continent.countriesExcluded.map(e=>{return e.code}),
                    airportsExcluded: region.continent.airportsExcluded.map(e=>{return e.id})
                };
            } else {
                tempRegion['continent'] = {region: null,subregion: null,countriesIncluded: [],countriesExcluded: [],airportsExcluded: []};
            }

            if(region.typeRegion=='group'){
                tempRegion['group'] = {
                    continents: region.group.continents,
                    countriesIncluded: region.group.countriesIncluded.map(e=>{return e.code}),
                    countriesExcluded: region.group.countriesExcluded.map(e=>{return e.code}),
                    airportsExcluded: region.group.airportsExcluded.map(e=>{return e.id})
                };
            } else {
                tempRegion['group'] = {continents: [],countriesIncluded: [],countriesExcluded: [],airportsExcluded: []};
            }

            tempContract.regions.push(tempRegion);
        });
    }
    tempContract['zones']=[];
    req.body.zones.map(zone=>{
        let tempZone = {};
        tempZone['title'] = zone.name;
        tempZone['carriers'] = [];
        zone.carriers.map(carrier=>{
            let tempCarrier = {};
            tempCarrier['id'] = carrier.id;
            tempCarrier['categories'] = [];
            carrier.categories.map(category=>{
                let tempCategory = {};
                tempCategory['title'] = category.title;
                tempCategory['classess'] = [];
                category.classess.map(classess=>{
                    let tempClassess = {};
                    tempClassess['title'] = classess.title.slice();
                    tempClassess['routes'] = [];
                    classess.routes.map(route=>{
                        let tempRoute = {};
                        tempRoute['origin'] = route.origin;
                        tempRoute['destination'] = route.destination;
                        let tempAA = [];
                        route.aa.map(AA=>{tempAA.push({origin:AA.origin.id,destination:AA.destination.id})});
                        tempRoute['airport_airport'] = tempAA.slice();
                        tempRoute['fareValid'] = route.fareValid;
                        tempRoute['numberRoute'] = route.numberRoute;
                        tempRoute['fareType'] = route.fareType.slice();
                        tempClassess.routes.push(tempRoute);
                    });
                    tempCategory.classess.push(tempClassess);
                });
                tempCarrier.categories.push(tempCategory);
            });
            tempZone.carriers.push(tempCarrier);
        });
        tempZone['restrictions']=zone.restrictions;
        tempZone['restrictionFT']=zone.restrictionFT;
        tempContract.zones.push(tempZone);
    });
    const contractTemportal = new Contract(tempContract);
    await contractTemportal.save();
    return res.json({id:contractTemportal._id});
}

export async function upFile(req,res){
    const contract = await Contract.findById(req.body.id);
    contract.contractFile=req.file.filename;
    await contract.save();
    return res.json({status:'ok'})
}

export async function upLogo(req,res){
    const contract = await Contract.findById(req.body.id);
    contract.ownerImage = req.file.filename;
    await contract.save();
    return res.json({status:'ok'})
}

export async function getContractById(req,res){
    const contract = await Contract.findById(req.params.id);
    return res.json(contract);
}

/* export async function fill(req,res){
    const contracts = await Contract.aggregate([
        {
            $project: {
                regions: 0
            }
        },
        { $unwind: '$routes' },
        {
            $project: {
                IATAOwner: 1,
                contractOwner: 1,
                visibility: 1,
                startDate: 1,
                expirationDate: 1,
                origin: '$routes.origin',
                destination: '$routes.destination',
                carrier: '$routes.carrier'
            }
        },
        { $unwind: '$carrier'},
        {
            $project: {
                IATAOwner: 1,
                contractOwner: 1,
                visibility: 1,
                startDate: 1,
                expirationDate: 1,
                origin: 1,
                destination: 1,
                airline: '$carrier.airlineIC',
                category: '$carrier.category'
            }
        },
        { $unwind: '$category' },
        {
            $project: {
                IATAOwner: 1,
                contractOwner: 1,
                visibility: 1,
                startDate: 1,
                expirationDate: 1,
                origin: 1,
                destination: 1,
                airline: 1,
                category: '$category.title',
                classes: '$category.classes'
            }
        },
        { $unwind: '$classes' },
        {
            $project: {
                IATAOwner: 1,
                contractOwner: 1,
                visibility: 1,
                startDate: 1,
                expirationDate: 1,
                origin: 1,
                destination: 1,
                airline: 1,
                category: 1,
                classes: '$classes.title',
                commission: '$classes.commission'
            }
        }
    ]);

    return res.json(contracts);
} */

/* export async function getContractOwners(req,res){
    const contracts = await Contract.aggregate([
        {
            $project: {
                contractOwner:1, 
            }
        }
    ]);
    return res.json(contracts);
} */

/* export async function editContract(req,res){
    await Contract.findByIdAndUpdate(req.params.id, req.body);
    return res.json({status: 'Task Updated'});
} */

/* export async function findContract(req,res){
    const contract = await Contract.findById(req.params.id);
    return res.json(contract);
} */

/* let getRegionsRaw = async (airport,iata,capability) => {
    const regions = await Contract.aggregate([
        { $match: {$and:[
            {$expr:{$cond:[{$ne:[capability,'']},{$in:[capability,'$visibility']},true]}},
            {$expr:{$cond:[{$ne:[iata,'']},{$eq:['$IATAOwner',iata]},true]}},
            {'regions.airports.airportIC':airport}    
        ]}},
        { $project: {
            _id:0,
            contractID: '$_id',
            regions:1
        }},
        { $unwind: '$regions'},
        { $match: {'regions.airports.airportIC':airport}},
        { $project: {
            contractID: 1,
            regionName: '$regions.title'
        }}
    ]); 
    return regions;
} */

/*let getContractsRaw = async (capability,iata,airlineIC,category) => {
    const contracts = await Contract.aggregate([
        { $match: {$and:[
            {$expr:{$cond:[{$ne:[capability,'']},{$in:[capability,'$visibility']},true]}},
            {$expr:{$cond:[{$ne:[iata,'']},{$eq:[iata,'$IATAOwner']},true]}}
        ]}},
        { $project: {
            regions : 0,
            editions: 0,
            authorContract: 0,
            creationDate: 0,
            codeContract: 0
        }},
        { $unwind: '$zones'},
        { $project: {
            IATAOwner:1,
            contractOwner:1,
            startDate:1,
            expirationDate:1,
            routes: '$zones.routes'
        }},
        { $unwind: '$routes'},
        { $project: {
            IATAOwner: 1,
            contractOwner: 1,
            startDate: 1,
            expirationDate: 1,
            origin: '$routes.origin',
            destination: '$routes.destination',
            restrictions: '$routes.restrictions',
            fareType: '$routes.fareType'
        }},
        { $unwind: '$faretype'},
        { $project: {
            IATAOwner: 1,
            contractOwner: 1,
            startDate: 1,
            expirationDate: 1,
            origin: 1,
            destination: 1,
            restrictions: 1,
            fareTypeTitle: '$fareType.title',
            carrier: {$filter:{
                input: '$fareType.carrier',
                as: 'carrier',
                cond: {$cond:[{$ne:[airlineIC,'']},{$eq:[airlineIC,'$$carrier.airlineIC']},true]}
            }}
        }},
        { $unwind: '$carrier'},
        { $project: {
            IATAOwner: 1,
            contractOwner: 1,
            startDate: 1,
            expirationDate: 1,
            origin: 1,
            destination: 1,
            restrictions: 1,
            airline: '$carrier.airlineIC',
            category: {$filter:{
                input: '$carrier.category',
                as: 'category',
                cond: {$cond:[{$setEquals:[category,[]]},true,{$in:['$$category.title',category]}]}
            }}
        }},
        { $unwind: '$category' },
        { $project: {
            IATAOwner: 1,
            contractOwner: 1,
            startDate: 1,
            expirationDate: 1,
            origin: 1,
            destination: 1,
            restrictions: 1,
            airline: 1,
            category: '$category.title',
            classes: '$category.classes'
        }},
        { $unwind: '$classes' },
        { $project: {
            IATAOwner: 1,
            contractOwner: 1,
            startDate: 1,
            expirationDate: 1,
            origin: 1,
            destination: 1,
            restrictions: 1,
            airline: 1,
            category: 1,
            classes: '$classes.title',
            commission: '$classes.commission',
            idSubContract: '$classes._id'
        }}
    ]);
    return contracts;
}*/

// airline - origin - destination - category - class - commission - details (contractOwner,iataOwner,start,exp)
export async function searchCommission(req,res,next){
    const filters = req.body;
    let query = {};
    if(filters.iata){ query['IATAOwner']=filters.iata };
    if(req.user.capability!='admin' && req.user.capability!='manager'){ query['visibility']=req.user.lvlAgent };
    query['expirationDate'] = { $gt: new Date() };
    let output = await Contract.find(query);
    let contractsValidID = output.map(e=>{return e._id});
    let fareValid = !filters.typeFly?1:filters.typeFly==1?2:3;
    if(filters.airlineSearch==''){filters.airlineSearch=null}; 
    if(!filters.originSearch && !filters.destinationSearch){
        let contract = await Contract.aggregate([
            {$project:{
                IATAOwner: 1,codeContract:1,contractOwner:1,expirationDate:1,startDate:1,zones:1
            }},
            {$match:{$expr:{$in:['$_id',contractsValidID]}}},
            {$unwind: '$zones'},
            {$project: {
                IATAOwner: 1,codeContract:1,contractOwner:1,expirationDate:1,startDate:1,
                restrictions:'$zones.restrictions',restrictionFT:'$zones.restrictionFT',carriers:'$zones.carriers'
            }},
            {$unwind:'$carriers'},
            {$match:{$expr:{$cond:[filters.airlineSearch,{$eq:[{$toObjectId:filters.airlineSearch},'$carriers.id']},true]}}},
            {$project:{
                IATAOwner: 1,codeContract:1,contractOwner:1,expirationDate:1,startDate:1,restrictions:1,restrictionFT:1,
                carrierID:'$carriers.id',categories:'$carriers.categories'
            }},
            {$unwind:'$categories'},
            {$project:{
                IATAOwner: 1,codeContract:1,contractOwner:1,expirationDate:1,startDate:1,restrictions:1,restrictionFT:1,carrierID:1,
                category:'$categories.title',classess:'$categories.classess'
            }},
            {$unwind:'$classess'},
            {$project:{
                IATAOwner: 1,codeContract:1,contractOwner:1,expirationDate:1,startDate:1,restrictions:1,restrictionFT:1,carrierID:1,category:1,
                class:'$classess.title',routes:'$classess.routes'
            }},
            {$unwind:'$class'},
            {$match:{$expr:{$cond:[{$eq:[filters.classSearch.length,0]},true,{$in:['$class',filters.classSearch]}]}}},
            {$unwind:'$routes'},
            {$match:{'routes.fareValid':fareValid}},
            {$project:{
                IATAOwner: 1,codeContract:1,contractOwner:1,expirationDate:1,startDate:1,restrictions:1,restrictionFT:1,carrierID:1,category:1,class:1,
                fareValid:'$routes.fareValid',fareType:'$routes.fareType',
                origin:{$cond:[{$eq:[{$size:'$routes.airport_airport'},0]},'$routes.origin.title','$routes.airport_airport']},
                destination:{$cond:[{$eq:[{$size:'$routes.airport_airport'},0]},'$routes.destination.title','$routes.airport_airport']}
            }},
            {$unwind:'$fareType'},
            {$project:{
                IATAOwner: 1,codeContract:1,contractOwner:1,expirationDate:1,startDate:1,restrictions:1,restrictionFT:1,carrierID:1,category:1,class:1,fareValid:1,origin:1,destination:1,
                fareType:'$fareType.title',commission:'$fareType.commission'
            }}
        ]);
        return res.json(contract);
    } else {
        let dataToResponse = [];
        for(let contract of output){
            let regionsOrigin = [];
            let regionsDestination = [];
            if(filters.originSearch || filters.destinationSearch){
                for(let region of contract.regions){
                    if(filters.originSearch){
                        if(region.typeRegion=='airport'){
                            if(region.airport.selected.indexOf(filters.originSearch._id)!=-1){
                                regionsOrigin.push(region.title);
                            }
                        } else if(region.typeRegion=='country'){
                            if(region.country.airportsIncluded.length == 0){
                                if(region.country.title==filters.originSearch.country.countryIC && region.country.airportsExcluded.indexOf(filters.originSearch._id)==-1){
                                    regionsOrigin.push(region.title);
                                }
                            } else {
                                if(region.country.airportsExcluded.indexOf(filters.originSearch._id)==-1){
                                    regionsOrigin.push(region.title);
                                }
                            }
                        } else if(region.typeRegion=='continent'){
                            if(region.continent.airportsExcluded.indexOf(filters.originSearch._id)==-1){
                                if(region.continent.countriesIncluded.length != 0){
                                    if(region.continent.countriesIncluded.indexOf(filters.originSearch.country.countryIC) != -1){
                                        regionsOrigin.push(region.title);
                                    }
                                } else{
                                    if(region.continent.countriesExcluded.length != 0){
                                        if(region.continent.countriesExcluded.indexOf(filters.originSearch.country.countryIC) == -1 && region.continent.subregion==filters.originSearch.continent.subregion){
                                            regionsOrigin.push(region.title);
                                        }
                                    } else if(region.continent.subregion==filters.originSearch.continent.subregion){
                                        regionsOrigin.push(region.title)
                                    }
                                }
                            }
                        } else {
                            if(region.group.airportsExcluded.indexOf(filters.originSearch._id)==-1){
                                if(region.group.countriesIncluded.length != 0){
                                    if(region.group.countriesIncluded.indexOf(filters.originSearch.country.countryIC) != -1){
                                        regionsOrigin.push(region.title);
                                    }
                                } else {
                                    if(region.group.countriesExcluded.length != 0){
                                        if(region.group.countriesExcluded.indexOf(filters.originSearch.country.countryIC) == -1 && region.group.continents.filter(e=>e.region==filters.originSearch.continent.region).length != 0){
                                            if(region.group.continents.filter(e=>e.region==filters.originSearch.continent.region)[0].subregions.indexOf(filters.originSearch.continent.subregion) != -1){
                                                regionsOrigin.push(region.title);
                                            }
                                        }
                                    } else if(region.group.continents.filter(e=>e.region==filters.originSearch.continent.region).length != 0){
                                        if(region.group.continents.filter(e=>e.region==filters.originSearch.continent.region)[0].subregions.indexOf(filters.originSearch.continent.subregion) != -1){
                                            regionsOrigin.push(region.title);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(filters.destinationSearch){
                        if(region.typeRegion=='airport'){
                            if(region.airport.selected.indexOf(filters.destinationSearch._id)!=-1){
                                regionsDestination.push(region.title);
                            }
                        } else if(region.typeRegion=='country'){
                            if(region.country.airportsIncluded.length == 0){
                                if(region.country.title==filters.destinationSearch.country.countryIC && region.country.airportsExcluded.indexOf(filters.destinationSearch._id)==-1){
                                    regionsDestination.push(region.title);
                                }
                            } else {
                                if(region.country.airportsExcluded.indexOf(filters.destinationSearch._id)==-1){
                                    regionsDestination.push(region.title);
                                }
                            }
                        } else if(region.typeRegion=='continent'){
                            if(region.continent.airportsExcluded.indexOf(filters.destinationSearch._id)==-1){
                                if(region.continent.countriesIncluded.length != 0){
                                    if(region.continent.countriesIncluded.indexOf(filters.destinationSearch.country.countryIC) != -1){
                                        regionsDestination.push(region.title);
                                    }
                                } else{
                                    if(region.continent.countriesExcluded.length != 0){
                                        if(region.continent.countriesExcluded.indexOf(filters.destinationSearch.country.countryIC) == -1 && region.continent.subregion==filters.destinationSearch.continent.subregion){
                                            regionsDestination.push(region.title);
                                        }
                                    } else if(region.continent.subregion==filters.destinationSearch.continent.subregion){
                                        regionsDestination.push(region.title)
                                    }
                                }
                            }
                        } else {
                            if(region.group.airportsExcluded.indexOf(filters.destinationSearch._id)==-1){
                                if(region.group.countriesIncluded.length != 0){
                                    if(region.group.countriesIncluded.indexOf(filters.destinationSearch.country.countryIC) != -1){
                                        regionsDestination.push(region.title);
                                    }
                                } else {
                                    if(region.group.countriesExcluded.length != 0){
                                        if(region.group.countriesExcluded.indexOf(filters.destinationSearch.country.countryIC) == -1 && region.group.continents.filter(e=>e.region==filters.destinationSearch.continent.region).length !== 0){
                                            if(region.group.continents.filter(e=>e.region==filters.destinationSearch.continent.region)[0].subregions.indexOf(filters.destinationSearch.continent.subregion) != -1){
                                                regionsDestination.push(region.title);
                                            }
                                        }
                                    } else if(region.group.continents.filter(e=>e.region==filters.destinationSearch.continent.region).length !== 0){
                                        if(region.group.continents.filter(e=>e.region==filters.destinationSearch.continent.region)[0].subregions.indexOf(filters.destinationSearch.continent.subregion) != -1){
                                            regionsDestination.push(region.title);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            dataToResponse.push({owner:contract.contractOwner,Origin:regionsOrigin,destination:regionsDestination});
        }
        let contracts = getContractsRaw(filters,dataToResponse);
        return res.json(contracts);
    }
    /* 
        })
    let airport = filters.originSearh;
    let iata = filters.iata?filters.iata:''; 
    let capability = (req.user.capability=='admin' || req.user.capability=='manager')?'':req.user.lvlAgent;
    let contracts = await getRegionsRaw(airport,iata,capability);
    return res.json(contracts); */
}

let getRegionsRaw = async (airport,iata,capability) => {
    const regions = await Contract.aggregate([
        { $match: {$and:[
            {$expr:{$cond:[{$ne:[capability,'']},{$in:[capability,'$visibility']},true]}},
            {$expr:{$cond:[{$ne:[iata,'']},{$eq:['$IATAOwner',iata]},true]}},
            {expirationDate:{$gte: new Date()}}    
        ]}},
        { $project: {
            _id:0,
            contractID: '$_id',
            regions:1
        }},
        { $unwind: '$regions'},
        {$project:{
            contractID: 1,
            regionName: '$regions.title',
            regionContent: {$switch:{branches:[
                {case: {$eq:['$regions.typeRegion','airport']},then: '$regions.airport'},
                {case: {$eq:['$regions.typeRegion','country']},then: '$regions.country'},
                {case: {$eq:['$regions.typeRegion','continent']},then: '$regions.continent'},
                {case: {$eq:['$regions.typeRegion','group']},then: '$regions.group'}
            ]}}
        }}
        /* { $match: {'regions.airports.airportIC':airport}},
        { $project: {
            contractID: 1,
            regionName: '$regions.title'
        }} */
    ]); 
    return regions;
}