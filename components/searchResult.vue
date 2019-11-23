<template>
    <section>
        <div v-if="contracts.length!=0" class="box mt-n2 mb-1">
            {{toSearch}}
            <div class="row mb-n3 mt-n2">
                <div class="col-4 ml-auto">
                    <b-field horizontal label="Classess">
                        <b-taginput
                            v-model="classSelected"
                            :data="classArrayRaw"
                            autocomplete
                            icon="assistant"
                            maxlength="1"
                            :open-on-focus="openFocus"
                            placeholder="Add a class"
                            class="inputClass"
                            @typing="text=>filterArrayClass(text)"
                            @add="option=>spliceArrayClass(option)"
                            @remove="option=>pushArrayClass(option)">
                            <template slot-scope="props">
                                <strong>{{props.option}}</strong>
                            </template>
                            <template slot="empty">
                                There are no items
                            </template>
                        </b-taginput>
                    </b-field>
                </div>
                <div class="col-2">
                    <b-switch v-model="oldCommissions">Commissions Outdated</b-switch>
                </div>
            </div>
        </div>
        <div class="row">
                <div class="col-auto ml-auto">
                    <label class="label help">Leyenda :</label>
                </div>
                <div class="col-auto">
                    <p class="help"><b-icon type="is-danger" icon="alert-octagon" size="is-small"/>:Commission has restrictions <strong>(Click on the cell to show them)</strong></p>
                </div>
                <div v-if="oldCommissions" class="col-auto">
                    <p class="help text-danger">Row in red has already expired</p>
                </div>
                <div class="col-auto">
                    <p class="help text-warning">Row in yellow is close to expire</p>
                </div>
                <div v-if="oldCommissions" class="col-auto">
                    <p class="help text-info">Row in blue may be applied soon</p>
                </div>
            </div>
        <b-table
            :data="contractsRaw"
            :loading="loading"
            ref="table"
            paginated
            per-page="10"
            detailed
            detail-key="idSubContract"
            bordered
            striped
            :show-detail-icon="showDetailIcon"
            :row-class="checkExpirationDate"
            default-sort="commission"
            default-sort-direction="desc"
        >
            <template slot-scope="props">
                <b-table-column field="airline" label="Airline" sortable centered>
                    <!-- <template v-if="toSearch.airlineSearch===''">
                        {{ props.row.airline | airlineNameFilter(airlines) }}
                    </template>
                    <template v-else>
                        {{ getAirlineName(toSearch.airlineSearch) }}
                    </template> -->
                    {{props.row.carrierID}}
                </b-table-column>

                <b-table-column field="origin" label="Origin">
                    <!-- <template v-if="toSearch.originSearch===''">
                        {{ props.row.origin.title }}
                    </template>
                    <template v-else>
                        {{ toSearch.originSearch}}
                    </template> -->
                    {{ props.row.origin }}
                </b-table-column>

                <b-table-column field="destination" label="Destination">
                    <!-- <template v-if="toSearch.destinationSearch===''">
                        {{ props.row.destination.title }}
                    </template>
                    <template v-else>
                        {{ toSearch.destinationSearch}}
                    </template> -->
                    {{ props.row.destination }}
                </b-table-column>

                <b-table-column field="category" label="Category" centered>
                    <!-- {{ getCategoryName(props.row.category) }} -->
                    {{props.row.category}}
                </b-table-column>

                <b-table-column :custom-sort="sortClass" field="class" label="Class" sortable centered>
                    {{ props.row.class }}
                </b-table-column>

                <b-table-column field="commission" label="Commission" sortable numeric centered>
                    {{ props.row.commission }} %
                    <!-- <p v-if="props.row.restrictions==undefined">{{ props.row.commission }} %</p> -->
                    <!-- <p v-if="props.row.restrictions!=undefined" @click="showRestrictions(props.row.restrictions)">{{ props.row.commission }} %  <b-icon v-if="props.row.restrictions!=undefined" type="is-danger" icon="alert-octagon" size="is-small"/></p> -->
                </b-table-column>

                <b-table-column field="more" label="Details">
                    <a @click="toggle(props.row)">
                        <b-icon icon="magnify-plus-outline" size="is-small"/> More info ... 
                    </a>
                </b-table-column>
            </template>

            <template slot="detail" slot-scope="props">
                <article class="media">
                    <!-- <figure class="media-left">
                        <p class="image is-128x128 mb-n5">
                            <img :src="`/public/airlines/${props.row.airline}.png`">
                        </p>
                    </figure> -->
                    <div class="media-content">
                        <div class="content">
                            <div class="row">
                                <div class="col-8">
                                    <p>
                                        ContractOwner: <strong>{{ props.row.contractOwner }}</strong><br>
                                        IATA: <strong>{{ props.row.IATAOwner }}</strong><br>
                                        This commission is valid between: <strong>{{moment(props.row.startDate).locale('en').format('LL')}}</strong> and <strong>{{moment(props.row.expirationDate).locale('en').format('LL')}}</strong>     
                                    </p>
                                </div>
                                <!-- <div class="col-4">
                                    <button v-if="props.row.restrictions!=undefined" @click="showRestrictions(props.row.restrictions)" class="button is-text">Ver restricciones</button>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </article>
            </template>
            <template v-if="!loading" slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon
                                icon="emoticon-sad"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>No commissions found</p>
                    </div>
                </section>
            </template>
        </b-table>
    </section>
</template>

<script>
import {mapState} from 'vuex';
export default {
    props:[
        'toSearch'
    ],
    methods:{
        toggle(row){
            this.$refs.table.toggleDetails(row);
        },
        sortClass(a,b,isAsc){
            if(isAsc)
                return b.classes>a.classes?1:-1;
            else 
                return a.classes>b.classes?1:-1;
        },
        getAirlineName(val){
            return this.airlines.filter(airline=>airline.airlineIC==val)[0].airlineName
        },
        getCategoryName(val){
            let text='';
            switch(val){
                case 'bussiness': {text='Bussiness';}break;
                case 'premiumEconomy': {text='Premium Economy';}break;
                case 'economy': {text='Economy';}break;
                case 'firstClass': {text='First Class'}break;
            }
            return text;
        },
        filterArrayClass(val){
            if(val==''){
                this.classArrayRaw = this.classArray.slice()
                this.classSelected.map(e=>this.classArrayRaw.splice(this.classArrayRaw.indexOf(e),1));
            } else {
                this.classArrayRaw = this.classArrayRaw.filter(e=>e==val.toUpperCase())
            }
        },
        spliceArrayClass(val){
            this.classArrayRaw = this.classArray.slice();
            this.classSelected.map(e=>this.classArrayRaw.splice(this.classArrayRaw.indexOf(e),1));
            let indexElement = this.classArrayRaw.indexOf(val);
            this.classArrayRaw.splice(indexElement,1);
            this.contractsRaw=this.contracts.filter(e=>this.classSelected.indexOf(e.classes)>-1);
        },
        pushArrayClass(val){
            this.classArrayRaw.push(val)
            if(this.classSelected.length==0){
                this.contractsRaw=this.contracts.slice();
            } else {
                this.contractsRaw=this.contractsRaw.filter(e=>this.classSelected.indexOf(e.classes)>-1);
            }
        },
        checkExpirationDate(row,index){
            if(this.moment(row.expirationDate).diff(this.moment(),'days')<0){
                return 'text-danger font-weight-bold'
            } else {
                if(this.moment(row.expirationDate).diff(this.moment().add(2,'w'),'days')<0){
                    return 'text-warning font-weight-bold'
                }
            }
            if(this.moment(row.startDate).diff(this.moment())>0){
                return 'text-primary'
            }
        },
        showRestrictions(val){
            this.$swal({
                type: 'warning',
                title: 'Restrictions',
                text: `${val}`,
                customClass: {
                    confirmButton: 'button is-info'
                },
                buttonsStyling: false,
                allowOutsideClick: false
            })
        },
        async loadAsyncData(){
            this.loading=true;
            const res = await fetch('/api/contract/search',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                },
                method: 'POST',
                body: JSON.stringify(this.toSearch)
            });
            let response = await res.json();
            /* console.log(response); */
            this.contracts = response;
            // if(this.oldCommissions){
                this.contractsRaw=response;   
            /* } else {
                this.contractsRaw = response.contracts.filter(contract=>this.moment().diff(this.moment(contract.startDate))>0 && this.moment().diff(this.moment(contract.expirationDate),'days')<0);
            } */
            // this.classSelected = this.classSelected.filter(classQ=>this.classArray.indexOf(classQ)>-1)
            // if(this.classSelected.length!=0){
            //     this.contractsRaw=this.contractsRaw.filter(e=>this.classSelected.indexOf(e.classes)>-1);
            // }
            this.loading=false;
        }
    },
    beforeMount(){
        this.loadAsyncData();
    },
    data(){
        return {
            contracts: [],
            contractsRaw: [],
            loading: false,
            showDetailIcon: false,
            classSelected:[],
            openFocus:true,
            classArrayRaw:[],
            oldCommissions: false
        }
    },
    computed:{
        ...mapState({
            airlines: state=> state.searchcom.airlines,
            access_token: state=> state.auth.access_token
        }),
        toSearchObject: function(){
            return Object.assign({},this.toSearch,this.toSearch.passengers)
        },
        classArray: function(){
            return [...new Set(this.contracts.map(contract=>contract.classes))];
        }
    },
    filters: {
        airlineNameFilter: function(value,airlines){
            let index = airlines.map(function(airline){return airline.airlineIC;}).indexOf(value);
            return airlines[index].airlineName;
        }
    },
    watch:{
        toSearchObject:{
            handler: function(valNew,valOld){
                if(valNew.originSearch!=valNew.destinationSearch){
                    this.loadAsyncData();
                } else {
                    if(!valNew.originSearch && !valNew.destinationSearch){
                        this.loadAsyncData();
                    } else {
                        this.contracts=[]
                        this.$swal({
                            toast:true,
                            position: 'top',
                            showConfirmButton: false,
                            timer: 2500,
                            type: 'error',
                            title: 'Please, check the fields.'
                        });
                    }
                }
            },deep:true
        },
        classArray:function(val){
            if(this.classSelected.length==0){
                this.classArrayRaw=val.slice();
            } else {
                this.classArrayRaw = this.classArray.filter(classQ=>this.classSelected.indexOf(classQ)==-1).slice();
            }
        },
        oldCommissions:function(val){
            if(val){
                this.contractsRaw=this.contracts.slice();
            } else {
                this.contractsRaw=this.contracts.filter(contract=>this.moment().diff(this.moment(contract.startDate))>0 && this.moment().diff(this.moment(contract.expirationDate),'days')<0);
            }
        }
    }
}
</script>

<style>
.inputClass .dropdown-menu{
    border:none;
}
</style>
