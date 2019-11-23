import create from './create';
import edit from './edit';

export default {
    create: create,
    edit: edit,
    filterBy: 'Filter by: ',
    header: {
        name: 'Name',
        lastName: 'Last Name',
        company: 'Company',
        email: 'Email',
        capabilities: 'Capabilities',
        edit: 'Edit',
        details: 'Details',
        moreInfo: 'More info ...'
    },
    moreDetails:{
        creationDate: 'Creation Date',
        jobTitle: 'Job Title',
        country: 'Country',
        gender: 'Gender'
    },
    deleteUser: {
        sure: 'Are you sure?',
        content: `You will delete {cant} user{plural}. <br> You won't be able to revert this!`,
        confirm: 'Got it',
        cancel: 'No, cancel!',
        title: 'Successful',
        contentFinal: `The users <strong>{users}</strong> not exists anymore.`,
        titleCancel: 'Cancelled',
        contentCancel: 'This users are safe :)'
    },
    unselect: 'Unselect all',
    male: 'Male',
    female: 'Female',
    empty: `The user doesn't exist`
}