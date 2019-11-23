export default {
    title: 'CONTRACTS OF TRAVELMAX',
    filterOwner: 'Contract Owner',
    filterCode : 'Contract Code',
    iata: {
        label: 'IATA Owner',
        ph: 'USA',
        both: 'BOTH'
    },
    select: 'Unselect all',
    table: {
        iata: 'IATA',
        owner: 'Owner',
        code: 'Code',
        author: 'Author',
        edit: 'Edit',
        details: 'Details',
        moreInfo: {
            title: 'More Info ...',
            dates: 'The contract was created in {creation} and is valid since {start} to {end}.',
            visibility: 'Is available to this kind of agents: ',
            logs: 'Check last updates'
        },
        expire: 'Time to expire',
        days: 'days',
        empty: 'The contract does not exist'
    },
    logs: {
        title: `Update Log's`,
        table: {
            subject: 'Subject',
            description: 'Description',
            user: 'User',
            date: 'Date',
            logs: 'Logs'
        }
    }
}