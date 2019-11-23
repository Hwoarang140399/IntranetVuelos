<template>
    <section class="section">
        <div class="row pb-3">
            <div class="col-2">
                <label class="label">{{$t('pages.mngUser.filterBy')}}</label>
            </div>
            <div class="col-8">
                <div class="columns">
                    <div class="column is-2 text-center"><label class="label">{{$t('pages.mngUser.header.name')}}</label></div>
                    <div class="column is-4"><input class="input" type="text" v-model="name"></div>
                    <div class="column is-2 text-center"><label class="label">{{$t('pages.mngUser.header.lastName')}}</label></div>
                    <div class="column is-4"><input class="input" type="text" v-model="lastName"></div>
                </div>
            </div>
            <div class="col-2">
                <div class="row">
                    <div v-if="checkedRows.length!=0" class="col-7 justify-content-end d-flex">
                        <a @click="deleteUser" style="width:40px;height:40px;border-radius:50px;box-shadow: 2px 2px 3px #999;" class="button bg-danger text-white is-text is-small">
                            <b-icon icon="account-minus"></b-icon>
                        </a>
                    </div>
                    <div :class="checkedRows.length!=0?'col-4 justify-content-end d-flex':'offset-7 col-4 justify-content-end d-flex'">
                        <a @click="addUser" style="width:40px;height:40px;border-radius:50px;box-shadow: 2px 2px 3px #999;" class="button bg-primary text-white is-text is-small">
                            <b-icon icon="account-plus"></b-icon>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="checkedRows.length>0" class="row">
            <div class="col-auto">
                <a @click="checkedRows=[]" class="button help ml-n3 is-text"><strong>{{$t('pages.mngUser.unselect')}}</strong></a>
            </div>
        </div>
        <b-table
            :data="usersRaw"
            paginated
            ref="table"
            per-page="10"
            detailed
            detail-key="_id"
            striped
            bordered
            @details-open="openDetail"
            :show-detail-icon="false"
            default-sort="name"
            default-sort-direction="desc" 
            :checked-rows.sync="checkedRows"
            checkable
        >
        <template slot-scope="props">
            <b-table-column class="text-uppercase" field="name" :label="$t('pages.mngUser.header.name').toUpperCase()">
                {{props.row.name}}
            </b-table-column>
            <b-table-column class="text-uppercase" field="lastname" :label="$t('pages.mngUser.header.lastName').toUpperCase()">
                {{props.row.lastName}}
            </b-table-column>
            <b-table-column field="company" :label="$t('pages.mngUser.header.company').toUpperCase()" centered>
                {{props.row.company}}
            </b-table-column>
            <b-table-column field="email" :label="$t('pages.mngUser.header.email').toUpperCase()">
                {{props.row.email}}
            </b-table-column>
            <b-table-column class="text-uppercase" field="level" :label="$t('pages.mngUser.header.capabilities').toUpperCase()" centered>
                {{props.row.capability}} {{props.row.lvlAgent!=null?`- ${props.row.lvlAgent}`:''}}
            </b-table-column>
            <b-table-column field="edit" :label="$t('pages.mngUser.header.edit').toUpperCase()" centered>
                <a @click="editUser(props.row)" class="button is-text is-small"><b-icon icon="account-edit" size=""></b-icon></a>
            </b-table-column>
            <b-table-column field="more" :label="$t('pages.mngUser.header.details').toUpperCase()" centered>
                <a @click="toggle(props.row)">
                    <b-icon icon="magnify-plus-outline" size="is-small"></b-icon> {{$t('pages.mngUser.header.moreInfo')}} 
                </a>
            </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-64x64">
                        <img class="h-100 is-rounded" :src="`/public/users/${props.row.userImg}`">
                    </figure>
                </div>
                <div class="media-content">
                    <div class="content">
                        <div class="pl-5 ml-5 columns">
                            <div class="column is-2">
                                <p>{{$t('pages.mngUser.moreDetails.creationDate')}}</p>
                                <p>{{moment(props.row.creationDate).format(locale=='es'?'DD/MM/YYYY':'MM/DD/YYYY')}}</p>
                            </div>
                            <div class="column is-2">
                                <p>{{$t('pages.mngUser.moreDetails.jobTitle')}}</p>
                                <p>{{props.row.jobTitle}}</p>
                            </div>
                            <div class="column is-2">
                                <p>{{$t('pages.mngUser.moreDetails.country')}}</p>
                                <p>{{props.row.country==undefined?null:`${location.getCountryInfoByShort(props.row.country).emoji} ${location.getCountryInfoByShort(props.row.country).name}`}}</p>
                            </div>
                            <div class="column is-1">
                                <p>{{$t('pages.mngUser.moreDetails.gender')}}</p>
                                <p>{{props.row.gender=='male'?`${$t('pages.mngUser.male')}`:`${$t('pages.mngUser.female')}`}}</p>
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
                            icon="emoticon-sad"
                            size="is-large">
                        </b-icon>
                    </p>
                    <p>{{$t('pages.mngUser.empty')}}</p>
                </div>
            </section>
        </template>
        </b-table>
        <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
        <!-- <p>{{usersTest1}}</p> -->
        <!-- <p>{{usersTest}}</p> -->
        <!-- <a style="position:fixed;bottom:50px;right:50px;" class="button is-text is-small"><b-icon icon="account-edit" size="is-large"></b-icon></a> -->
    </section>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import locationData from 'countrycitystatejson';
import Cookies from 'universal-cookie';

export default {
    nuxtI18n: {
        paths: {
            en: '/manageusers',
            es: '/administracionusuarios'
        }
    },
    layout: 'navbar-normal',
    middleware: 'manager',
    async asyncData({req,store}){
        if(process.client && store.state.manageu.users==null){
            const cookies = new Cookies();
            const res = await fetch(`/api/user/`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('token')}`
                }
            });
            const data = await res.json();
            store.commit('manageu/setUsers',data)
        }
    },
    async beforeMount(){
        this.locale=this._i18n._vm.locale;
    },
    computed:{
        ...mapState({
            users: state=>state.manageu.users,
            access_token: state=>state.auth.access_token
        }),
        usersRaw(){
            if(this.users==null){
                return []
            } else {
                return this.users.filter(
                    (user) => {
                        if(this.name==''){
                            if(this.lastName==''){
                                return true
                            } else {
                                return user.lastName==undefined?false:user.lastName.toLowerCase().indexOf(this.lastName.toLowerCase()) > -1
                            }    
                        } else {
                            if(this.lastName==''){
                                return user.name.toLowerCase().indexOf(this.name.toLowerCase()) > -1
                            } else {
                                if(user.lastName==undefined){
                                    return false
                                } else {
                                    return user.name.toLowerCase().indexOf(this.name.toLowerCase()) > -1 && user.lastName.toLowerCase().indexOf(this.lastName.toLowerCase()) > -1
                                }
                            }
                        }
                    })
            }
        }
    },
    data(){
        return {
            name: '',
            lastName: '',
            checkedRows: [],
            locale:'',
            isLoading: false,
            location: locationData,
        }
    },
    methods:{
        ...mapActions({
            fillUsers:'manageu/fillUsers',
            deleteUsers: 'manageu/deleteUsers'
        }),
        toggle(val){
            this.$refs.table.toggleDetails(val);
        },
        openDetail(val){
            
        },
        editUser(val){
            this.$router.push(this.localePath({name:'manageusers-user',params:{user:val.username}}));
        },
        async deleteUser(){
            this.$swal({
                customClass: {confirmButton: 'btn btn-success ml-2',cancelButton: 'mr-2 btn btn-danger'},
                buttonsStyling: false,
                title: this.$t('pages.mngUser.deleteUser.sure'),
                html: this.$t('pages.mngUser.deleteUser.content',{cant:this.checkedRows.length,plural:`${this.checkedRows.length>1?'s':''}`}),
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: this.$t('pages.mngUser.deleteUser.confirm'),
                cancelButtonText: this.$t('pages.mngUser.deleteUser.cancel'),
                reverseButtons: true,
                allowOutsideClick: false
            }).then(async (result)=>{
                if(result.value){
                    this.isLoading=true; 
                    let usersToDelete = [];
                    for(let userToDelete of this.checkedRows){
                        usersToDelete.push(userToDelete.username)
                        await fetch(`/api/user/${userToDelete.username}`,{
                            method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.access_token}`
                            }
                        })
                        this.isLoading=false;
                        this.deleteUsers(userToDelete);
                        this.usersRaw=this.users;
                    }
                    this.$swal({
                        type: 'success',
                        title: this.$t('pages.mngUser.deleteUser.title'),
                        html: this.$t('pages.mngUser.deleteUser.contentFinal',{users:usersToDelete.toString().replace(/,/g,', ')}),
                        customClass: {confirmButton: 'btn btn-primary'},
                        buttonsStyling: false,
                    });
                } else if(result.dismiss == 'cancel'){
                    this.$swal({
                        type: 'error',
                        title: this.$t('pages.mngUser.deleteUser.titleCancel'),
                        text: this.$t('pages.mngUser.deleteUser.contentCancel'),
                        customClass: {confirmButton: 'btn btn-primary'},
                        buttonsStyling: false,
                    });
                }
                this.checkedRows=[] 
            })
        },
        addUser(){
            this.$router.push(this.localePath({name:'manageusers-create'}));
        }
    }
}
</script>