import secrets from './secret'

export default {
    signinEmail: (user,pwd) => {
        return `
                <h1>¡Bienvenido a Travelmax ${user.name}!</h1>
                <p>Se te ha asignado una cuenta dentro de nuestra intranet, te compartimos tu información para que puedas utilizarla.</p>
                <p>
                <strong>email:</strong> ${user.email}<br>
                <strong>username:</strong> ${user.username}<br>
                <strong>password:</strong> ${pwd}<br></p>
                <p>Por favor, recuerda actualizar tu contraseña la primera vez que ingreses a nuestra intranet.</p>
                `
    },
    forgotPassword: (user) => {
        return `
                <h1>Hola ${user.name}!</h1>
                <p>Estás recibiendo este email por una petición de una nueva contraseña. 
                Por favor, entra al siguiente link o copialo en la dirección de tu navegador para completar el proceso:</p>
                <a href="${secrets.baseUrl}/resetpassword/${user.resetPasswordToken}">CLICK HERE</a>   
                <p><em>Si no has solicitado esto ignora este email y verifica tus cuentas.</em></p>
                <p><em>Si tienes problemas con el enlace, copia este enlace y pégalo en tu navegador:</em></p>
                <p><em>${secrets.baseUrl}/resetpassword/${user.resetPasswordToken}</em></p>
                `
    },
    confirmResetPassword: (user) => {
        return `
                <h1>Hola ${user.name}!</h1>
                <p>This is a confirmation that the password for your accout ${user.email} has been changed.</p>
                You can explore Travelmax's intranet again, <a href="${secrets.baseUrl}">Click here</a>.
                <p><em>Si no has solicitado esto ignora este email y verifica tus cuentas.</em></p>
                `
    }
}