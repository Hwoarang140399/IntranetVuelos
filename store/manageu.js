import Vue from 'vue'

export const state = () => ({
    users: null,
    usersImg: {},
    userImgChunk: []
});

export const mutations = {
    setUsers(state,val){
        state.users = val
    },
    deleteUsers(state,val){
        state.users.splice(state.users.indexOf(state.users.filter(user1=>user1.username==val.username)[0]),1);
    },
    setUsersImg(state,val){
        Vue.set(state.usersImg,val.id,val.img)
    },
    SOCKET_IMGFOUNDUSER(state,message){
        state.userImgChunk=[]
        state.userImgChunk=message.slice();
    }
}

export const actions = {
    async fillUsers({commit,rootState}){
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${rootState.auth.access_token}`
        })
        const result = await fetch('/api/user/',{
            method: 'GET',
            headers: myHeaders
        })
        const data = await result.json();
        commit('setUsers',data);
    },
    deleteUsers({commit},val){
        commit('deleteUsers',val);
    },
    setUsersImg({commit},val){
        commit('setUsersImg',val);
    }
}

export const getters = {
    getUser: state => (username) => {
        return state.users==null?null:state.users.filter(user=>user.username==username)[0]
    },
    getImgUser: state => (id) => {
        return state.usersImg[id]
    }
}
