<template>
    <div class="modal-card" style="width:auto;">
        <section class="content modal-card-body">
            <div class="row px-4 justify-content-center">
                <h2>Add a new restriction</h2>
            </div>
            <div class="row pt-3 px-4">
                <b-field class="w-100" label="Select region" label-position="on-border">
                    <b-select expanded v-model="region">
                        <option
                            v-for="(route,index) in routes"
                            :value="route"
                            :key="index">
                            {{ route }}
                        </option>
                    </b-select>
                </b-field>
            </div>
            <div class="row pt-3 px-4">
                <b-field class="w-100" label="Restriction" label-position="on-border">
                    <b-input v-model="restriction"/>
                </b-field>
            </div>
            <div class="row pt-3 px-4">
                <b-field class="w-100" label="Examples" label-position="on-border">
                    <b-input type="textarea" v-model="example"/>
                </b-field>
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
    props:['routes','prevValue'],
    beforeMount(){
        if(this.prevValue){
            this.restriction=this.prevValue.restriction,
            this.example=this.prevValue.example,
            this.region=this.prevValue.data
        }
    },
    data(){
        return {
            restriction: null,
            example: null,
            region: null
        }
    },
    methods:{
        saveRestrictions(){
            if(!this.restriction){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'Define the restriction before save.'
                }); 
                return 
            }
            this.$emit('setRestrictions',{restriction:this.restriction,region:this.region,example:this.example});
            this.$parent.close()
        }
    }
}
</script>