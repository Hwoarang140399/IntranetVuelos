import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const state = () => ({
    authUser: null,
    access_token: null,
    firstLogin: false,
    firstTime: true,
    firstChangePwd: false,
    token: false,
    userToRecover: null
})

export const mutations = {
    setUser(state, user){
        if(user==null){
            this._vm.$socket.emit('logout',state.authUser._id);
            state.authUser=null
        } else {
            state.authUser=user
        }
    },
    setFirstLogin(state,val){
        state.firstLogin = val
    },
    setFirstTime(state,val){
        state.firstTime = val
    },
    setFirstChange(state,val){
        state.firstChangePwd = val
    },
    toggleToken(state,val){
        state.token=val
    },
    setUserToRecover(state,val){
        state.userToRecover=val
    },
    setAccessToken(state,val){
        state.access_token=val
    }
}

export const actions = {
    login({commit, dispatch},{email,password}){
        return new Promise(async (res,rej)=>{
            const fields = {email: email,password: password}
            const res1 = await fetch('/api/user/login',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(fields)
            });
            const data = await res1.json();
            if(data.hasOwnProperty('message')){
                res(data);
            } else {
                cookies.set('token',data.token,{path:'/',maxAge: (60*60*1000)})
                commit('setAccessToken',data.token);
                const user = data.userToSend;
                commit('setUser',user);
                if(user.lastLogout==undefined){
                    commit('setFirstLogin',true);
                    commit('setFirstChange',true);
                    res({status:true});
                }
                res({status:false});
            }
        })
    },
    firstLogin({commit,state},{id,password}){
        return new Promise(async (res,rej)=>{
            const result = await fetch(`/api/user/login/${id}`,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.access_token}`
                },
                body: JSON.stringify({email:id,password:password})
            })
            const data = await result.json();
            commit('setFirstLogin',false);
            commit('setFirstChange',false);
            res(data.status)
        });
    },
    toggleToken({commit},val){
        commit('toggleToken',val);
    },
    logout({commit}){
        cookies.remove('token');
        commit('setUser',null);
        commit('setFirstTime',true);
    },
    notFirstTime({commit}){
        commit('setFirstTime', false);
    },
    setFirstChange({commit},val){
        commit('setFirstChange', val);
    },
    setUserToRecover({commit},val){
        commit('setUserToRecover',val)
    },
    setUser({commit},val){
        commit('setUser',val)
    }
}

export const getters = {
    toastConfirmLogin: state => {
        return state.authUser==null?null:{name: state.authUser.name, gender: state.authUser.gender}
    },
    userID: state => {
        return state.authUser==null?null:state.authUser._id
    },
    userNameUC: state => {
        return state.authUser==null?null:`${state.authUser.name.toUpperCase()}!`
    },
    userNameFC: state => {
        return state.authUser==null?null:`${state.authUser.name.slice(0,1).toUpperCase()}${state.authUser.name.slice(1)}`
    },
    userGenderUC: state => {
        return state.authUser==null?null:{name:state.authUser.name.toUpperCase(),gender:state.authUser.gender}
    },
    userCapability: state => {
        return state.authUser.capability
    }
}