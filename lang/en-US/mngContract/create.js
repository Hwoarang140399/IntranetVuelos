export default {
    navigation: {
        left:'Previous', 
        right: 'Next'
    },
    steps: {
        0: {
            label: 'Basic Information',
            owner: 'Contract Owner',
            code: 'Contract Code',
            iata: 'IATA Owner',
            preview: 'Preview',
            logo: 'Drop or click to upload logo',
            iataPh: 'USA',
            visibility: 'Visibility',
            dates: 'Valid Dates',
            datesValid: 'This contract will be valid for {days} day{s}',
            upload: 'Upload contract (PDF)',
            submit: 'Save',
            empty: 'No results for {input}'
        },
        1: {
            label: 'Zones',
            editRegion: {
                label: 'Regions',
                newRegion: 'New Region',
                name: 'Region Name',
                region: 'Is region',
                country: 'Is country',
                continent: 'Is continent',
                group: 'Is group',
                airports: 'Airports',
                airportsE: 'Airports excluded',
                countries: 'Countries',
                countriesE: 'Countries excluded',
                continents: 'Continents',
                continentE: 'Continents excluded',
                airportPH: 'MIA',
                addNewAirport: 'Add new ...',
                duplicated: 'This region name is already used.',
                noResult: 'No results for {input}',
                showAll: 'Show all',
                showLess: 'Hide all',
                zero: 'There will be no regions for this contract.',
                addnewRegion: 'Add new region',
                save: 'Save'
            },
            zero: 'There must be at least one zone for this contract.'
        },
        2: {
            label: 'Finish',
            title: 'Almost done!',
            help: 'Please complete these concise and detailed fields to document your changes.',
            subject: 'Subject',
            description: 'Description',
            submit: 'Submit'
        }
    },
    errors: {
        emptyField: 'Please, complete this field.',
        duplicated: 'This contract code is already used.',
        country: 'Please, select a valid country.',
        continent: 'Please, select a valid continent',
        group: 'Please, select at least 1 continent',
        checkField: 'Please, check the fields',
        save: 'Please, save before going to the next'
    },
    confirm: {
        success: 'Fields saved!'
    }
}