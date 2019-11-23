<template>
    <section class="section">
        <div class="row">
            <div class="col content has-text-centered">
                <h2>{{$t('pages.mngContract.show.title')}}</h2>
            </div>
        </div>
        <div class="pt-4 row">
            <div class="col-3 offset-3">
                <b-field label-position="on-border" :label="$t('pages.mngContract.show.filterOwner')">
                    <b-input custom-class="text-uppercase" v-model="owner"/>
                </b-field>
            </div>
            <div class="col-3">
                <b-field label-position="on-border" :label="$t('pages.mngContract.show.filterCode')">
                    <b-input v-cleave="masks.numeral" v-model="code"/>
                </b-field>
            </div>
            <div class="col-2">
                <b-field label-position="on-border" :label="$t('pages.mngContract.show.iata.label')">
                    <b-select expanded v-model="iata" :placeholder="$t('pages.mngContract.show.iata.ph')">
                        <option value="USA">USA</option>
                        <option value="PERU">PERU</option>
                        <option value="ALL">{{$t('pages.mngContract.show.iata.both')}}</option>
                    </b-select>
                </b-field>
            </div>
        </div>
        <div class="row py-2">
            <div v-if="checkedRows.length>0" class="col-auto">
                <a @click="checkedRows=[]" class="button help ml-n3 is-text"><strong>{{$t('pages.mngContract.show.select')}}</strong></a>
            </div>
            <div class="col-auto ml-auto">
                <div class="row">
                    <a v-if="checkedRows.length!=0" @click="deleteContract" style="width:40px;height:40px;border-radius:50px;box-shadow: 2px 2px 3px #999;" class="button bg-danger text-white is-text is-small">
                        <b-icon icon="file-remove"/>
                    </a>
                    <div class="col">
                        <a @click="addContract" style="width:40px;height:40px;border-radius:50px;box-shadow: 2px 2px 3px #999;" class="button bg-primary text-white is-text is-small">
                            <b-icon icon="file-plus"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
                    
        <b-table
            :data="contractsRaw"
            v-if="contracts"
            paginated
            ref="table"
            per-page="10"
            detailed
            detail-key="_id"
            striped
            bordered
            :show-detail-icon="false"
            default-sort="code"
            default-sort-direction="desc" 
            :checked-rows.sync="checkedRows"
            checkable
        >
            <template slot-scope="props">
                <b-table-column sortable field="code" :label="$t('pages.mngContract.show.table.code').toUpperCase()" centered>
                    {{props.row.codeContract}}
                </b-table-column>
                <b-table-column sortable centered class="text-uppercase" field="owner" :label="$t('pages.mngContract.show.table.owner').toUpperCase()">
                    {{props.row.contractOwner}}
                </b-table-column>
                <b-table-column centered sortable class="text-uppercase" field="iata" :label="$t('pages.mngContract.show.table.iata').toUpperCase()">
                    {{props.row.IATAOwner}}
                </b-table-column>
                <b-table-column sortable centered class="text-uppercase" field="author" :label="$t('pages.mngContract.show.table.author').toUpperCase()">
                    {{props.row.authorContract.name}} {{props.row.authorContract.lastName}}
                </b-table-column>
                <!-- Improve this with a function in the localizator -->
                <b-table-column sortable centered field="expire" :label="$t('pages.mngContract.show.table.expire').toUpperCase()">
                    <span :class="`has-text-weight-bold tag ${expireDate(props.row.expirationDate)>15?'is-success':(expireDate(props.row.expirationDate)>0?'is-warning':'is-danger')}`">
                        {{expireDate(props.row.expirationDate)&lt;0?Math.abs(expireDate(props.row.expirationDate)):expireDate(props.row.expirationDate)}} {{$t('pages.mngContract.show.table.days')}} {{expireDate(props.row.expirationDate)&lt;0?'ago':''}}
                    </span>
                </b-table-column>
                <b-table-column field="edit" :label="$t('pages.mngContract.show.table.edit').toUpperCase()" centered>
                    <a @click="editContract(props.row._id)" class="button is-text is-small"><b-icon icon="file-document-edit"/></a>
                </b-table-column>
                <b-table-column field="more" :label="$t('pages.mngContract.show.table.details').toUpperCase()" centered>
                    <a @click="toggle(props.row)">
                        <b-icon icon="magnify-plus-outline" size="is-small"></b-icon> {{$t('pages.mngContract.show.table.moreInfo.title')}} 
                    </a>
                </b-table-column>
            </template>

            <template slot="detail" slot-scope="props">
                <article class="media">
                    <!-- <div class="media-left">
                        <figure class="image is-64x64">
                            <img class="h-100 is-rounded" :src="`/public/users/${props.row.userImg}`">
                        </figure>
                    </div> -->
                    <div class="media-content">
                        <div class="content">
                            <div class="pl-5 ml-5 row">
                                <div class="col-8">
                                    <div class="row">
                                        <p>{{$t('pages.mngContract.show.table.moreInfo.dates',{creation:moment(props.row.creationDate).locale(locale).format('L'),start:moment(props.row.startDate).locale(locale).format('L'),end:moment(props.row.expirationDate).locale(locale).format('L')})}}</p>
                                    </div>
                                    <div class="row">
                                        <p>{{$t('pages.mngContract.show.table.moreInfo.visibility')}}</p>
                                        <p :key="index" v-for="(visibility,index) in props.row.visibility">
                                           <strong> &nbsp;{{visibility}}{{index!=props.row.visibility.length-1?',':'.'}} </strong>
                                        </p>
                                    </div>
                                </div>
                                <div class="col-4 d-flex align-items-center">
                                    <a @click="logs(props.row.editions)" class="button is-text">{{$t('pages.mngContract.show.table.moreInfo.logs')}}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </template>

            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon
                                icon="file-hidden"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>{{$t('pages.mngContract.show.table.empty')}}</p>
                    </div>
                </section>
            </template>
        </b-table>
    </section>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import Cleave from 'cleave.js';
import log from '~/components/logs.vue'

const cleave = {
    name: 'cleave',
    bind(el, binding) {
        const input = el.querySelector('input')
        input._vCleave = new Cleave(input, binding.value)
    },
    unbind(el) {
        const input = el.querySelector('input')
        input._vCleave.destroy()
    }
}

export default {
    layout: 'navbar-normal',
    middleware: 'admin',
    directives: { cleave },
    nuxtI18n: {
        paths: {
            en: '/managecontracts',
            es: '/administracioncontractos'
        }
    },
    async fetch({store}){
        if(!store.state.managec.contracts){
            await store.dispatch('managec/fillContracts',process.server);
        }
    },
    beforeMount(){
        this.locale=this._i18n._vm.locale;
    },
    data(){
        return {
            iata: null,
            owner: '',
            code: '',
            checkedRows: [],
            masks: {
                numeral: {
                    numeral: true
                }
            },
            locale: ''
        }
    },
    computed:{
        ...mapState({
            contracts: state => state.managec.contracts,
            access_token: state => state.auth.access_token
        }),
        contractsRaw(){
            if(!this.contracts){
                return []
            } else {
                return this.contracts.filter(
                    (contract) => {
                        return (
                            contract.contractOwner.indexOf(this.owner.toUpperCase()) > -1 &&
                            contract.codeContract.indexOf(this.code) > -1 &&
                            (this.iata?(this.iata=='ALL'?true:contract.IATAOwner==this.iata):true)
                        )
                    }
                )
            }
        }
    },
    methods: {
        ...mapActions({
            deleteContracts: 'managec/deleteContracts'
        }),
        addContract(){
            this.$router.push(this.localePath({name:'managecontracts-create'}));
        },
        deleteContract(){
            this.$swal({
                customClass: {confirmButton: 'btn btn-success ml-2',cancelButton: 'mr-2 btn btn-danger'},
                buttonsStyling: false,
                title: this.$t('pages.mngContract.delete.sure'),
                html: this.$t('pages.mngContract.delete.content',{cant:this.checkedRows.length,plural:`${this.checkedRows.length>1?'s':''}`}),
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: this.$t('pages.mngContract.delete.confirm'),
                cancelButtonText: this.$t('pages.mngContract.delete.cancel'),
                reverseButtons: true,
                allowOutsideClick: false
            }).then(async (result)=>{
                if(result.value){
                    this.isLoading=true; 
                    let contractsToDelete = [];
                    for(let contractToDelete of this.checkedRows){
                        contractsToDelete.push(contractToDelete.contractOwner)
                        await fetch(`/api/contract/${contractToDelete._id}`,{
                            method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.access_token}`
                            }
                        })
                        this.isLoading=false;
                        this.deleteContracts(contractToDelete);
                    }
                    this.$swal({
                        type: 'success',
                        title: this.$t('pages.mngContract.delete.title'),
                        html: this.$t('pages.mngContract.delete.contentFinal',{users:contractsToDelete.toString().replace(/,/g,', ')}),
                        customClass: {confirmButton: 'btn btn-primary'},
                        buttonsStyling: false,
                    });
                } else if(result.dismiss == 'cancel'){
                    this.$swal({
                        type: 'error',
                        title: this.$t('pages.mngContract.delete.titleCancel'),
                        text: this.$t('pages.mngContract.delete.contentCancel'),
                        customClass: {confirmButton: 'btn btn-primary'},
                        buttonsStyling: false,
                    });
                }
                this.checkedRows=[] 
            })
        },
        editContract(val){
            this.$router.push(this.localePath({name:'managecontracts-edit-contract',params:{contract:val}}));
        },
        toggle(val){
            this.$refs.table.toggleDetails(val);
        },
        expireDate(val){
            let diffTime = new Date(val).getTime() - new Date().getTime();
            let diffDays = Math.ceil(diffTime/(3600000*24));
            return diffDays
        },
        logs(val){
            this.$buefy.modal.open({
                parent: this,
                component: log,
                hasModalCard: true,
                props: {editions:val,locale:this.locale}
            })
        }
    }
}
</script>