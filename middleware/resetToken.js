export default function({store,redirect,app,route}){
    let re = new RegExp('^.*\-.*\-.*\-.*\-.*$');
    if(route.params.token.length!=36 || !route.params.token.match(re)){
        return redirect(`${app.localePath('index')}`)
    }
}