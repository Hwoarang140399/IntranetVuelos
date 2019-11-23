<template>
    <section class="section">
        <form @submit.prevent="validateBeforeSubmit">
            <div class="row justify-content-center">
                <div :class="index==0?'col-12':'col-12 pt-4'" :key="index" v-for="(zone,index) in zones">
                    <b-collapse @open="zones.map(zone=>zone.collapse=false);zone.collapse=true;" :open.sync="zone.collapse" class="card d-block" :aria-id="`zoneID${index}`">
                        <div slot="trigger" slot-scope="props" role="button" :aria-controls="`zoneID${index}`" class="bg-secondary text-white card-header">
                            <div class="columns container is-paddingless">
                                <div class="col has-text-centered mr-auto">
                                    <b-tooltip class="w-75" type="is-light" :label="zone.name?`Zone's title`:''" animated dashed>
                                        <input v-model="zone.name" placeholder="Zone title" class="text-white w-100 bg-secondary has-text-centered is-paddingless border-0 text-uppercase font-weight-bold"/>
                                    </b-tooltip>
                                </div>
                                <div class="col-auto is-paddingless">
                                    <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                                </div>
                                <div class="col-auto pl-1 pr-0">
                                    <b-icon @click.native="deleteZone(index)" icon="close-circle-outline"/>
                                </div>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="columns">
                                <div class="column is-4 pt-0 text-center">
                                    <a @click="addRoute(index)" class="button is-text"><b-icon icon="plus-circle-outline" size="is-small"/>&nbsp;Add Route</a>
                                </div>
                                <div class="column is-4 pt-0 text-center">
                                    <a @click="addCarrier(index)" class="button is-text"><b-icon icon="plus-circle-outline" size="is-small"/>&nbsp;Add Carrier</a>
                                </div>
                                <div class="column is-4 pt-0 text-center">
                                    <a @click="addCategory(index)" class="button is-text"><b-icon icon="plus-circle-outline" size="is-small"/>&nbsp;Add Category</a>
                                </div>
                            </div>
                            <div class="columns">
                                <table v-if="zone.carriers.length!==0" class="w-100 h-100">
                                    <tr>
                                        <th colspan="3">&nbsp;</th>
                                        <template v-for="(category,indexCategory) in labelCategories(index)">
                                            <th :key="indexCategory">&nbsp;</th>
                                            <th class="h-100 border border-dark " :key="`${indexCategory}1`" :colspan="category.classess.length==0?'1':category.classess.length">
                                                <b-dropdown position="is-top-right" class="h-100 w-100 align-items-center justify-content-center dropdownCategory" aria-role="list">
                                                    <p slot="trigger" role="button">{{category.title?category.title:'Category'}}</p>
                                                    <b-dropdown-item @click="editCategory(index,indexCategory)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Edit</b-dropdown-item>
                                                    <b-dropdown-item @click="deleteCategory(index,indexCategory)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete</b-dropdown-item>
                                                    <b-dropdown-item @click="addClass(index,indexCategory)" aria-role="listitem"><b-icon icon="star" size="is-small"/>&nbsp;Add a Class</b-dropdown-item>
                                                </b-dropdown>
                                            </th>
                                        </template>
                                    </tr>
                                    <template v-for="(airline,indexCarrier) in zone.carriers">
                                        <tr :key="indexCarrier">
                                            <th style="vertical-align:middle;" v-if="indexCarrier==0" class="border border-dark" :rowspan="zone.carriers.length" colspan="2">Marketing Carrier</th>
                                            <th class="border border-dark">
                                                <b-dropdown position="is-top-right" class="dropdownCategory" aria-role="list">
                                                    <p slot="trigger" role="button">{{airline.code?airline.code:'Carrier'}}</p>
                                                    <b-dropdown-item @click="editCarrier(index,indexCarrier)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Edit</b-dropdown-item>
                                                    <b-dropdown-item @click="deleteCarrier(index,indexCarrier)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete</b-dropdown-item>
                                                </b-dropdown>
                                            </th>
                                            <template v-for="(category,indexCategory) in airline.categories">
                                                <th :key="indexCategory">&nbsp;</th>
                                                <td :key="`4${indexCategory}`" v-if="category.classess.length==0" class="border border-dark">-</td>
                                                <template v-for="(classData,indexData) in category.classess">
                                                    <td class="border border-dark" :key="`1${indexCategory}${indexData}`">
                                                        <b-dropdown position="is-top-right" class="w-100 justify-content-center dropdownCategory" aria-role="list">
                                                            <p slot="trigger" role="button">{{labelClassess(classData.title)}}</p>
                                                            <b-dropdown-item @click="editClass(index,indexCarrier,indexCategory,indexData)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Edit</b-dropdown-item>
                                                            <b-dropdown-item @click="setAllClass(index,indexCarrier,indexCategory,indexData)" aria-role="listitem"><b-icon icon="all-inclusive" size="is-small"/>&nbsp;Set as All</b-dropdown-item>
                                                            <b-dropdown-item @click="deleteClass(index,indexCarrier,indexCategory,indexData)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete</b-dropdown-item>
                                                            <b-dropdown-item @click="deleteClassColumn(index,indexCategory,indexData)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete Column</b-dropdown-item>
                                                        </b-dropdown>
                                                    </td>
                                                </template>
                                            </template>
                                        </tr>
                                    </template>
                                    <template v-for="fareValid in 3">
                                        <template v-for="(route,indexRoute) in labelRoutes(index,fareValid)">
                                            <tr v-if="indexRoute==0" :key="`${indexRoute}${fareValid}`" >
                                                <th v-if="fareValid==1"><p class="help pt-3">Ticket Origin</p></th>
                                                <th v-if="fareValid==1"><p class="help pt-3">Ticket Destination</p></th>
                                                <th v-if="fareValid==1">
                                                    <b-dropdown class="dropdownFareType w-100 mt-0 justify-content-center" position="is-top-right" aria-role="list">
                                                        <p class="help pt-3" slot="trigger" role="button">Fare Type<sup v-if="zone.restrictionFT.length!=0">1</sup></p>
                                                        <b-dropdown-item @click="setFareType(index)" class="pt-n3" aria-role="listitem"><b-icon icon="car-brake-alert" size="is-small"/>&nbsp;Define Fare Type</b-dropdown-item>
                                                    </b-dropdown>
                                                </th>
                                                <th v-if="fareValid!=1" :colspan="3">&nbsp;</th>
                                                <th>&nbsp;</th>
                                                <th :colspan="totalClassess(index)">
                                                    <p class="help pt-3">
                                                        {{fareValid==1?'Commissions valid for one-way & round-trip fares':fareValid==2?'Commissions valid for one-way fare products':'Commissions valid for round-trip fare products'}}
                                                    </p>
                                                </th>
                                            </tr>
                                            <tr v-if="indexRoute!==0" :key="`${indexRoute}${route.numberRoute}`">
                                                <td><p class="mt-n3">&nbsp;</p></td>
                                            </tr>
                                            <tr :key="`1${indexFT}${indexRoute}${route.numberRoute}`" v-for="(fareType,indexFT) in route.fareType">
                                                <template v-if="indexFT==0">
                                                    <template v-if="route.aa.length==0">
                                                        <td style="vertical-align:middle;" :rowspan="route.fareType.length" class="border border-dark h-100">
                                                            <b-dropdown position="is-top-right" class="align-items-center justify-content-center w-100 h-100 dropdownRoute" aria-role="list">
                                                                <p slot="trigger" role="button">{{route.origin.title?route.origin.title:'Origin'}}
                                                                    <sup>{{getRestrictions(index,route.numberRoute,true,true)}}</sup>
                                                                </p>
                                                                <b-dropdown-item @click="editRegion(index,route.numberRoute,true)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Select Region</b-dropdown-item>
                                                                <b-dropdown-item @click="editRegionSpecial(index,route.numberRoute)" aria-role="listitem"><b-icon icon="airport" size="is-small"/>&nbsp;Set airport-airport</b-dropdown-item>
                                                                <b-dropdown-item @click="clearRegion(index,route.numberRoute,true)" aria-role="listitem"><b-icon icon="close" size="is-small"/>&nbsp;Clear</b-dropdown-item>
                                                                <b-dropdown-item @click="deleteRegion(index,route.numberRoute)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete Route</b-dropdown-item>
                                                            </b-dropdown>
                                                        </td>
                                                        <td style="vertical-align:middle;" :rowspan="route.fareType.length" class="border border-dark h-100">
                                                            <b-dropdown position="is-top-right" class="align-items-center justify-content-center w-100 h-100 dropdownRoute" aria-role="list">
                                                                <p slot="trigger" role="button">{{route.destination.title?route.destination.title:'Destination'}}
                                                                    <sup>{{getRestrictions(index,route.numberRoute,true,false)}}</sup>
                                                                </p>
                                                                <b-dropdown-item @click="editRegion(index,route.numberRoute,false)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Select Region</b-dropdown-item>
                                                                <b-dropdown-item @click="editRegionSpecial(index,route.numberRoute)" aria-role="listitem"><b-icon icon="airport" size="is-small"/>&nbsp;Set airport-airport</b-dropdown-item>
                                                                <b-dropdown-item @click="clearRegion(index,route.numberRoute,false)" aria-role="listitem"><b-icon icon="close" size="is-small"/>&nbsp;Clear</b-dropdown-item>
                                                                <b-dropdown-item @click="deleteRegion(index,route.numberRoute)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete Route</b-dropdown-item>
                                                            </b-dropdown>
                                                        </td>
                                                    </template>
                                                    <template v-else>
                                                        <td style="vertical-align:middle;" :colspan="2" :rowspan="route.fareType.length" class="border border-dark h-100">
                                                            <b-dropdown position="is-top-right" class="align-items-center justify-content-center w-100 h-100 dropdownRoute" aria-role="list">
                                                                <p slot="trigger" role="button">{{labelAirportAirport(route.aa)}}
                                                                    <sup>{{getRestrictions(index,route.numberRoute,false)}}</sup>
                                                                </p>
                                                                <b-dropdown-item @click="editRegionSpecial(index,route.numberRoute)" aria-role="listitem"><b-icon icon="airport" size="is-small"/>&nbsp;Edit airport-airport</b-dropdown-item>
                                                                <b-dropdown-item @click="clearRegionSpecial(index,route.numberRoute)" aria-role="listitem"><b-icon icon="close" size="is-small"/>&nbsp;Clear</b-dropdown-item>
                                                                <b-dropdown-item @click="deleteRegion(index,route.numberRoute)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete Route</b-dropdown-item>
                                                            </b-dropdown>
                                                        </td>
                                                    </template>
                                                </template>
                                                <td class="border border-dark">
                                                    <b-dropdown position="is-top-right" class="h-100 w-100 align-items-center justify-content-center dropdownCategory" aria-role="list">
                                                        <p slot="trigger" class="help" role="button">{{fareType.title?fareType.title:'All'}}</p>
                                                        <b-dropdown-item @click="addFareType(index,route.numberRoute)" aria-role="listitem"><b-icon icon="comment-plus" size="is-small"/>&nbsp;Add</b-dropdown-item>
                                                        <b-dropdown-item @click="editFareType(index,route.numberRoute,indexFT)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Edit</b-dropdown-item>
                                                        <b-dropdown-item v-if="route.fareType.length>1" @click="deleteFareType(index,route.numberRoute,indexFT)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete</b-dropdown-item>
                                                    </b-dropdown>
                                                </td>
                                                <template v-for="(category,indexCategory) in zone.carriers[0].categories">
                                                    <td :key="`1${indexFT}${indexRoute}${indexCategory}`">&nbsp;</td>
                                                    <template v-for="(classess,indexClass) in category.classess">
                                                        <td class="border border-dark" :key="`1${indexFT}${indexRoute}${indexCategory}${indexClass}`">
                                                            <p class="h-100 align-items-center d-flex justify-content-center" @click="editCommission(index,indexCategory,indexClass,route.numberRoute,indexFT)">{{labelCommission(classess,route.numberRoute,indexFT)}} %</p>
                                                        </td>
                                                    </template>
                                                </template>
                                            </tr>
                                        </template>
                                    </template>
                                </table>
                            </div>
                            <div class="columns content mb-0 pt-4">
                                <h5>Restrictions:</h5>
                            </div>
                            <div v-if="zone.restrictionFT.length!=0" class="row pb-2 has-text-weight-bold">
                                <div class="col-3"><p><sup>{{zone.restrictionFT[0].index}}</sup>Fare Types defined</p></div>
                                <div class="col">
                                    <div :key="indexR" class="row" v-for="(rr,indexR) in zone.restrictionFT[0].restrictions">
                                        <div class="col-2">
                                            <p class="text-right">{{rr.title?rr.title:'All'}}:</p>
                                        </div>
                                        <div class="col">
                                            <p style="word-break: break-all;">{{rr.value}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row pb-2 has-text-weight-bold" :key="index1" v-for="(restriction,index1) in zone.restrictions">
                                <template v-if="restriction.index!=1">
                                    <div class="col-7">
                                        <p><sup>{{restriction.index}}</sup>{{restriction.restriction}}</p>
                                    </div>
                                    <div v-if="restriction.example" class="col-4">
                                        <div class="row">
                                            <div class="col-3 is-paddingless text-center">
                                                <p>Examples:</p>
                                            </div>
                                            <div class="col-8">
                                                <div :key="indexExample" v-for="(example,indexExample) in restriction.example.split('\n')"><p v-if="example">{{example}}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div :class="restriction.example?'col-auto':'col-auto offset-4'">
                                        <div class="row">
                                            <div class="px-0 pr-1 col-auto"><b-icon @click.native="editRestriction(index,index1)" icon="pencil" size="is-small"/></div>
                                            <div class="px-0 pl-1 col-auto"><b-icon @click.native="deleteRestriction(index,index1)" icon="delete" size="is-small"/></div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <div class="columns">
                                <a @click="setRestriction(index)" class="button help is-text"><b-icon icon="plus-circle-outline" size="is-small"/>&nbsp;Add new restriction</a>
                            </div>
                        </div>
                    </b-collapse>
                </div>
            </div>
            <div v-if="zones.length==0" class="class columns is-centered">
                <div class="column is-10 has-text-centered">
                    <p>{{$t('pages.mngContract.create.steps.1.zero')}}</p>
                </div>
            </div>
            <div class="columns pt-2 is-centered">
                <div class="column is-10 has-text-centered">
                    <a @click="addZone" class="button is-text help"><b-icon icon="plus-circle-outline" size="is-small"/> &nbsp;Add Zone</a>
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column is-10 has-text-centered">
                    <button type="submit" class="button is-dark">Save</button>
                </div>
            </div>
        </form>    
    </section>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Vue from 'vue';
import Carrier from '~/components/manageContract/carrier.vue';
import Classess from '~/components/manageContract/class.vue';
import Region from '~/components/manageContract/region.vue';
import AirportToAirport from '~/components/manageContract/aa.vue';
import addRegion from '~/components/manageContract/addRegion.vue';
import Restrictions from '~/components/manageContract/restrictions.vue';
import FareType from '~/components/manageContract/fareType.vue';

class zoneClass {
    constructor(name = null, collapse=true,
        carriers= [{
            id: null,
            code: null,
            name: null,
            categories: [{
                title: null,
                classess: [{
                    title: [],
                    routes: [{
                        origin: {
                            title: null,
                            isRegion: false
                        },
                        destination: {
                            title: null,
                            isRegion: false
                        },
                        aa: [],
                        fareValid: 1,
                        numberRoute: 0,
                        fareType: [{
                            title: null,
                            commission: 0
                        }]
                    }]
                }]
            }]
        }],
        restrictions=[],
        restrictionFT=[]
        )
    {
        this.name = name;
        this.carriers = carriers;
        this.restrictionFT = restrictionFT;
        this.restrictions = restrictions;
        this.collapse = collapse;
    }
}

export default {
    data(){
        return {
            zones: []
        }
    },
    beforeMount(){
        if(this.contractToAdd.zones){
            this.zones = JSON.parse(JSON.stringify(this.contractToAdd.zones));
        } else {
            this.zones.push(new zoneClass());
        }
    },
    methods:{
        validateBeforeSubmit(){
            let find = false;
            let log = '';

            loopZones: 
            for(let indexZone in this.zones){

                /* Validamos que la zona tenga su nombre */
                if(!this.zones[indexZone].name){
                    find = true;
                    log = 'Define un nombre de la zona';
                    break loopZones;
                }

                for(let indexCarrier in this.zones[indexZone].carriers){
                    /* Validamos que en esta zona, todos los carriers hayan sido definidos. */
                    if(!this.zones[indexZone].carriers[indexCarrier].id){
                        find = true;
                        log = 'Elegir un carrier';
                        break loopZones;
                    } 
                }

                for(let indexCategory in this.zones[indexZone].carriers[0].categories){
                    /* Validamos que en esta zona, todas las categorias hayan sido nombradas. */
                    if(!this.zones[indexZone].carriers[0].categories[indexCategory].title){
                        find = true;
                        log = 'Definir un nombre de categoría';
                        break loopZones;
                    }
                }
                
                loopCarriers:
                for(let indexCarrier in this.zones[indexZone].carriers){
                    for(let indexCategory in this.zones[indexZone].carriers[indexCarrier].categories){
                        for(let indexClassess in this.zones[indexZone].carriers[indexCarrier].categories[indexCategory].classess){
                            /* Validamos que haya al menos una clase que tenga un nombre para todo un carrier. */
                            if(this.zones[indexZone].carriers[indexCarrier].categories[indexCategory].classess[indexClassess].title.length!=0){
                                continue loopCarriers;
                            }
                        }
                    }
                    find = true;
                    log = 'Definir un nombre de clase';
                    break loopZones;
                }

                for(let indexRoute in this.zones[indexZone].carriers[0].categories[0].classess[0].routes){
                    let route = this.zones[indexZone].carriers[0].categories[0].classess[0].routes[indexRoute];
                    if((!route.origin.title || !route.destination.title) && (route.aa.length==0)){
                        find = true;
                        log='Definir el origen y destino de la ruta';
                        break loopZones;
                    }
                }
            }

            if(find){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: log
                });
                return 
            } 
            let dataToSend = {
                zones: this.zones
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
            this.zones = JSON.parse(JSON.stringify(this.contractToAdd.zones));
        },
        addZone(){
            this.zones.map(zone=>zone.collapse=false);
            this.zones.push(new zoneClass());
        },
        deleteZone(index){
            this.zones.splice(index,1);
        },
        editCategory(index,index1){
            this.$buefy.dialog.prompt({
                message: `New category name?`,
                inputAttrs: {
                    placeholder: 'e.g. Economy',
                    class: "text-uppercase",
                    value: this.zones[index].carriers[0].categories[index1].title
                },
                onConfirm: (value) => {
                    this.zones[index].carriers.map(carrier=>{
                        carrier.categories[index1].title= value.toUpperCase();
                    });
                }
            })
        },
        deleteCategory(index,index1){
            if(this.zones[index].carriers[0].categories.length===1){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'There must be at least 1 category.'
                });
            } else {
                this.zones[index].carriers.map(carrier=>{
                    carrier.categories.splice(index1,1);
                });
            }
        },
        addCategory(index){
            let routes = JSON.parse(JSON.stringify(this.zones[index].carriers[0].categories[0].classess[0].routes));
            this.zones[index].carriers.map(carrier=>{
                carrier.categories.push({
                    title: null,
                    classess: [{
                        title: [],
                        routes
                    }]
                });
            });
        },
        editCarrier(index,index1){
            let notPick = this.zones[index].carriers.filter(carrier=>carrier.id!==this.zones[index].carriers[index1].id);
            this.$buefy.modal.open({
                parent: this,
                component: Carrier,
                hasModalCard: true,
                props: {value:this.zones[index].carriers[index1],notPick},
                events: {
                    'newCarrier': valueFinal =>{
                        this.zones[index].carriers[index1].id=valueFinal._id;
                        this.zones[index].carriers[index1].code=valueFinal.airlineIC;
                        this.zones[index].carriers[index1].name=valueFinal.airlineName;
                    }
                }
            });
        },
        deleteCarrier(index,index1){
            if(this.zones[index].carriers.length===1){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'There must be at least 1 carrier.'
                });
            } else {
                this.zones[index].carriers.splice(index1,1);
            }
        },
        addCarrier(index){
            let categories = JSON.parse(JSON.stringify(this.zones[index].carriers[0].categories));
            this.zones[index].carriers.push({
                id: null,
                code: null,
                categories
            });
        },
        deleteClass(index,index1,index2,index3){
            this.zones[index].carriers[index1].categories[index2].classess[index3].title.splice(0);
        },
        deleteClassColumn(index,index1,index2){
            if(this.zones[index].carriers[0].categories.length===1){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'There must be at least 1 category.'
                });
            } else {
                this.zones[index].carriers.map(carrier=>{
                    if(carrier.categories[index1].classess.length==1){
                        carrier.categories.splice(index1,1);
                    } else {
                        carrier.categories[index1].classess.splice(index2,1);
                    }
                });
            }
        },
        addClass(index,index1){
            let routes = JSON.parse(JSON.stringify(this.zones[index].carriers[0].categories[0].classess[0].routes));
            this.zones[index].carriers.map(carrier=>{
                carrier.categories[index1].classess.push({title:[],routes});
            });
        },
        editClass(index,index1,index2,index3){
            let notPick = [];
            let findAll = false;
            forCategories: for(let indexCategories in this.zones[index].carriers[index1].categories){
                for(let indexClassess in this.zones[index].carriers[index1].categories[indexCategories].classess){
                    if(indexCategories!=index2){
                        if(this.zones[index].carriers[index1].categories[indexCategories].classess[indexClassess].title.indexOf('All')!==-1){
                            findAll = true;
                            break forCategories;
                        }
                        this.zones[index].carriers[index1].categories[indexCategories].classess[indexClassess].title.map(e=>{
                            notPick.push(e);
                        });
                    } else if(indexClassess!=index3){
                        if(this.zones[index].carriers[index1].categories[indexCategories].classess[indexClassess].title.indexOf('All')!==-1){
                            findAll = true;
                            break forCategories;
                        }
                        this.zones[index].carriers[index1].categories[indexCategories].classess[indexClassess].title.map(e=>{
                            notPick.push(e);
                        });
                    }
                }
            }
            if(findAll){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'All the classess are already set up, clear it if you want to edit!'
                });
                return 
            }
            this.$buefy.modal.open({
                parent: this,
                component: Classess,
                hasModalCard: true,
                props: {value:this.zones[index].carriers[index1].categories[index2].classess[index3].title,notPick},
                events: {
                    'editClassF': valueFinal => {
                        this.zones[index].carriers[index1].categories[index2].classess[index3].title = valueFinal.data.splice(0);
                    }
                }
            });
        },
        setAllClass(index,index1,index2,index3){
            for(let indexCategories in this.zones[index].carriers[index1].categories){
                for(let indexClassess in this.zones[index].carriers[index1].categories[indexCategories].classess){
                    if(indexCategories!=index2){
                        this.zones[index].carriers[index1].categories[indexCategories].classess[indexClassess].title.splice(0);
                    } else if(indexClassess!=index3){
                        this.zones[index].carriers[index1].categories[indexCategories].classess[indexClassess].title.splice(0);
                    }
                }
            }
            this.zones[index].carriers[index1].categories[index2].classess[index3].title.splice(0);
            this.zones[index].carriers[index1].categories[index2].classess[index3].title.push('All');
        },
        addRoute(index){
            this.$buefy.modal.open({
                parent: this,
                component: addRegion,
                hasModalCard: true,
                events: {
                    'addRoute': valueFinal => {
                        if(valueFinal.oneWay){
                            if(valueFinal.roundTrip){
                                let numberRoute = this.zones[index].carriers[0].categories[0].classess[0].routes.length;
                                this.zones[index].carriers.map(carrier=>{
                                    carrier.categories.map(cat=>{
                                        cat.classess.map(classess=>{
                                            classess.routes.push({
                                                origin: {
                                                    title: null,
                                                    isRegion: false
                                                },
                                                destination: {
                                                    title: null,
                                                    isRegion: false
                                                },
                                                aa: [],
                                                fareValid: 1,
                                                numberRoute: numberRoute,
                                                fareType: [{
                                                    title: null,
                                                    commission: 0
                                                }]
                                            });
                                        });
                                    });
                                });
                            } else {
                                let numberRoute = this.zones[index].carriers[0].categories[0].classess[0].routes.length;
                                this.zones[index].carriers.map(carrier=>{
                                    carrier.categories.map(cat=>{
                                        cat.classess.map(classess=>{
                                            classess.routes.push({
                                                origin: {
                                                    title: null,
                                                    isRegion: false
                                                },
                                                destination: {
                                                    title: null,
                                                    isRegion: false
                                                },
                                                aa: [],
                                                fareValid: 2,
                                                numberRoute: numberRoute,
                                                fareType: [{
                                                    title: null,
                                                    commission: 0
                                                }]
                                            })
                                        })
                                    })
                                });
                            }
                        } else {
                            let numberRoute = this.zones[index].carriers[0].categories[0].classess[0].routes.length;
                            this.zones[index].carriers.map(carrier=>{
                                carrier.categories.map(cat=>{
                                    cat.classess.map(classess=>{
                                        classess.routes.push({
                                            origin: {
                                                title: null,
                                                isRegion: false
                                            },
                                            destination: {
                                                title: null,
                                                isRegion: false
                                            },
                                            aa: [],
                                            fareValid: 3,
                                            numberRoute: numberRoute,
                                            fareType: [{
                                                title: null,
                                                commission: 0
                                            }]
                                        })
                                    })
                                })
                            });
                        }
                    }
                }
            })
        },
        editRegion(index,numberRoute,type){
            let route = this.zones[index].carriers[0].categories[0].classess[0].routes.filter(e=>e.numberRoute==numberRoute)[0];
            let value = type?route.origin.title:route.destination.title;
            let notPick = type?route.destination.title:route.origin.title;
            this.$buefy.modal.open({
                parent: this,
                component: Region,
                hasModalCard: true,
                props: {value,notPick},
                events: {
                    'editRegion': valueFinal => {
                        if(type){
                            this.zones[index].carriers.map(carrier=>{
                                carrier.categories.map(cat=>{
                                    cat.classess.map(classess=>{
                                        let routeTemp = classess.routes.filter(e=>e.numberRoute==numberRoute)[0];
                                        routeTemp.origin.title = valueFinal;
                                        routeTemp.origin.isRegion = true;
                                    });
                                });
                            });
                        } else {
                            this.zones[index].carriers.map(carrier=>{
                                carrier.categories.map(cat=>{
                                    cat.classess.map(classess=>{
                                        let routeTemp = classess.routes.filter(e=>e.numberRoute==numberRoute)[0];
                                        routeTemp.destination.title = valueFinal;
                                        routeTemp.destination.isRegion = true;
                                    });
                                });
                            });
                        }
                    }
                }
            });
        },
        editRegionSpecial(index,numberRoute){
            this.$buefy.modal.open({
                parent: this,
                component: AirportToAirport,
                hasModalCard: true,
                props: {value:this.zones[index].carriers[0].categories[0].classess[0].routes.filter(e=>e.numberRoute==numberRoute)[0].aa},
                events: {
                    'editRegionSpecial': valueFinal => {
                        this.zones[index].carriers.map(carrier=>{
                            carrier.categories.map(cat=>{
                                cat.classess.map(classess=>{
                                    classess.routes.filter(e=>e.numberRoute==numberRoute)[0].aa = valueFinal.splice(0);
                                });
                            });
                        });
                    }
                }
            })
        },
        deleteRegion(index,numberRoute){
            if(this.zones[index].carriers[0].categories[0].classess[0].routes.length===1){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'There must be at least 1 route.'
                });
                return 
            }
            this.zones[index].carriers.map(carrier=>{
                carrier.categories.map(cat=>{
                    cat.classess.map(classess=>{
                        classess.routes=classess.routes.filter(route=>route.numberRoute!==numberRoute);
                    });
                });
            });
        },
        clearRegion(index,numberRoute,type){
            if(type){
                this.zones[index].carriers.map(carrier=>{
                    carrier.categories.map(cat=>{
                        cat.classess.map(classess=>{
                            let routeTemp = classess.routes.filter(e=>e.numberRoute==numberRoute)[0]
                            routeTemp.origin.title = null;
                            routeTemp.origin.isRegion = false;
                        });
                    });
                });
            } else {
                this.zones[index].carriers.map(carrier=>{
                    carrier.categories.map(cat=>{
                        cat.classess.map(classess=>{
                            let routeTemp = classess.routes.filter(e=>e.numberRoute==numberRoute)[0]
                            routeTemp.destination.title = null;
                            routeTemp.destination.isRegion = false;
                        });
                    });
                });
            }
        },
        clearRegionSpecial(index,numberRoute){
            this.zones[index].carriers.map(carrier=>{
                carrier.categories.map(cat=>{
                    cat.classess.map(classess=>{
                        classess.routes.filter(e=>e.numberRoute==numberRoute)[0].aa.splice(0);
                    });
                });
            });
        },
        setRestriction(index){
            let routes = [];
            this.zones[index].carriers[0].categories[0].classess[0].routes.map(route=>{
                if(route.aa.length==0){
                    if(route.origin.title && routes.indexOf(route.origin.title)==-1){
                        routes.push(route.origin.title);
                    }
                    if(route.destination.title && routes.indexOf(route.destination.title)==-1){
                        routes.push(route.destination.title);
                    }
                } else {
                    let val = this.labelAirportAirport(route.aa);
                    if(routes.indexOf(val)==-1){
                        routes.push(val);
                    }
                }
            });
            if(routes.length==0){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'Set a region first'
                });
                return;
            }
            this.$buefy.modal.open({
                parent: this,
                component: Restrictions,
                hasModalCard: true,
                props: {routes},
                events: {
                    'setRestrictions': valueFinal => {
                        if(this.zones[index].restrictions.filter(e=>e.data==valueFinal.region).length==0){
                            let indice = this.zones[index].restrictions.length==0?2:(this.zones[index].restrictions.filter(e=>e.index==1).length==0?this.zones[index].restrictions.length+2:this.zones[index].restrictions.length+1);
                            this.zones[index].restrictions.push({index:indice,data:valueFinal.region,restriction:valueFinal.restriction,example:valueFinal.example});
                        } else {
                            this.$swal({
                                toast:true,
                                position: 'top',
                                showConfirmButton: false,
                                timer: 3500,
                                type: 'error',
                                title: 'This regions has already a restrictions, edit instead of create.'
                            });          
                        }
                    }
                }
            })
        },
        getRestrictions(index,numberRoute,type,type1){
            let value = null;
            let route = this.zones[index].carriers[0].categories[0].classess[0].routes.filter(e=>e.numberRoute==numberRoute)[0];
            if(type){
                if(type1){
                    value = route.origin.title;
                } else {
                    value = route.destination.title;
                }
            } else if(route.aa.length!==0){
                value = this.labelAirportAirport(route.aa);
            }
            
            if(!value){
                return ''
            } else {
                let restriction = this.zones[index].restrictions.filter(e=>{return e.data == value})
                return restriction.length==0?'':restriction[0].index;
            }
        },
        editRestriction(index,index1){
            let routes = [];
            this.zones[index].carriers[0].categories[0].classess[0].routes.map(route=>{
                if(route.aa.length==0){
                    if(route.origin.title && routes.indexOf(route.origin.title)==-1){
                        routes.push(route.origin.title);
                    }
                    if(route.destination.title && routes.indexOf(route.destination.title)==-1){
                        routes.push(route.destination.title);
                    }
                } else {
                    let val = this.labelAirportAirport(route.aa);
                    if(routes.indexOf(val)==-1){
                        routes.push(val);
                    }
                }
            });
            if(routes.length==0){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'Set a region first'
                })
                return;
            }
            let prevValue = this.zones[index].restrictions[index1];
            this.$buefy.modal.open({
                parent: this,
                component: Restrictions,
                hasModalCard: true,
                props: {routes,prevValue},
                events: {
                    'setRestrictions': valueFinal => {
                        this.zones[index].restrictions[index1].restriction=valueFinal.restriction;
                        this.zones[index].restrictions[index1].example=valueFinal.example;
                        this.zones[index].restrictions[index1].data=valueFinal.region;
                    }
                }
            })
        },
        deleteRestriction(index,index1){
            this.$buefy.dialog.confirm({
                title: 'Delete restriction',
                confirmText: 'Delete restriction',
                type: 'is-danger',
                hasIcon: true,
                message: 'Are you sure to <b>delete</b> this restriction?',
                onConfirm: () => {
                    for(let indexRestrictions in this.zones[index].restrictions){
                        if(indexRestrictions>index1){
                            this.zones[index].restrictions[indexRestrictions].index-=1;
                        }
                    }
                    this.zones[index].restrictions.splice(index1,1);
                }
            })
            
        },
        setFareType(index){
            let prevValue = [];
            if( this.zones[index].restrictionFT.filter(e=>e.index==1).length!=0 ){
                prevValue = this.zones[index].restrictionFT.filter(e=>e.index==1)[0].restrictions.slice();
            }
            let fareTypes = [];
            this.zones[index].carriers[0].categories[0].classess[0].routes.map(route=>{
                route.fareType.map(ft=>{
                    if(fareTypes.indexOf(ft.title)==-1){
                        fareTypes.push(ft.title);
                    }
                });
            });

            this.$buefy.modal.open({
                parent: this,
                component: FareType,
                hasModalCard: true,
                props: {fareTypes,prevValue},
                events: {
                    'setRestrictionsS': valueFinal => {
                        if(this.zones[index].restrictionFT.filter(e=>e.index==1).length==0){
                            let restric = valueFinal.restriction.splice(0);    
                            this.zones[index].restrictionFT.push({index:1,restrictions:restric});
                        } else {
                            this.zones[index].restrictionFT.map(e=>{
                                if(e.index==1){
                                    e.restrictions=valueFinal.restriction.splice(0);
                                }
                            })
                        }
                    }
                }
            })
        },
        addFareType(index,numberRoute){
            this.zones[index].carriers.map(carrier=>{
                carrier.categories.map(cat=>{
                    cat.classess.map(classess=>{
                        classess.routes.filter(e=>e.numberRoute==numberRoute)[0].fareType.push({title:null,commission:0});
                    });
                });
            });
        },
        editFareType(index,numberRoute,indexFT){
            this.$buefy.dialog.prompt({
                message: `Write the new Fare Type`,
                inputAttrs: {
                    placeholder: 'Type your fare type',
                    value: this.zones[index].carriers[0].categories[0].classess[0].routes.filter(e=>e.numberRoute==numberRoute)[0].fareType[indexFT].title
                },
                onConfirm: (value) => {
                    this.zones[index].carriers.map(carrier=>{
                        carrier.categories.map(cat=>{
                            cat.classess.map(classess=>{
                                classess.routes.filter(e=>e.numberRoute==numberRoute)[0].fareType[indexFT].title=value;
                            });
                        });
                    });
                }
            })
        },
        deleteFareType(index,numberRoute,indexFT){
            this.zones[index].carriers.map(carrier=>{
                carrier.categories.map(cat=>{
                    cat.classess.map(classess=>{
                        classess.routes.filter(e=>e.numberRoute==numberRoute)[0].fareType.splice(indexFT,1);
                    });
                });
            });
        },
        editCommission(index,indexCategory,indexClass,numberRoute,indexFT){
            this.$buefy.dialog.prompt({
                message: `Insert the new commission`,
                inputAttrs: {
                    type: 'number',
                    placeholder: `Type the new commission`,
                    value: `${this.zones[index].carriers[0].categories[indexCategory].classess[indexClass].routes.filter(e=>e.numberRoute==numberRoute)[0].fareType[indexFT].commission}`,
                    max: 100,
                    min: 0
                },
                onConfirm: (value) => {
                    this.zones[index].carriers.map(carrier=>{
                        carrier.categories[indexCategory].classess[indexClass].routes.filter(e=>e.numberRoute==numberRoute)[0].fareType[indexFT].commission=parseInt(value,10);
                    });
                }
            })
        },
        ...mapActions({
            setFieldsCTA: 'managec/setFieldsCTA',
            completeStep: 'managec/setCompletedStepsToAdd'
        })
    },
    computed:{
        labelCategories(){
            return (index) => this.zones[index].carriers[0].categories;
        },
        labelClassess(){
            return (title) => title.length!==0?title.toString().replace(/,/g,', '):'-';
        },
        labelRoutes(){
            return (index,fareValid) => {
                if(this.zones[index].carriers[0].categories.length==0){
                    return [];
                } else {    
                    return this.zones[index].carriers[0].categories[0].classess[0].routes.filter(e=>e.fareValid==fareValid);
                }
            };
        },
        labelAirportAirport(){
            return (aa) => {
                let labelAA = aa.map(route=>{return `${route.origin.iata}-${route.destination.iata}`});
                return labelAA.toString().replace(/,/g,' /');
            }
        },
        labelCommission(){
            return (classess,numberRoute,indexFT) => classess.routes.filter(e=>e.numberRoute==numberRoute)[0].fareType[indexFT].commission;
        },
        totalClassess(){
            return (index) => {
                let total = 0;
                this.zones[index].carriers[0].categories.map(cat=>{
                    if(cat.classess.length==0){
                        total += 2;
                    } else {
                        total += (cat.classess.length+1);
                    }
                });
                return total;
            }
        },
        ...mapState({
            access_token: state => state.auth.access_token,
            contractToAdd: state=>state.managec.contractToAdd
        })
    }
}
</script>

<style lang="scss">
.dropdownCategory{
    .dropdown-menu{
        padding-top: 0;
        padding-bottom: 0;
        min-width: auto;
        left: 50%;
        .dropdown-content{
            a {
                padding-right: 1rem;
            }
        }
    }
    p {
        max-width: 17ch;
    }
}
.dropdownRoute{
    .dropdown-menu{
        padding-top: 0;
        padding-bottom: 0;
        min-width: auto;
        left: 50%;
        .dropdown-content{
            a {
                padding-right: 1rem;
            }
        }
    }
    p{
        max-width: 24ch;
    }
}
.dropdownFareType{
    .dropdown-menu{
        min-width:auto;
        padding-top: 0;
        padding-bottom: 0;
        margin-bottom: -1rem;
        left: 50%;
        .dropdown-content{
            a{
                padding-right: 1rem;
            }
        }
    }
}
</style>