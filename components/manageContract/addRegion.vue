<template>
    <div class="modal-card" style="width:auto;">
        <section class="content modal-card-body">
            <div class="row justify-content-center">
                <h2>Add Region</h2>
            </div>
            <div class="row pt-3">
                <p>Select in which fares are valid the commissions of this new route</p>
            </div>
            <div class="row justify-content-center pt-3">
                <div class="col text-center">
                    <b-checkbox type="is-info" v-model="oneWay">
                        One-Way
                    </b-checkbox>
                </div>
                <div class="col text-center">
                    <b-checkbox type="is-info" v-model="roundTrip">
                        Round-Trip
                    </b-checkbox>
                </div>
            </div>
            <div class="row text-white pt-4 justify-content-center">
                <a @click="addRegion" class="mr-2 button is-info">Save</a>
                <a @click="$parent.close()" class="ml-2 button has-background-grey">Cancel</a>
            </div>
        </section>
    </div>
</template>

<script>

export default {
    data(){
        return {
            oneWay: true,
            roundTrip: true
        }
    },
    methods:{
        addRegion(){
            if(this.oneWay || this.roundTrip){
                this.$emit('addRoute',{oneWay:this.oneWay,roundTrip:this.roundTrip});
                this.$parent.close()
            } else {
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: this.$t('pages.mngContract.create.errors.checkField')
                })
            }
            
        }
    }
}
</script>