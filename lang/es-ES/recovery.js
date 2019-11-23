import error from './error/recovery';

export default {
    title: 'Recuperación de contraseña',
    submit: 'Enviar',
    descriptionET1: 'Por favor, ingresa tu correo electrónico o usuario registrado.',
    descriptionET2: 'Generaremos un token y podrá recuperar su contraseña.',
    descriptionIT: 'Por favor, ingresa el token que se te envió al correo electrónico para recuperar tu contraseña.',
    labelET: 'Usuario o correo eletrónico',
    labelIT: 'Token de seguridad',
    labelSwitchET: 'Ya tengo un token',
    labelSwitchIT: 'Enviar un token a mi correo electrónico',
    successTitle: '¡Validación exitosa!',
    tokenSuccessDescription: 'La validación del token fue exitosa, se te redirigirá a una sección donde podrás recuperar tu contraseña.',
    userSuccessDescription: 'Se ha enviado un correo electrónico a {email} con los pasos a seguir',
    userSuccessDescriptionCopy: 'Se ha reenviado un correo electrónico a {email} con los pasos a seguir',
    error: error
}