export default function({store,error,params}){
    if(store.state.auth.authUser==null){
        error({
            message: 'You need to login.',
            statusCode: 403
        })
    } else if(store.state.auth.authUser.username!=params.username){
        if(store.state.auth.authUser.capability!='manager'&&store.state.auth.authUser.capability!='admin'){
            error({
                message: 'You are not authorized',
                statusCode: 403
            })
        }
    }
}