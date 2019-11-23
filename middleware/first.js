export default function({store,redirect,app,route,from}){
    if(store.state.auth.firstChangePwd){
        let lang = app.i18n._vm.locale;
        if(route.path !== `${app.localePath('firstlogin')}` ){
            if(route.path !== `${app.localePath('firstlogin',lang=='es'?'en':'es')}`){
                return redirect(`${app.localePath('firstlogin')}`)
            } 
        }
    }
}