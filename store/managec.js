import Vue from 'vue';

export const state = () => ({
    contracts: null,
    contractToAdd: {},
    stepsCompletedToAdd: [false,false,false],
    activeStep: 0
});

export const mutations = {
    setContracts(state,val){
        state.contracts = val;
    },
    deleteContracts(state,val){
        state.contracts.splice(state.contracts.indexOf(state.contracts.filter(contr=>contr.contractOwner==val.contractOwner)[0]),1);
    },
    setFieldsCTA(state,val){
       for(let field in val){
            if(field=='zones'){
               Vue.set(state.contractToAdd,field,[...val[field]])
            } else {
                Vue.set(state.contractToAdd,field,val[field])
            }
        }
    },
    setCompletedStepsToAdd(state,val){
        state.stepsCompletedToAdd[val.index]=val.val
    },
    setActiveStep(state,val){
        state.activeStep=val;
    }
}

export const actions = {
    async fillContracts({commit,rootState},val){
        const result = await fetch(`${val?process.env.baseUrl:''}/api/contract/basicInfo`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${rootState.auth.access_token}`
            }
        })
        const data = await result.json();
        commit('setContracts',data);
    },
    deleteContracts({commit},val){
        commit('deleteContracts',val);
    },
    setFieldsCTA({commit},val){
        commit('setFieldsCTA',val);
    },
    setActiveStep({commit},val){
        commit('setActiveStep',val);
    },
    setCompletedStepsToAdd({commit},val){
        commit('setCompletedStepsToAdd',val);
    },
    sendCTA({commit,rootState},val){
        commit('setFieldsCTA',val)
        return new Promise(async (res,rej)=>{
            const result = await fetch('/api/contract/',{
                method: 'POST',
                body: JSON.stringify(rootState.managec.contractToAdd),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${rootState.auth.access_token}`
                }
            });
            const data = await result.json();
            let formData = new FormData();
            if(rootState.managec.contractToAdd.contractFile){
                formData.append('id',data.id);
                formData.append('file',rootState.managec.contractToAdd.contractFile);
            }

            let formData1 = new FormData();
            if(rootState.managec.contractToAdd.logo){
                formData.append('id',data.id);
                formData.append('logo',rootState.managec.contractToAdd.logo);
            }
            
            await Promise.all([
                rootState.managec.contractToAdd.contractFile?fetch('/api/contract/upFile',{
                    body: formData,
                    method: 'POST',
                    headers:{
                        'Authorization': `Bearer ${rootState.auth.access_token}`
                    }
                }):true,
                rootState.managec.contractToAdd.logo?fetch('/api/contract/upLogo',{
                    body: formData1,
                    method: 'POST',
                    headers:{
                        'Authorization': `Bearer ${rootState.auth.access_token}`
                    }
                }):true
            ])
            res({status:'ok'});
        })
    }
}

export const getters = {
    getCodes: state => {
        return state.contracts?state.contracts.map(contract=>{return contract.codeContract}):[];
    }   
}
