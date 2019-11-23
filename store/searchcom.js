export const state = () => ({  
    airlines: [],
    airports: []
})
  
export const mutations = {  
    setAirlines(state,val){
        state.airlines=val
    },
    setAirports(state,val){
        state.airports=val
    }
}

export const actions = {
    setAirlines({commit},val){
        commit('setAirlines',val)
    },
    setAirports({commit},val){
        commit('setAirports',val)
    }
}

export const getters = {

}


