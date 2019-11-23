export default function({store,error}){
    if(store.state.auth.userToRecover==null){
        error({
            message: 'You are not authorized',
            statusCode: 403
        })
    }
}