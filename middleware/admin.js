export default function({store,error}){
    if(store.state.auth.authUser==null){
        error({
            message: 'You need to login.',
            statusCode: 403
        })
    } else if(store.state.auth.authUser.capability!='admin'){
        error({
            message: 'You are not authorized.',
            statusCode: 403
        })
    }
}