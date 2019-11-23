export default function({store,error,router}){
    if(store.state.auth.authUser==null || store.state.auth.authUser.lastPwdChange!=null){
        error({
            message: 'You are not authorized',
            statusCode: 403
        })
    }
}