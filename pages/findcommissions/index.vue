<template>
    <section class="section">
        <div class="box">
            <div class="row">
                <div class="mx-2">
                    <b-dd :text="`Fare : ${toSearch.typeFly?toSearch.typeFly==1?'Round Trip':'One Way':'All'}`" size="sm" variant="button is-white">
                        <b-dd-item-button @click="toSearch.typeFly=1">Round Trip</b-dd-item-button>
                        <b-dd-item-button @click="toSearch.typeFly=2">One Way</b-dd-item-button>
                        <b-dd-item-button @click="toSearch.typeFly=null">All</b-dd-item-button>
                    </b-dd>
                </div>
                <div class="mx-2">
                    <b-dd :text="`IATA : ${toSearch.iata?toSearch.iata:'ALL'}`" size="sm" variant="button is-white">
                        <b-dd-item-button @click="toSearch.iata='USA'">USA</b-dd-item-button>
                        <b-dd-item-button @click="toSearch.iata='PERU'">PERU</b-dd-item-button>
                        <b-dd-item-button @click="toSearch.iata=null">ALL</b-dd-item-button>
                    </b-dd>
                </div>
            </div>    
            <div class="row pt-2">
                <div class="col inputAirport">
                    <b-field 
                        :type="(nameAirportOriginUppercase==nameAirportDestinationUppercase && nameAirportOriginUppercase!='')?'is-danger':''" 
                        :message="(nameAirportOriginUppercase==nameAirportDestinationUppercase && nameAirportOriginUppercase!='')?'Origin and Destination cannot be the same':''"
                        label="Origin"
                    >
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
                            @select="option => {selectedAirportOrigin = option;if(option){toSearch.originSearch=option}else{toSearch.originSearch=null}}"
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
                <div class="col inputAirport">
                    
                    <b-field 
                        :type="(nameAirportDestinationUppercase==nameAirportOriginUppercase && nameAirportDestinationUppercase!='')?'is-danger':''" 
                        :message="(nameAirportDestinationUppercase==nameAirportOriginUppercase && nameAirportDestinationUppercase!='')?'Origin and Destination cannot be the same':''"
                        label="Destination"
                    >
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
                            @select="option => {selectedAirportDestination = option;if(option){toSearch.destinationSearch=option}else{toSearch.destinationSearch=null}}"
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
                <div class="col-3 inputAirport">
                    <b-field label="Airline">
                        <b-autocomplete
                            v-model="nameAirlineUppercase"
                            :data="dataAirline"
                            placeholder="e.g. Avianca"
                            icon="airplane"
                            field="airlineIC"
                            :keep-first="true"
                            :loading="isFetchingAirline"
                            @typing="getAirlines"
                            @blur="selectedAirline?'':nameAirline=''"
                            @select="option => {selectedAirline = option;if(option){toSearch.airlineSearch=option._id}else{toSearch.airlineSearch=''}}"
                        >
                            <template slot-scope="props">
                                <div class="media">
                                    <div class="media-content">
                                        <strong>{{props.option.airlineIC}}</strong> -  <small>{{props.option.airlineName}}</small>
                                    </div>
                                </div>
                            </template>
                            <template slot="empty">No results found</template>
                        </b-autocomplete>
                    </b-field>
                </div>
                <div class="col-2">
                    <b-field label="Fare Class" class="inputAirport">
                        <b-dropdown v-model="toSearch.classSearch" multiple aria-role="list">
                            <button class="button is-white" type="button" slot="trigger">
                                <span>Selected: ({{toSearch.classSearch.length>3?toSearch.classSearch.length:(toSearch.classSearch.length==0?'none':toSearch.classSearch.toString())}})</span><b-icon icon="menu-down"/>
                            </button>
                            <b-dropdown-item type="is-info" :value="classLetter" :key="index" aria-role="listitem" v-for="(classLetter,index) in classArray">
                                <span>{{classLetter}}</span>
                            </b-dropdown-item>
                        </b-dropdown>
                    </b-field>
                </div>
            </div>
            <div class="columns pt-4 is-centered">
                <button type="button" @click="search?clearSearch():searchCommission()" class="button is-dark">{{searchLabel}}</button>
            </div>
        </div>
        <search-result v-if="search" :toSearch="toSearch"/>
    </section>
</template>

<script>

import searchResult from '~/components/searchResult'
import Cookies from 'universal-cookie';
import {mapState,mapActions} from 'vuex';
import { Promise } from 'q';
import debounce from 'lodash/debounce';

class ToSearch {
  constructor(
        typeFly = null,
        airlineSearch = null, 
        originSearch = null, 
        destinationSearch = null, 
        classSearch = [],
        iata = null
    ) {
    this.typeFly = typeFly;
    this.airlineSearch = airlineSearch;
    this.originSearch = originSearch;
    this.destinationSearch = destinationSearch;
    this.classSearch = classSearch;
    this.iata=iata;
  }
}

export default {
    nuxtI18n: {
        paths: {
            en: '/findcommissions',
            es: '/buscarcomisiones'
        }
    },
    layout: 'navbar-normal',
    components:{
        'search-result' : searchResult
    },
    middleware: 'auth',
    data(){
        return{
            toSearch: new ToSearch(),
            classArray: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
            dataAirport:[],
            isFetchingOrigin:false,
            isFetchingDestination:false,
            dataAirline:[],
            isFetchingAirline:false,
            nameAirportOrigin: '',
            selectedAirportOrigin: null,
            nameAirportDestination: '',
            selectedAirportDestination: null,
            nameAirline: '',
            selectedAirline: null,
            searchLabel: 'Search',   
            search: false
        }
    },
    methods:{
        ...mapActions({
            setAirlines: 'searchcom/setAirlines',
            setAirports: 'searchcom/setAirports'
        }),
        clearSearch(){
            this.search=false;
            this.searchLabel='Search';
            this.toSearch = new ToSearch();
            this.nameAirline= '';
            this.selectedAirline= null;
            this.nameAirportOrigin= '';
            this.selectedAirportOrigin= null;
            this.nameAirportDestination= '';
            this.selectedAirportDestination= null;
        },
        searchCommission(){
            if(this.toSearch.originSearch!=this.toSearch.destinationSearch || !this.toSearch.originSearch){
                this.search=true;
                this.searchLabel='Clear';
            } else {
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'Please, check the fields.'
                });
            }
        },
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
            this.dataAirline = data;
            this.isFetchingAirline = false;
        }, 500)
    },
    computed:{
        ...mapState({
            airportsStore: state=>state.searchcom.airports,
            airlinesStore: state=>state.searchcom.airlines,
            access_token: state=>state.auth.access_token
        }),
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
        nameAirlineUppercase: {
            get: function(){
                return this.nameAirline
            }, 
            set: function(val){
                this.nameAirline=val.toUpperCase()
            }
        }
    }
}
</script>

<style lang="scss">
.inputAirport {
    .dropdown-menu{
        border: none;
    }
    .dropdown-content{
        position: absolute;
    }
}
</style>