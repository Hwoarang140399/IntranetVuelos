<template>
    <div class="modal-card" style="width:auto;">
        <section class="content modal-card-body">
            <div class="row px-4 justify-content-center">
                <h2>Define Fare types</h2>
            </div>
            <div class="row pt-1 px-4">
                <p class="help">Define the restriction for each Fare Type</p>
            </div>
            <div :key="index" class="row pt-3 px-4" v-for="(fT,index) in restriction">
                <div v-if="fT" class="col-4"><p style="word-break: break-all;"><strong>{{fT.title?fT.title:'All'}} :</strong></p></div>
                <div v-if="fT" class="col-7">
                    <b-input type="textarea" v-model="fT.value"/>
                </div>
                <div class="col-1">
                    <b-icon @click.native="deleteRestriction(index)" icon="close-circle" type="is-danger" size="is-small"/>
                </div>
            </div>
            <div class="row text-white pt-3 justify-content-center">
                <a @click="saveRestrictions" class="mr-2 button is-info">Save</a>
                <a @click="$parent.close()" class="ml-2 button has-background-grey">Cancel</a>
            </div>
        </section>
        
    </div>
</template>

<script>

export default {
    props:['fareTypes','prevValue'],
    beforeMount(){
        if(this.prevValue){
            this.restriction = this.prevValue.slice();
        } 
        this.fareTypes.map(d=>{
            if(this.restriction.filter(e=>e.title==d).length==0){
                this.restriction.push({title:d,value:null});
            }
        })
    },
    data(){
        return {
            restriction: []
        }
    },
    methods:{
        saveRestrictions(){
            this.$emit('setRestrictionsS',{restriction:this.restriction});
            this.$parent.close()
        },
        deleteRestriction(index){
            this.restriction.splice(index,1);
        }
    }
}
</script>