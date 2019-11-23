export default function({store,error}){
    if(store.state.auth.authUser==null){
        error({
            message: 'You are not authorized',
            statusCode: 403
        })
    }
}