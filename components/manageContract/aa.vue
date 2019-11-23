<template>
    <div class="modal-card" style="width:auto;">
        <section class="content modal-card-body">
            <div class="row justify-content-center">
                <h2>Set Airport to Airport Route</h2>
            </div>

            <div class="row pt-3 dropdownCategory1">
                <div class="col">
                    <b-field label-position="on-border" label="Origin">
                        <b-autocomplete
                            v-model="nameAirportOriginUppercase"
                            :data="dataAirport"
                            placeholder="e.g. LIMA"
                            field="airportIC"
                            icon="airplane-takeoff"
                            :keep-first="true"
                            :loading="isFetchingOrigin"
                            @typing="getAirportsOrigin"
                            @blur="selectedAirportOrigin?'':nameAirportOrigin=''"
                            @select="option => {selectedAirportOrigin = option}"
                        >
                            <template slot-scope="props">
                                <div class="media">
                                    <div class="media-content">
                                        <strong>{{props.option.airportIC}}</strong>  <small>{{props.option.airportName}}</small>
                                    </div>
                                </div>
                            </template>
                            <template slot="empty">No results found</template>
                        </b-autocomplete>
                    </b-field>
                </div>
                <div class="col">
                    <b-field label-position="on-border" label="Destination">
                        <b-autocomplete
                            v-model="nameAirportDestinationUppercase"
                            :data="dataAirport"
                            placeholder="e.g. LIMA"
                            icon="airplane-landing"
                            field="airportIC"
                            :keep-first="true"
                            :loading="isFetchingDestination"
                            @typing="getAirportsDestination"
                            @blur="selectedAirportDestination?'':nameAirportDestination=''"
                            @select="option => {selectedAirportDestination = option}"
                        >
                            <template slot-scope="props">
                                <div class="media">
                                    <div class="media-content">
                                        <strong>{{props.option.airportIC}}</strong>  <small>{{props.option.airportName}}</small>
                                    </div>
                                </div>
                            </template>
                            <template slot="empty">No results found</template>
                        </b-autocomplete>
                    </b-field>
                </div>
            </div>
            <div class="row pt-2">
                <div class="col text-center">
                    <a @click="addRoute" class="button is-text">Add Route</a>
                </div>
            </div>

            <div class="row pl-2 pt-2">
                <div class="col-auto help has-text-weight-bold">Current value: {{this.aa.length==0?'None':''}}</div>
                <b-tag :key="index" class="col-auto" v-for="(tag,index) in tagsSelected" closable aria-close-label="Close tag" @close="deleteTag(index)">{{tag}}</b-tag>
            </div>      
            <div class="row text-white pt-3 justify-content-center">
                <a @click="saveRoute" class="mr-2 button is-info">Save</a>
                <a @click="$parent.close()" class="ml-2 button has-background-grey">Cancel</a>
            </div>
        </section>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';
import {mapState} from 'vuex';

export default {
    props:['value'],
    beforeMount(){
        this.aa=this.value.slice();
    },
    data(){
        return {
            dataAirport:[],
            isFetchingOrigin:false,
            isFetchingDestination:false,
            nameAirportOrigin: '',
            selectedAirportOrigin: null,
            nameAirportDestination: '',
            selectedAirportDestination: null,
            aa: []
        }
    },
    methods:{
        getAirportsOrigin: debounce(async function (name) {
            name=name.toUpperCase();
            if (!name.length) {
                this.dataAirport = []
                return
            }
            this.isFetchingOrigin = true
            let result = await fetch(`/api/airport/find/${name}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                }
            });
            let data = await result.json();
            this.dataAirport = data;
            this.isFetchingOrigin = false;
        }, 500),
        getAirportsDestination: debounce(async function (name) {
            name=name.toUpperCase();
            if (!name.length) {
                this.dataAirport = []
                return
            }
            this.isFetchingDestination = true
            let result = await fetch(`/api/airport/find/${name}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                }
            });
            let data = await result.json();
            this.dataAirport = data;
            this.isFetchingDestination = false;
        }, 500),
        addRoute(){
            if(this.selectedAirportOrigin && this.selectedAirportDestination){
                if(this.aa.filter(e=>e.origin.id==this.selectedAirportOrigin._id && e.destination.id==this.selectedAirportDestination._id).length==0){
                    this.aa.push({origin:{id:this.selectedAirportOrigin._id,iata:this.selectedAirportOrigin.airportIC},destination:{id:this.selectedAirportDestination._id,iata:this.selectedAirportDestination.airportIC}});
                    this.selectedAirportOrigin=null;
                    this.selectedAirportDestination=null;
                    this.nameAirportOrigin='';
                    this.nameAirportDestination='';    
                } else {
                    this.$swal({
                        toast:true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 2500,
                        type: 'error',
                        title: 'This route already exists.'
                    })    
                }
            } else {
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'Please, select both routes.'
                })
            }
        },
        deleteTag(index){
            this.aa.splice(index,1);
        },
        saveRoute(){
            this.$emit('editRegionSpecial',this.aa);
            this.$parent.close()
        }
    },
    computed:{
        tagsSelected(){
            return this.aa.map(e=>{return `${e.origin.iata}-${e.destination.iata}`})
        },
        nameAirportOriginUppercase: {
            get: function(){
                return this.nameAirportOrigin
            }, 
            set: function(val){
                this.nameAirportOrigin=val.toUpperCase()
            }
        },
        nameAirportDestinationUppercase: {
            get: function(){
                return this.nameAirportDestination
            }, 
            set: function(val){
                this.nameAirportDestination=val.toUpperCase()
            }
        },
        ...mapState({
            access_token: state=>state.auth.access_token
        })
    }
}
</script>