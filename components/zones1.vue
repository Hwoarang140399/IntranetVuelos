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
                                <table class="w-100 h-100">
                                    <tr>
                                        <th colspan="3">&nbsp;</th>
                                        <th v-if="zone.categories.length==0">&nbsp;</th>
                                        <th v-if="zone.categories.length==0"><p :class="zone.carriers.length==0?'border-top border-left border-right border-dark':'border border-dark'">-</p></th>
                                        <template v-for="(category,indexCategory) in zone.categories">
                                            <td :key="`${indexCategory}1`">&nbsp;</td>
                                            <th :key="indexCategory" :colspan="category.data.length">
                                                <b-dropdown position="is-top-right" class="h-100 w-100 mt-0 border border-dark align-items-center justify-content-center dropdownCategory" aria-role="list">
                                                    <p slot="trigger" role="button">{{category.title?category.title:'Category'}}</p>
                                                    <b-dropdown-item @click="editCategory(index,indexCategory)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Edit</b-dropdown-item>
                                                    <b-dropdown-item @click="deleteCategory(index,indexCategory)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete</b-dropdown-item>
                                                    <b-dropdown-item @click="addClass(index,indexCategory)" aria-role="listitem"><b-icon icon="star" size="is-small"/>&nbsp;Add a Class</b-dropdown-item>
                                                </b-dropdown>
                                            </th>
                                        </template>
                                    </tr>
                                    <tr v-if="zone.carriers.length==0">
                                        <th class="border-top border-left border-right border-dark" colspan="2" rowspan="1">Marketing Carrier</th>
                                        <td class="border-top border-right border-dark">-</td>
                                        <template v-if="zone.categories.length==0">
                                            <td>&nbsp;</td>
                                            <td><p class="border border-dark">-</p></td>
                                        </template>
                                        <template v-else>
                                            <template v-for="(category,indexCategory) in zone.categories">
                                                <td :key="`${indexCategory}1`">&nbsp;</td>
                                                <td :colspan="category.data.length" :key="indexCategory"><p class=" mt-0 border-bottom border-left border-right border-dark">-</p></td>
                                            </template>
                                        </template>
                                    </tr>
                                    <tr :key="index1" v-for="(carrierF,index1) in zone.carriers">
                                        <th v-if="index1==0" class="border-top border-left border-dark" style="vertical-align:middle;" colspan="2" :rowspan="zone.carriers.length"><p>Marketing Carrier</p></th>
                                        <th class="border-top border-left border-right border-dark">
                                            <b-dropdown position="is-top-right" class="dropdownCategory" aria-role="list">
                                                <p slot="trigger" role="button">{{carrierF.iata?carrierF.iata:'Carrier'}}</p>
                                                <b-dropdown-item @click="editCarrier(index,index1)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Edit</b-dropdown-item>
                                                <b-dropdown-item @click="deleteCarrier(index,index1)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete</b-dropdown-item>
                                            </b-dropdown>
                                        </th>
                                        <td v-if="zone.categories.length==0">&nbsp;</td>
                                        <td v-if="zone.categories.length==0"><p class="border-left border-right border-bottom border-dark">-</p></td>

                                        <template v-for="(category,index2) in zone.categories">
                                            <template v-for="(data,index3) in category.data"> 
                                                <td v-if="index3==0" :key="`${index1}${index2}${index3}`">&nbsp;</td>
                                                <template v-for="(carrier,index4) in data.carriers">
                                                    <td v-if="index4==index1" :key="`${index1}${index2}${index3}${index4}1`">
                                                        <b-dropdown position="is-top-right" :class="index3==0?'w-100 justify-content-center border-dark border-left border-right border-bottom dropdownCategory':'w-100 justify-content-center border-dark border-bottom border-right dropdownCategory'" aria-role="list">
                                                            <p slot="trigger" role="button">{{carrier.length==0?'-':carrier.toString().replace(/,/g,', ')}}</p>
                                                            <b-dropdown-item @click="editClass(index,index2,index3,index4)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Edit</b-dropdown-item>
                                                            <b-dropdown-item @click="deleteClass(index,index2,index3,index4)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete</b-dropdown-item>
                                                            <b-dropdown-item @click="deleteClassColumn(index,index2,index3,index4)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete Column</b-dropdown-item>
                                                        </b-dropdown>
                                                    </td>
                                                </template>
                                            </template>
                                        </template>
                                    </tr>
                                    <template v-for="(fareValid,indexValid) in zone.routes">
                                        <template v-if="fareValid.length!=0">
                                            <tr :key="`${indexValid}3`">
                                                <template v-if="indexValid==0">
                                                    <th><p class="border-top border-dark help pt-3 mt-0">Ticker Origin</p></th>
                                                    <th><p class="border-top border-dark help pt-3 mt-0">Destination</p></th>
                                                    <th><b-dropdown class="border-top border-dark dropdownFareType w-100 mt-0 justify-content-center" position="is-top-right" aria-role="list">
                                                        <p class="help pt-3 mt-0" slot="trigger" role="button">Fare Type<sup v-if="zone.restrictions.filter(e=>e.index==1).length!=0">1</sup></p>
                                                        <b-dropdown-item @click="setFareType(index)" class="pt-n3" aria-role="listitem"><b-icon icon="car-brake-alert" size="is-small"/>&nbsp;Define Fare Type</b-dropdown-item>
                                                    </b-dropdown></th>
                                                </template>
                                                <template v-else>
                                                    <th colspan="3"><p>&nbsp;</p></th>
                                                </template>
                                                <template v-if="zone.categories.length==0">
                                                    <th>&nbsp;</th>
                                                    <th><p class="help pt-3 mt-0">{{indexValid==0?'Commissions valid for one-way & round-trip fares':`${indexValid==1?'Commissions valid for one-way fares':'Commissions valid for round-trip fares'}`}}</p></th>
                                                </template>
                                                <template v-else>
                                                    <th :colspan="getCantClass(index)"><p class="help pt-3 mt-0">{{indexValid==0?'Commissions valid for one-way & round-trip fares':`${indexValid==1?'Commissions valid for one-way fares':'Commissions valid for round-trip fares'}`}}</p></th>
                                                </template>
                                            </tr>
                                            <template v-for="(route,index1) in fareValid">
                                                <tr v-if="index1!=0" :key="`${indexValid}${index1}1`">
                                                    <td><p class="mt-n3">&nbsp;</p></td>
                                                </tr>
                                                <tr :key="`${indexValid}${index1}${index2}1`" v-for="(fT,index2) in route.fareType">
                                                    <template v-if="index2==0">
                                                        <template v-if="route.aa.length==0">
                                                            <td :rowspan="route.fareType.length" class="h-100">
                                                                <b-dropdown position="is-top-right" class="border border-dark align-items-center justify-content-center w-100 h-100 dropdownRoute" aria-role="list">
                                                                    <p slot="trigger" role="button">{{route.origin?route.origin:'Origin'}}<sup>{{getRestrictions(index,index1,true,indexValid,true)}}</sup></p>
                                                                    <b-dropdown-item @click="editRegion(index,index1,true,indexValid)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Select Region</b-dropdown-item>
                                                                    <b-dropdown-item @click="editRegionSpecial(index,index1,indexValid)" aria-role="listitem"><b-icon icon="airport" size="is-small"/>&nbsp;Set airport-airport</b-dropdown-item>
                                                                    <b-dropdown-item @click="clearRegion(index,index1,true,indexValid)" aria-role="listitem"><b-icon icon="close" size="is-small"/>&nbsp;Clear</b-dropdown-item>
                                                                    <b-dropdown-item @click="deleteRegion(index,index1,indexValid)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete Route</b-dropdown-item>
                                                                </b-dropdown>
                                                            </td>
                                                            <td style="vertical-align:middle;" :rowspan="route.fareType.length" class="h-100">
                                                                <b-dropdown position="is-top-right" class="border-top border-bottom border-dark align-items-center justify-content-center w-100 h-100 dropdownRoute" aria-role="list">
                                                                    <p slot="trigger" role="button">{{route.destination?route.destination:'Destination'}}<sup>{{getRestrictions(index,index1,false,indexValid,true)}}</sup></p>
                                                                    <b-dropdown-item @click="editRegion(index,index1,false,indexValid)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Select Region</b-dropdown-item>
                                                                    <b-dropdown-item @click="editRegionSpecial(index,index1,indexValid)" aria-role="listitem"><b-icon icon="airport" size="is-small"/>&nbsp;Set airport-airport</b-dropdown-item>
                                                                    <b-dropdown-item @click="clearRegion(index,index1,false,indexValid)" aria-role="listitem"><b-icon icon="close" size="is-small"/>&nbsp;Clear</b-dropdown-item>
                                                                    <b-dropdown-item @click="deleteRegion(index,index1,indexValid)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete Route</b-dropdown-item>
                                                                </b-dropdown>
                                                            </td>
                                                        </template>
                                                        <template v-else>
                                                            <td style="vertical-align:middle;" :colspan="2" :rowspan="route.fareType.length" class="h-100">
                                                                <b-dropdown position="is-top-right" class="border-top border-bottom border-left border-dark align-items-center justify-content-center w-100 h-100 dropdownRoute" aria-role="list">
                                                                    <p slot="trigger" role="button">{{getLabelAirports(index,index1,indexValid).toString().replace(/,/g,'/')}}<sup>{{getRestrictions(index,index1,false,indexValid,false)}}</sup></p>
                                                                    <b-dropdown-item @click="editRegionSpecial(index,index1,indexValid)" aria-role="listitem"><b-icon icon="airport" size="is-small"/>&nbsp;Edit airport-airport</b-dropdown-item>
                                                                    <b-dropdown-item @click="clearRegionSpecial(index,index1,indexValid)" aria-role="listitem"><b-icon icon="close" size="is-small"/>&nbsp;Clear</b-dropdown-item>
                                                                    <b-dropdown-item @click="deleteRegion(index,index1,indexValid)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete Route</b-dropdown-item>
                                                                </b-dropdown>
                                                            </td>
                                                        </template>
                                                        <td>
                                                            <b-dropdown position="is-top-right" class="border-dark border h-100 w-100 align-items-center justify-content-center dropdownCategory" aria-role="list">
                                                                <p slot="trigger" class="help" role="button">{{fT}}</p>
                                                                <b-dropdown-item @click="addFareType(index,index1,index2,indexValid)" aria-role="listitem"><b-icon icon="comment-plus" size="is-small"/>&nbsp;Add</b-dropdown-item>
                                                                <b-dropdown-item @click="editFareType(index,index1,index2,indexValid)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Edit</b-dropdown-item>
                                                                <b-dropdown-item v-if="route.fareType.length>1" @click="deleteFareType(index,index1,index2,indexValid)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete</b-dropdown-item>
                                                            </b-dropdown>
                                                        </td>
                                                        <template v-for="(category,indexCategory) in zone.categories">
                                                            <td :key="`${indexCategory}1`">&nbsp;</td>
                                                            <template v-for="(data,indexData) in category.data">
                                                                <td :key="`${indexCategory}${indexData}3`">
                                                                    <p :class="indexData==0?'h-100 align-items-center d-flex justify-content-center border border-dark':'h-100 align-items-center d-flex justify-content-center border-top border-bottom border-right border-dark'" @click="editCommission(index,indexCategory,indexData,index1,indexValid,index2)">{{data.commissions[indexValid][getCantFareType(index,indexValid,index1,index2)]}} %</p>
                                                                </td>
                                                            </template>
                                                        </template>
                                                    </template> 
                                                    <template v-else>
                                                        <td>
                                                            <b-dropdown position="is-top-right" class="border-dark border-left border-bottom border-right h-100 w-100 justify-content-center dropdownCategory" aria-role="list">
                                                                <p slot="trigger" class="help" role="button">{{fT}}</p>
                                                                <b-dropdown-item @click="addFareType(index,index1,index2,indexValid)" aria-role="listitem"><b-icon icon="comment-plus" size="is-small"/>&nbsp;Add</b-dropdown-item>
                                                                <b-dropdown-item @click="editFareType(index,index1,index2,indexValid)" aria-role="listitem"><b-icon icon="pencil" size="is-small"/>&nbsp;Edit</b-dropdown-item>
                                                                <b-dropdown-item v-if="route.fareType.length>1" @click="deleteFareType(index,index1,index2,indexValid)" aria-role="listitem"><b-icon icon="delete" size="is-small"/>&nbsp;Delete</b-dropdown-item>
                                                            </b-dropdown>
                                                        </td>
                                                        <template v-for="(category,indexCategory) in zone.categories">
                                                            <td :key="`${indexCategory}5`">&nbsp;</td>
                                                            <template v-for="(data,indexData) in category.data">
                                                                <td :key="`${indexCategory}${indexData}3`">
                                                                    <p @click="editCommission(index,indexCategory,indexData,index1,indexValid,index2)" :class="indexData==0?'h-100 d-flex justify-content-center align-items-center border-left border-bottom border-right border-dark':'border-bottom border-right border-dark'">
                                                                        {{data.commissions[indexValid][getCantFareType(index,indexValid,index1,index2)]}} %
                                                                    </p>
                                                                </td>
                                                            </template>
                                                        </template>
                                                    </template>
                                                </tr>
                                            </template>
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
                                            <p class="text-right">{{rr.title}}:</p>
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
        carriers=[{
            id: null,
            iata: null
        }],
        routes=[
            [{
                origin: null,
                destination: null,
                aa: [],
                fareType: ['All']
            }],
            [],
            []
        ],
        categories=[{
            title: null,
            data:[{
                commissions:[[0],[],[]],
                carriers: [[]]
            }]
        }],
        restrictions=[],
        restrictionFT=[]
        )
    {
        this.name = name;
        this.carriers = carriers;
        this.routes = routes;
        this.categories = categories;
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
            let log = ''
            for(let indexZone in this.zones){
                if(!this.zones[indexZone].name){
                    find = true;
                    log = 'Define un nombre de la zona'
                }

                if(find){ break; }

                if(this.zones[indexZone].carriers.length==0){
                    find = true;
                    log = "Añade un carrier";
                }
                if(find){ break; }

                if(this.zones[indexZone].categories.length==0){
                    find = true; 
                    log = "Añade una categoría"
                }

                if(find){ break; }

                this.zones[indexZone].carriers.map(carrier=>{
                    if(!carrier.id){
                        find = true;
                        log = 'Elegir un carrier';
                    }
                });

                if(find){ break; }

                this.zones[indexZone].routes.map(fare=>{
                    if(fare.length!=0){
                        fare.map(route=>{
                            if((!route.origin || !route.destination) && route.aa.length==0){
                                find = true;
                                log='Definir el origen y destino de la ruta';                
                            }  
                        })
                    }
                });

                if(find){ break; }
                
                this.zones[indexZone].categories.map(cat=>{
                    if(!cat.title){
                        find = true;
                        log='Definir un nombre de categoría'
                    } else {
                        cat.data.map(data=>{
                            let findTemp = true
                            data.carriers.map(carr=>{
                                if(carr.length!=0){
                                    findTemp = false;
                                }
                            })
                            if(findTemp){
                                find = true;
                                log = 'Definir un nombre de clase'
                            }
                        })
                    }
                })

                if(find){ break; }
            }

            if(find){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: log
                })
            } else {
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
            }
        },
        getCantRoutes(index,indexValid){
            let cont = 0;
            this.zones[index].routes[indexValid].map(route=>{
                cont=cont+route.fareType.length
            });
            return cont;
        },
        getCantFareType(index,indexValid,index1,index2){
            let cont = 0;
            for(let indexRW in this.zones[index].routes[indexValid]){
                if(indexRW<index1){
                    cont+=this.zones[index].routes[indexValid][indexRW].fareType.length
                } else if(indexRW == index1){
                    cont+=index2
                } else {
                    break;
                }
            }
            return cont;
        },
        getCantClass(index){
            let cont = 0;
            this.zones[index].categories.map(cat=>{
                cont+=(cat.data.length+1)
            })
            return cont;
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
                    class: "text-uppercase"
                },
                onConfirm: (value) => {
                    this.zones[index].categories[index1].title = value.toUpperCase();
                }
            })
        },
        deleteCategory(index,index1){
            this.zones[index].categories.splice(index1,1);
        },
        addCategory(index){
            if(this.zones[index].categories.length<6){
                let carrier = [];
                this.zones[index].carriers.map(carrierZ=>{
                    carrier.push([]);
                });
                let commissions = [];
                this.zones[index].routes.map(fareValid=>{
                    let commissionsPartial = []
                    fareValid.map(route=>{
                        route.fareType.map(fT=>{
                            commissionsPartial.push(0)
                        })
                    })
                    commissions.push(commissionsPartial);
                });
                this.zones[index].categories.push({title: null,data:[{commissions:commissions,carriers: carrier}]});
            } else {
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'Only 6 categories can be accepted.'
                })
            }
        },
        editCarrier(index,index1){
            this.$buefy.modal.open({
                parent: this,
                component: Carrier,
                hasModalCard: true,
                props: {value:this.zones[index].carriers[index1]},
                events: {
                    'newCarrier': valueFinal =>{
                        this.zones[index].carriers[index1].id=valueFinal._id;
                        this.zones[index].carriers[index1].iata=valueFinal.airlineIC;
                    }
                }
            });
        },
        deleteCarrier(index,index1){
            this.zones[index].carriers.splice(index1,1);
            this.zones[index].categories.map(cat=>{
                cat.data.map(com=>{
                    com.carriers.splice(index1,1);
                })
            });
        },
        addCarrier(index){
            this.zones[index].carriers.push({id:null,iata:null});
            this.zones[index].categories.map(cat=>{
                cat.data.map(com=>{
                    let carr = []
                    if(com.carriers.length!=0){
                        com.carriers[0].map(e=>{
                            carr.push(e);
                        })
                    }
                    com.carriers.push(carr);
                })
            });
        },
        deleteClass(index,index1,index2,index3){
            this.zones[index].categories[index1].data[index2].carriers[index3].splice(0);
        },
        deleteClassColumn(index,index1,index2,index3){
            this.zones[index].categories[index1].data.splice(index2,1);
        },
        addClass(index,index1){
            if(this.zones[index].carriers.length==0){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 3500,
                    type: 'error',
                    title: 'Add a carrier first.'
                })      
                return;
            }
            let classess = []
            this.zones[index].carriers.map(carrier=>{
                classess.push([]);
            })
            let commissions = [];
            this.zones[index].routes.map(fareValid=>{
                let commissionsPartial = [];
                fareValid.map(route=>{
                    route.fareType.map(fT=>{
                        commissionsPartial.push(0)
                    })
                })
                commissions.push(commissionsPartial);
            })
            this.zones[index].categories[index1].data.push({
                commissions:commissions,
                carriers: classess
            })
        },
        editClass(index,index1,index2,index3){
            let notPick = [];
            for(let indexCat in this.zones[index].categories){
                for(let indexData in this.zones[index].categories[indexCat].data){
                    if(indexData==index2){
                        if(indexCat!=index1){
                            this.zones[index].categories[indexCat].data[indexData].carriers[index3].map(e=>{
                                notPick.push(e)
                            })
                        }
                    } else {
                        this.zones[index].categories[indexCat].data[indexData].carriers[index3].map(e=>{
                            notPick.push(e)
                        })
                    }
                }    
            }
            this.$buefy.modal.open({
                parent: this,
                component: Classess,
                hasModalCard: true,
                props: {value:this.zones[index].categories[index1].data[index2].carriers[index3],notPick,title:this.zones[index].categories[index1].title},
                events: {
                    'editClassF': valueFinal => {
                        this.zones[index].categories[index1].title=valueFinal.title;
                        this.zones[index].categories[index1].data[index2].carriers[index3] = valueFinal.data.splice(0);
                    }
                }
            });
            this.zones[index].categories[index1].title=''
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
                                this.zones[index].routes[0].push({origin: null,destination: null,aa:[],fareType: ['All']});
                                this.zones[index].categories.map(cat=>{
                                    cat.data.map(data=>{
                                        data.commissions[0].push(0);
                                    })
                                })
                            } else {
                                this.zones[index].routes[1].push({origin: null,destination: null,aa:[],fareType: ['All']});
                                this.zones[index].categories.map(cat=>{
                                    cat.data.map(data=>{
                                        data.commissions[1].push(0);
                                    })
                                })
                            }
                        } else {
                            this.zones[index].routes[2].push({origin: null,destination: null,aa:[],fareType: ['All']});
                            this.zones[index].categories.map(cat=>{
                                cat.data.map(data=>{
                                    data.commissions[2].push(0);
                                })
                            })
                        }
                    }
                }
            })
        },
        editRegion(index,index1,type,indexValid){
            let value = type?this.zones[index].routes[indexValid][index1].origin:this.zones[index].routes[indexValid][index1].destination;
            let notPick = type?this.zones[index].routes[indexValid][index1].destination:this.zones[index].routes[indexValid][index1].origin;
            this.$buefy.modal.open({
                parent: this,
                component: Region,
                hasModalCard: true,
                props: {value,notPick},
                events: {
                    'editRegion': valueFinal => {
                        if(type){
                            this.zones[index].routes[indexValid][index1].origin=valueFinal;
                        } else {
                            this.zones[index].routes[indexValid][index1].destination=valueFinal;
                        }
                    }
                }
            })
        },
        editRegionSpecial(index,index1,indexValid){
            this.$buefy.modal.open({
                parent: this,
                component: AirportToAirport,
                hasModalCard: true,
                props: {value:this.zones[index].routes[indexValid][index1].aa},
                events: {
                    'editRegionSpecial': valueFinal => {
                        this.zones[index].routes[indexValid][index1].aa = valueFinal.splice(0);
                    }
                }
            })
        },
        deleteRegion(index,index1,indexValid){
            this.zones[index].routes[indexValid].splice(index1,1);
            this.zones[index].categories.map(cat=>{
                cat.data.map(data=>{
                    data.commissions[indexValid].splice(index1,1);
                })
            })
        },
        clearRegion(index,index1,type,indexValid){
            if(type){
                this.zones[index].routes[indexValid][index1].origin = null;
            } else {
                this.zones[index].routes[indexValid][index1].destination = null;
            }
        },
        clearRegionSpecial(index,index1,indexValid){
            this.zones[index].routes[indexValid][index1].aa = this.zones[index].routes[indexValid][index1].aa.splice()
        },
        setRestriction(index){
            let routes = [];
            this.zones[index].routes.map(fareValid=>{
                if(fareValid.length!=0){
                    fareValid.map(route=>{
                        if(route.aa.length==0){
                            if(route.origin && routes.indexOf(route.origin)==-1){
                                routes.push(route.origin)
                            }
                            if(route.destination && routes.indexOf(route.destination)==-1){
                                routes.push(route.destination)
                            }
                        } else {
                            let val = route.aa.map(e=>{return `${e.origin.iata}-${e.destination.iata}`}).toString().replace(/,/g,'/');
                            if(routes.indexOf(val)==-1){
                                routes.push(val);
                            }
                        }
                    })
                }
            })
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
                            })          
                        }
                    }
                }
            })
        },
        getRestrictions(index,index1,type,indexValid,type1){
            let value;
            if(type1){
                value = type?this.zones[index].routes[indexValid][index1].origin:this.zones[index].routes[indexValid][index1].destination;
            } else {
                if(this.zones[index].routes[indexValid][index1].aa.length==0){
                    value = null
                } else {
                    value = this.zones[index].routes[indexValid][index1].aa.map(e=>{return `${e.origin.iata}-${e.destination.iata}`}).toString().replace(/,/g,'/');
                }
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
            this.zones[index].routes.map(fareValid=>{
                if(fareValid.length!=0){
                    fareValid.map(route=>{
                        if(route.aa.length==0){
                            if(route.origin && routes.indexOf(route.origin)==-1){
                                routes.push(route.origin)
                            }
                            if(route.destination && routes.indexOf(route.destination)==-1){
                                routes.push(route.destination)
                            }
                        } else {
                            let val = route.aa.map(e=>{return `${e.origin.iata}-${e.destination.iata}`}).toString().replace(/,/g,'/');
                            if(routes.indexOf(val)==-1){
                                routes.push(val);
                            }
                        }
                    })
                }
            })
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
            this.zones[index].routes.map(fareValid=>{
                if(fareValid.length!=0){
                    fareValid.map(route=>{
                        route.fareType.map(ft=>{
                            if(fareTypes.indexOf(ft)==-1){
                                fareTypes.push(ft);
                            }
                        })
                    })
                }
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
        addFareType(index,index1,index2,indexValid){
            let count = 0;
            let find = false;
            for(let indexRoute in this.zones[index].routes[indexValid]){
                if(indexRoute < index1){
                    count = count + this.zones[index].routes[indexValid][indexRoute].fareType.length
                }
            }
            this.zones[index].routes[indexValid][index1].fareType.push('All');
            this.zones[index].categories.map(cat=>{
                cat.data.map(data=>{
                    data.commissions[indexValid].splice(count,0,0);
                })
            })
        },
        editFareType(index,index1,index2,indexValid){
            this.$buefy.dialog.prompt({
                message: `Write the new Fare Type`,
                inputAttrs: {
                    placeholder: 'Type your fare type',
                    value: this.zones[index].routes[indexValid][index1].fareType[index2]
                },
                onConfirm: (value) => {this.zones[index].routes[indexValid][index1].fareType.splice(index2,1,value)}
            })
        },
        deleteFareType(index,index1,index2,indexValid){
            let cont = 0;
            let find = false;
            for(let indexRoute in this.zones[index].routes[indexValid]){
                if(!find){
                    for(let indexFT in this.zones[index].routes[indexValid][indexRoute].fareType){
                        if(!find){
                            if(indexRoute == index1 && indexFT == index2){
                                find = true;
                            } else {
                                cont++;
                            }
                        } else {
                            break;
                        }
                    }
                } else {
                    break;
                }
            }
            this.zones[index].routes[indexValid][index1].fareType.splice(index2,1);
            this.zones[index].categories.map(cat=>{
                cat.data.map(data=>{
                    data.commissions[indexValid].splice(cont,1);
                })
            });
        },
        editCommission(index,index1,index2,index3,indexValid,index4){
            this.$buefy.dialog.prompt({
                message: `Insert the new commission`,
                inputAttrs: {
                    type: 'number',
                    placeholder: `Type the new commission`,
                    value: `${this.zones[index].categories[index1].data[index2].commissions[indexValid][this.getCantFareType(index,indexValid,index3,index4)]}`,
                    max: 100,
                    min: 0
                },
                onConfirm: (value) => {this.zones[index].categories[index1].data[index2].commissions[indexValid].splice(this.getCantFareType(index,indexValid,index3,index4),1,parseInt(value,10))}
            })
        },
        getLabelAirports(index,index1,indexValid){
            return this.zones[index].routes[indexValid][index1].aa.map(e=>{
                return `${e.origin.iata}-${e.destination.iata}`
            })
        },
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