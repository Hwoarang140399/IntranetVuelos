<template>
    <div class="modal-card" style="width:auto;">
        <section class="content modal-card-body">
            <div class="row justify-content-center">
                <h2>Edit Carrier</h2>
            </div>

            <div class="row pt-3 dropdownCategory1">
                <b-autocomplete
                    v-model="airline"
                    :data="dataAirline"
                    placeholder="e.g. Avianca"
                    icon="airplane"
                    field="airlineIC"
                    :keep-first="true"
                    :loading="isFetchingAirline"
                    @typing="getAirlines"
                    @blur="selectedAirline?'':nameAirline=''"
                    @select="option => {selectedAirline = option}"
                >
                    <template slot-scope="props">
                        <div class="media">
                            <div class="d-block media-content">
                                <strong>{{props.option.airlineIC}}</strong> -  <small>{{props.option.airlineName}}</small>
                            </div>
                        </div>
                    </template>
                    <template slot="empty">No results found</template>
                </b-autocomplete>
            </div>
            <p class="help pt-3">Current value: {{value.code?value.name:'-'}} <span v-if="value.code"><strong>({{value.code}})</strong></span></p>
            <strong><p class="help mt-n2">New Value: {{selectedAirline?selectedAirline.airlineIC:'-'}}</p></strong>
        
            <div class="row text-white pt-3 justify-content-center">
                <a @click="saveCarrier" class="mr-2 button is-info">Save</a>
                <a @click="$parent.close()" class="ml-2 button has-background-grey">Cancel</a>
            </div>
        </section>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';
import {mapState} from 'vuex';

export default {
    props:['value','notPick'],
    data(){
        return {
            dataAirline: [],
            isFetchingAirline: false,
            airline: null,
            selectedAirline: null
        }
    },
    methods:{
        getAirlines: debounce(async function (name) {
            name=name.toUpperCase();
            if (!name.length) {
                this.dataAirline = []
                return
            }
            this.isFetchingAirline = true
            let result = await fetch(`/api/airline/find/${name}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                }
            });
            let data = await result.json();
            this.dataAirline = data.filter(e=>this.notPick.filter(r=>r.id==e._id).length==0);
            this.isFetchingAirline = false;
        }, 500),
        saveCarrier(){
            if(this.selectedAirline){
                this.$emit('newCarrier',this.selectedAirline);
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
    },
    computed:{
        ...mapState({
            access_token: state=>state.auth.access_token
        })
    }
}

</script>

<style lang="scss">
.dropdownCategory1{
    .dropdown-menu{
        border:none;
    }
    .dropdown-content{
        position: fixed;
    }
}
</style>

