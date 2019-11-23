<template>
    <section class="section">
        <form @submit.prevent="validateBeforeSubmit">
            <div class="row justify-content-center">
                <div class="col-6 pt-2" :key="index" v-for="(region,index) in regions">
                    <b-collapse @open="regions.map(region=>region.collapse=false);region.collapse=true;" :open.sync="region.collapse" class="card d-block" :aria-id="`regionID${index}`">
                        <div slot="trigger" slot-scope="props" role="button" :aria-controls="`regionID${index}`" :class="(errors.has(`name${index}`) || region.validated || region.duplicated || region.validatedCountry)?'bg-danger text-white card-header':'bg-secondary text-white card-header'">
                            <div class="col-auto mr-auto">
                                <strong><p class="text-white text-uppercase">{{region.name?region.name:$t('pages.mngContract.create.steps.1.newRegion')}}</p></strong>
                            </div>
                            <div class="col-1">
                                <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                            </div>
                            <div class="col-1">
                                <b-icon @click.native="deleteRegion(index)" icon="close-circle-outline"/>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="row">
                                <div class="col-7 pl-4">
                                    <b-field :type="errors.has(`name${index}`)?'is-danger':''" label-position="on-border" :label="$t('pages.mngContract.create.steps.1.name')">
                                        <b-input autocomplete="off" :name="`name${index}`" custom-class="text-uppercase" v-validate="'required'" v-model="region.name"/>
                                    </b-field>
                                    <span v-if="duplicatedRegions(index)" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.steps.1.duplicated')}}</span>
                                    <span v-if="errors.has(`name${index}`)" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                                </div>
                                <div class="col-5 pt-2">
                                    <b-checkbox v-model="region.country">
                                        {{$t('pages.mngContract.create.steps.1.country')}}
                                    </b-checkbox>
                                </div>
                            </div>
                            <div v-if="region.country" class="row">
                                <div class="col-7 pt-3 pl-4">
                                    <b-field :type="(region.validatedCountry && !region.excluded.country.iata)?'is-danger':''" label-position="on-border" label="Country Name">
                                        <b-autocomplete
                                            v-model="region.excluded.country.input"
                                            :data="filteredCountryArray(index)"
                                            placeholder="Peru"
                                            class="inputFields"
                                            field="name"
                                            :keep-first="true"
                                            @select="option=>selectCountry(index,option)"
                                        >
                                            <template slot-scope="props">
                                                <div class="media">
                                                    <div class="media-content">
                                                        <p>{{props.option.emoji}} {{props.option.name}} </p>
                                                    </div>
                                                </div>
                                            </template>
                                            <template slot="empty">No results for {{region.excluded.country.input}}</template>
                                        </b-autocomplete>
                                    </b-field>
                                    <span v-if="region.validatedCountry && !region.excluded.country.iata" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.country')}}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-7 py-3 pl-4">
                                    <b-field :type="(region.validated && region.airports.selected.length==0)?'is-danger':''" label-position="on-border" :label="$t('pages.mngContract.create.steps.1.airports')">
                                        <b-autocomplete
                                            v-model="region.airports.input"
                                            :data="dataAirport"
                                            class="inputFields"
                                            :placeholder="$t('pages.mngContract.create.steps.1.airportPH')"
                                            field="airportIC"
                                            :keep-first="true"
                                            :loading="isFetchingAirport"
                                            @typing="text=>getAirport(index,text)"
                                            @blur="region.airports.input=null"
                                            :clear-on-select="true"
                                            @select="option=>selectAirport(option,index)"
                                        >
                                            <template slot="header">
                                                <a class="text-primary" @click="addAirport">{{$t('pages.mngContract.create.steps.1.addNewAirport')}}</a> 
                                            </template>
                                            <template slot-scope="props">
                                                <div class="media">
                                                    <div class="media-content">
                                                        <strong>{{props.option.airportIC}}</strong>  <small>{{props.option.airportName}}</small>
                                                    </div>
                                                </div>
                                            </template>
                                            <template slot="empty">{{$t('pages.mngContract.create.steps.1.noResult',{input:region.airports.input})}}</template>
                                        </b-autocomplete>
                                    </b-field>
                                    <span v-if="region.validated && region.airports.selected.length==0" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                                </div>
                                <div class="col-5 pt-3">
                                    <div class="row">
                                        <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.airports.selected">
                                            <b-tag v-if="index1<3 || !region.airports.hide" closable @close="deleteAirports(index,index1)" >
                                                {{selected.iata}}
                                            </b-tag>
                                        </div>
                                    </div>
                                    <div class="col-9">
                                        <div class="columns py-3 is-centered">
                                            <div class="col-auto offset-1" v-if="region.airports.selected.length>3">
                                                <p @click="showRestAirports(index)" class="button is-small is-text">{{region.airports.hide?$t('pages.mngContract.create.steps.1.showAll'):$t('pages.mngContract.create.steps.1.showLess')}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="region.country" class="row">
                                <div class="col-7 py-3 pl-4">
                                    <b-field :type="(region.validatedExcluded && region.excluded.airports.selected.length==0)?'is-danger':''" label-position="on-border" :label="$t('pages.mngContract.create.steps.1.airportsE')">
                                        <b-autocomplete
                                            v-model="region.excluded.airports.input"
                                            :data="dataAirport"
                                            class="inputFields"
                                            :placeholder="$t('pages.mngContract.create.steps.1.airportPH')"
                                            field="airportIC"
                                            :keep-first="true"
                                            :loading="isFetchingAirport"
                                            @typing="text=>getExcludedAirport(index,text)"
                                            @blur="region.excluded.airports.input=null"
                                            :clear-on-select="true"
                                            @select="option=>selectExcludedAirport(option,index)"
                                        >
                                            <template slot="header">
                                                <a class="text-primary" @click="addAirport">{{$t('pages.mngContract.create.steps.1.addNewAirport')}}</a> 
                                            </template>
                                            <template slot-scope="props">
                                                <div class="media">
                                                    <div class="media-content">
                                                        <strong>{{props.option.airportIC}}</strong>  <small>{{props.option.airportName}}</small>
                                                    </div>
                                                </div>
                                            </template>
                                            <template slot="empty">{{$t('pages.mngContract.create.steps.1.noResult',{input:region.excluded.airports.input})}}</template>
                                        </b-autocomplete>
                                    </b-field>
                                    <!-- <span v-if="region.validatedExcluded && region.excluded.airports.selected.length==0" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span> -->
                                </div>
                                <div class="col-5 pt-3">
                                    <div class="row">
                                        <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.excluded.airports.selected">
                                            <b-tag v-if="index1<3 || !region.excluded.airports.hide" closable @close="deleteExcludeAirports(index,index1)" >
                                                {{selected.iata}}
                                            </b-tag>
                                        </div>
                                    </div>
                                    <div class="col-9">
                                        <div class="columns py-3 is-centered">
                                            <div class="col-auto offset-1" v-if="region.excluded.airports.selected.length>3">
                                                <p @click="showRestExcludedAirports(index)" class="button is-small is-text">{{region.excluded.airports.hide?$t('pages.mngContract.create.steps.1.showAll'):$t('pages.mngContract.create.steps.1.showLess')}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-collapse>
                </div>
            </div>
            <div v-if="regions.length==0" class="columns is-centered">
                <div class="column is-10 has-text-centered">
                    <p>{{$t('pages.mngContract.create.steps.1.zero')}}</p>
                </div>
            </div>
            <div class="columns pt-2 is-centered">
                <div class="column is-10 has-text-centered">
                    <a @click="addRegion" class="button is-text help"><b-icon icon="plus-circle-outline" size="is-small"/> &nbsp;{{$t('pages.mngContract.create.steps.1.addnewRegion')}}</a>
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column is-10 has-text-centered">
                    <button type="submit" class="button is-dark">{{$t('pages.mngContract.create.steps.1.save')}}</button>
                </div>
            </div>
        </form>
    </section>
</template>

<script>
import airport from '~/components/airport.vue';
import debounce from 'lodash/debounce';
import locationData from 'countrycitystatejson';
import {mapState,mapActions} from 'vuex';

class regionClass {
  constructor(name = null, country = false, validated=false, validatedCountry=false, duplicated=false, collapse=true, airports={selected:[],input:null,hide:true},excluded={country:{input:null,iata:null},airports:{selected:[],input:null,hide:true}}) {
    this.name = name;
    this.country = country;
    this.airports = airports;
    this.collapse = collapse;
    this.validated = validated;
    this.duplicated = duplicated;
    this.excluded = excluded;
    this.validatedCountry = validatedCountry
  }
}

export default {
    beforeMount(){
        if(this.contractToAdd.regions){
            if(this.contractToAdd.regions.length!=0){
                this.contractToAdd.regions.map(region=>{
                    let regionTest = new regionClass();
                    regionTest.name=region.title;
                    regionTest.country=region.isCountry;
                    regionTest.airports.selected=region.airports.slice();
                    regionTest.excluded.country.iata=region.country;
                    regionTest.excluded.country.input=this.location.getCountryInfoByShort(region.country).name;
                    regionTest.excluded.airports.selected=region.airportsExcluded.slice();
                    this.regions.push(regionTest);
                })
            }
        } else {
            this.regions.push(new regionClass());
        }
    },
    data(){
        return {
            regions: [],
            isFetchingAirport: false,
            isFetchingExcludedAirport: false,
            dataAirport: [],
            location: locationData
        }
    },
    methods:{
        async validateBeforeSubmit(){
            const result = await this.$validator.validateAll();
            let validatedRegions = false;
            for(let region of this.regions){
                region.validatedCountry = false;
                if(!region.country && region.airports.selected.length==0){
                    region.validatedCountry = true;
                    validatedRegions=true;
                    region.validated=true;
                } else {
                    if(region.country && !region.excluded.country.iata){
                        region.validatedCountry=true;
                        validatedRegions=true;
                    }
                    if(region.duplicated){
                        region.validatedCountry=true;
                        validatedRegions=true;
                    }
                    region.validated=false;
                }
            }
            if(!result){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: this.$t('pages.mngContract.create.errors.checkField')
                })
                return;
            }
            if(validatedRegions){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: this.$t('pages.mngContract.create.errors.checkField')
                })
                return;
            }
            let dataToSend = {regions: []}
            for(let region of this.regions){
                let airportsToSave = region.airports.selected.map(airport=>{return airport})
                let airportsExcluded = region.excluded.airports.selected.map(airport=>{return airport})
                dataToSend.regions.push({title:region.name.toUpperCase(),isCountry:region.country,country:region.excluded.country.iata,airports:airportsToSave,airportsExcluded:airportsExcluded})
            }
            this.setFieldsCTA(dataToSend);
            this.completeStep({index:1,val:true})
            this.$swal({
                toast:true,
                position: 'top',
                showConfirmButton: false,
                timer: 2500,
                type: 'success',
                title: this.$t('pages.mngContract.create.confirm.success')
            })

        },
        addRegion(){
            this.regions.map(region=>region.collapse=false);
            this.regions.push(new regionClass());
        },
        deleteRegion(index){
            this.regions.splice(index,1);
        },
        duplicatedRegions(index){
            if(this.regions.filter(region=>(region.name==this.regions[index].name && this.regions[index].name!=null)).length>1){
                this.regions[index].duplicated=true;
                return true;
            }
            this.regions[index].duplicated=false;
            return false;
        },
        selectAirport(option,index){
            if(option){
                this.regions[index].airports.selected.push({id:option._id,iata:option.airportIC});
            }
        },
        showRestAirports(index){
            this.regions[index].airports.hide=!this.regions[index].airports.hide;
        },
        deleteAirports(index,index1){
            this.regions[index].airports.selected.splice(index1,1);
            if(this.regions[index].airports.selected.length<4 && !this.regions[index].airports.hide){
                this.regions[index].airports.hide=true;
            }
        },
        selectExcludedAirport(option,index){
            if(option){
                this.regions[index].excluded.airports.selected.push({id:option._id,iata:option.airportIC});
            }
        },
        showRestExcludedAirports(index){
            this.regions[index].excluded.airports.hide=!this.regions[index].excluded.airports.hide;
        },
        deleteExcludedAirports(index,index1){
            this.regions[index].excluded.airports.selected.splice(index1,1);
            if(this.regions[index].excluded.airports.selected.length<4 && !this.regions[index].excluded.airports.hide){
                this.regions[index].excluded.airports.hide=true;
            }
        },
        addAirport(){
            this.$modal.open({
                parent: this,
                component: airport,
                hasModalCard: true
            })
        },
        filteredCountryArray(index) {
            return this.location.getCountries().filter(country=>this.regions[index].excluded.country.input?country.name.toLowerCase().indexOf(this.regions[index].excluded.country.input.toLowerCase())>-1:true);
        },
        selectCountry(index,option){
            this.regions[index].excluded.country.iata=option?option.shortName:null;
        },
        getAirport: debounce(async function (index,name) {
            name=name.toUpperCase();
            if (!name.length) {
                this.dataAirport = []
                return
            }
            this.isFetchingAirport = true
            let result = await fetch(`/api/airport/find/${name}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                }
            });
            let data = await result.json();
            this.dataAirport = data.filter(airport=>this.regions[index].airports.selected.indexOf(airport.airportIC)==-1);
            this.isFetchingAirport = false;
        }, 500),
        getExcludedAirport: debounce(async function (index,name) {
            name=name.toUpperCase();
            if (!name.length) {
                this.dataAirport = []
                return
            }
            this.isFetchingExcludedAirport = true
            let result = await fetch(`/api/airport/find/${name}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                }
            });
            let data = await result.json();
            this.dataAirport = data.filter(airport=>this.regions[index].excluded.airports.selected.indexOf(airport.airportIC)==-1);
            this.isFetchingExcludedAirport = false;
        }, 500),
        ...mapActions({
            setFieldsCTA: 'managec/setFieldsCTA',
            completeStep: 'managec/setCompletedStepsToAdd'
        })
    },
    computed:{
        ...mapState({
            access_token: state => state.auth.access_token,
            contractToAdd: state=>state.managec.contractToAdd
        })
    }
}
</script>

<style>
.inputFields .dropdown-menu {
  border: none;
}
.inputFields .dropdown-content {
  position: absolute;
}
</style>