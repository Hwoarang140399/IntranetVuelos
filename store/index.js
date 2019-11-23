import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';

export const state = () => ({  })
  
export const mutations = {  }

export const getters = {  }

export const actions = {
    async nuxtServerInit({ commit }, { req }){
        const cookies = new Cookies(req.headers.cookie);
        if(cookies.get('token')){
            if(new Date().getTime()/1000<jwtDecode(cookies.get('token')).exp){
                commit('auth/setAccessToken',cookies.get('token'));
                const res = await fetch(`${process.env.baseUrl}/api/user/validtoken`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.get('token')}`
                    }
                });
                const user = await res.json();
                commit('auth/setUser',user);
                if(user.lastLogout==undefined){
                    commit('auth/setFirstLogin',true) 
                }
                if(user.lastPwdChange==undefined){
                    commit('auth/setFirstChange',true)
                }
                commit('auth/setFirstTime',false);
                if(user.capability=='manager' || user.capability=='admin'){
                    const res = await fetch(`${process.env.baseUrl}/api/user/`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${cookies.get('token')}`
                        }
                    });
                    const data = await res.json();
                    commit('manageu/setUsers',data);
                }
            } else {
                cookies.remove('token');
            }
        }
  },
  /* isAbsent({commit},{val,id}){
    this._vm.$socket.emit('isAbsent',id);
    commit('isAbsent',val)
  } */
}