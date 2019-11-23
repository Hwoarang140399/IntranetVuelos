import error from './error/recovery';

export default {
    title: 'Password recovery',
    submit: 'Submit',
    descriptionET1: 'Please, enter your email or registered user.',
    descriptionET2: 'We will generate a token to recover your password.',
    descriptionIT: 'Please, enter the token that we delivered to your email to recover your password.',
    labelET: 'Username or email',
    labelIT: 'Security token',
    labelSwitchET: 'Already have a token',
    labelSwitchIT: 'Sent a token to my email',
    successTitle: 'Successful validation!',
    tokenSuccessDescription: 'The validation of the token was successful, you will be redirected to a section where you can recover your password.',
    userSuccessDescription: 'An email has been sent to {email} with the steps to follow',
    userSuccessDescriptionCopy: 'An email has been forwarded to {email} with the steps to follow',
    error: error
}