<template>
    <section class="content section">
        <div class="row mt-n4 mb-3">
            <div class="col text-center">
                <h1>{{$t('pages.mngUser.edit.title')}}</h1>
            </div>
        </div>
        <form v-if="userLoged" class="columns is-centered" @submit.prevent="validateBeforeSubmit">
            <div class="column box">
                <div class="row">
                    <div class="col-2">
                        <figure class="ml-4 image is-128x128">
                            <img class="h-100 is-rounded" :src="imgUser">
                        </figure>
                    </div>
                    <div class="col-3 offset-1 pt-4">
                        <div class="field">
                            <label class="label">{{$t('pages.mngUser.edit.user.name')}}</label>
                            <div class="control">
                                <input :class="errors.has('name')?'input text-uppercase is-danger':'input text-uppercase'" name="name" v-validate="'required'" v-model="name" type="text">
                            </div>
                            <span v-if="errors.first('name')" class="help is-danger">{{$t('pages.mngUser.edit.user.fieldError')}}</span>
                        </div>
                    </div>
                    <div class="col-3 offset-1 pt-4">
                        <div class="field">
                            <label class="label">{{$t('pages.mngUser.edit.user.lastName')}}</label>
                            <div class="control">
                                <input :class="errors.has('lastname')?'input text-uppercase is-danger':'input text-uppercase'" name="lastname" v-validate="'required'" v-model="lastName" type="text">
                            </div>
                            <span v-if="errors.first('lastname')" class="help is-danger">{{$t('pages.mngUser.edit.user.fieldError')}}</span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2 text-center">
                        <p v-if="this.dropFile!=null" class="help text-info mt-n1">{{$t('pages.mngUser.edit.user.preview')}}</p>
                        <b-upload 
                            v-model="dropFile"
                            :multiple="false"
                            drag-drop
                        >
                            <div class="has-text-centered mt-2">
                                <p class="help"><b-icon icon="upload"/><br>{{$t('pages.mngUser.edit.user.upload')}}</p>
                            </div>
                        </b-upload>
                    </div>
                    <div class="col-3 offset-1">
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input :class="errors.has('email')?'input is-danger':'input'" name="email" v-validate="'required|email'" v-model="email" type="text">
                            </div>
                            <span v-if="errors.firstByRule('email','required')" class="help is-danger">{{$t('pages.mngUser.edit.user.fieldError')}}</span>
                            <span v-if="errors.firstByRule('email','email')" class="help is-danger">{{$t('pages.mngUser.edit.user.emailRequired')}}</span>
                        </div>    
                    </div>
                    <div class="col-3 offset-1">
                        <div class="field">
                            <label class="label">{{$t('pages.mngUser.edit.user.username')}}</label>
                            <div class="control">
                                <input name="username" v-validate="'required'" :class="errors.has('username')?'input is-danger':'input'" v-model="username" type="text">
                            </div>
                            <span v-if="errors.first('username')" class="help is-danger">{{$t('pages.mngUser.edit.user.fieldError')}}</span>
                        </div> 
                    </div>
                </div>
                <div :class="dropFile!=null?'row':'row pt-4'">
                    <div class="col-2 text-center">
                        <b-tag v-if="dropFile!=null"
                            type="is-black"
                            closable
                            @close="deleteDropFile">
                            {{`${this.dropFile.name.length>14?this.dropFile.name.slice(0,10):this.dropFile.name}${this.dropFile.name.length>14?`...${this.dropFile.name.slice(-3)}`:''}`}}
                        </b-tag>
                    </div>
                    <div class="col-3 offset-1">
                        <div class="field">
                            <label class="label">{{$t('pages.mngUser.edit.user.country')}}</label>
                            <div class="control">
                                <b-autocomplete
                                    v-model="countrySelected"
                                    :data="filteredDataArray"
                                    class="inputFields"
                                    placeholder="Peru"
                                    field="name"
                                    @select="option =>{if(option){country = option.shortName}}"
                                >
                                    <template slot-scope="props">
                                        <div class="media">
                                            <div class="media-content">
                                                <p>{{props.option.emoji}} {{props.option.name}} </p>
                                            </div>
                                        </div>
                                    </template>
                                    <template slot="empty">No results for {{countrySelected.name}}</template>
                                </b-autocomplete>
                            </div>
                        </div>    
                    </div>
                    <div class="col-3 offset-1">
                        <div class="field">
                            <label class="label">{{$t('pages.mngUser.edit.user.gender')}}</label>
                            <div class="control pt-2">
                                <b-radio class="mr-2" v-model="gender" native-value="male">M</b-radio>
                                <b-radio class="ml-2" v-model="gender" native-value="female">F</b-radio>
                            </div>
                        </div> 
                    </div>
                </div>
                <div class="row">
                    <div class="col-2 text-center mt-2 pt-5">
                        <nuxt-link :to="localePath({name:'user-username-editpassword',params:{username:username}})" class="button is-dark text-white is-small">{{$t('pages.mngUser.edit.user.changePassword')}}</nuxt-link>
                    </div>
                    <div class="col-3 offset-1 pt-4">
                        <div class="field">
                            <label class="label">{{$t('pages.mngUser.edit.user.company')}}</label>
                            <div class="control">
                                <input class="input text-uppercase" v-model="company" type="text">
                            </div>
                        </div>
                    </div>
                    <div class="col-3 offset-1 pt-4">
                        <div class="field">
                            <label class="label">{{$t('pages.mngUser.edit.user.jobTitle')}}</label>
                            <div class="control">
                                <input class="input text-uppercase" v-model="jobTitle" type="text">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="userCapability=='manager' || userCapability=='admin'" >
                    <div class="col-3 offset-3 pt-4">
                        <div class="field">
                            <label class="label">{{$t('pages.mngUser.edit.user.capability')}}</label>
                            <div class="control">
                                <b-select v-model="capability">
                                    <option value="admin">{{$t('pages.mngUser.edit.user.admin')}}</option>
                                    <option value="manager">{{$t('pages.mngUser.edit.user.manager')}}</option>
                                    <option value="agent">{{$t('pages.mngUser.edit.user.agent')}}</option>
                                </b-select>
                            </div>
                        </div>
                    </div>
                    <div v-if="capability=='agent'" class="col-3 offset-1 pt-4">
                        <div class="field">
                            <label class="label">{{$t('pages.mngUser.edit.user.agentLevel')}}</label>
                            <div class="control">
                                <div :class="errors.has('lvlagent')?'select is-danger':'select'">
                                    <b-select name="lvlagent" v-validate="'required'" placeholder="Peru" v-model="lvlAgent">
                                        <option value="peru">Peru</option>
                                        <option value="basic">Basic</option>
                                        <option value="ota">OTA</option>
                                        <option value="premium">Premium</option>
                                        <option value="staff">Staff</option>
                                    </b-select>
                                </div>
                            </div>
                            <span v-if="errors.first('lvlagent')" class="help is-danger">{{$t('pages.mngUser.edit.user.fieldError')}}</span>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-1 pt-5">
                        <button type="submit" class="btn btn-primary">{{$t('pages.mngUser.edit.user.submit')}}</button>
                    </div>
                </div>
            </div>
        </form>
        <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
    </section>
</template>

<script>
import {mapActions,mapGetters,mapState} from 'vuex'
import locationData from 'countrycitystatejson';
import Cookies from 'universal-cookie';

export default {
    props:[
        'user'
    ],
    beforeMount(){
        this.name=this.user.name;
        this.lastName=this.user.lastName==undefined?null:this.user.lastName;
        this.imgUser='/public/users/'+this.user.userImg;
        this.email=this.user.email;
        this.username=this.user.username;
        if(this.user.country==undefined){
            this.country=null
        } else {
            this.countrySelected=this.location.getCountryInfoByShort(this.user.country).name;
            this.country=this.user.country
        }
        this.gender=this.user.gender;
        this.company=this.user.company==undefined?'':this.user.company;
        this.capability=this.user.capability
        this.capability=='agent'?this.lvlAgent=this.user.lvlAgent:null
    },
    data(){
        return {
            name: null,
            lastName:null,
            dropFile: null,
            imgUser:null,
            email:null,
            username:null,
            country:null,
            location: locationData,
            gender:null,
            company: null,
            jobTitle: null,
            capability:null,
            lvlAgent:null,
            countrySelected:'',
            isLoading:false
        }
    },
    methods:{
        ...mapActions({
            fillUsers:'manageu/fillUsers',
            setUser: 'auth/setUser'
        }),
        deleteDropFile() {
            this.dropFile=null
            this.imgUser='/public/users/'+this.user.userImg;
        },
        async validateBeforeSubmit(){
            const result = await this.$validator.validateAll()
            if(!result){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: this.$t('pages.mngUser.edit.user.checkField')
                })
                return;
            }
            this.isLoading=true;
            let jsonData,res,formData;
            if(this.dropFile){
                formData = new FormData();
                formData.append('name', this.name);
                formData.append('lastName', this.lastName);
                formData.append('email', this.email);
                formData.append('username', this.username);
                if(this.capability){
                    formData.append('capability', this.capability);
                }
                formData.append('lvlAgent', this.lvlAgent);
                formData.append('gender', this.gender);
                if(this.country){
                    formData.append('country', this.country);
                }
                if(this.company){
                    formData.append('company', this.company);
                }
                if(this.jobTitle){
                    formData.append('jobTitle', this.jobTitle);
                }
                formData.append('userImg', this.dropFile);
                res = await fetch(`/api/user/${this.user._id}`,{
                    method: 'PUT',
                    body: formData,
                    headers:{
                        'Authorization': `Bearer ${this.access_token}`
                    }
                });
            } else {
                jsonData = {name:this.name,lastName:this.lastName,email:this.email,username:this.username,capability:this.capability,lvlAgent:this.lvlAgent,gender:this.gender,country:this.country,company:this.company,jobTitle:this.jobTitle}
                res = await fetch(`/api/user/data/${this.user._id}`,{
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.access_token}`
                    },
                    body: JSON.stringify(jsonData)
                });
            }
            const data = await res.json();
            this.isLoading=false;
            if(data.hasOwnProperty('message')){
                this.$swal({
                    type: 'error',
                    title: 'Opss...',
                    html: `${this.$t('pages.mngUser.edit.user.validData1')} <strong>${data.message.toString().replace(/,/g,', ')}</strong> ${this.$t('pages.mngUser.edit.user.validData2')}`,
                    customClass: {confirmButton: 'btn btn-primary'},
                    buttonsStyling: false,
                });
            } else {
                if(this.userID==this.user._id){
                    const cookies = new Cookies();
                    const res1 = await fetch(`/api/user/validtoken`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${cookies.get('token')}`
                        }
                    });
                    const user = await res1.json();
                    this.setUser(user);
                }
                if(this.dropFile!=null){
                    this.dropFile=null;
                    this.imgUser='/public/users/'+data.img;
                }
                if(this.userCapability=='manager'||this.userCapability=='admin'){
                    this.fillUsers();
                }
                let cancelButtonTextLabel = this.userCapability=='agent'?this.$t('pages.mngUser.edit.user.exitHome'):`${this.$route.name.slice(0,4)=='user'?this.$t('pages.mngUser.edit.user.exitHome'):this.$t('pages.mngUser.edit.user.exitShow')}`
                this.$swal({
                    type: 'success',
                    title: 'Sucessfully',
                    text: this.$t('pages.mngUser.edit.user.successEdit'),
                    customClass: {
                        confirmButton: 'btn btn-info ml-2',
                        cancelButton: 'btn btn-primary mr-2'
                    },
                    buttonsStyling: false,
                    showCancelButton: true,
                    confirmButtonText: this.$t('pages.mngUser.edit.user.exitKeep'),
                    cancelButtonText: cancelButtonTextLabel,
                    reverseButtons: true,
                    allowOutsideClick: false
                }).then(async (result)=>{
                    if(result.value){
                    } else if(result.dismiss == 'cancel'){
                        if(this.$route.name.slice(0,4)=='user'){
                            this.$router.push(this.localePath({name:'index'}))
                        } else {
                            this.userCapability=='agent'?this.$router.push(this.localePath({name:'index'})):this.$router.push(this.localePath({name:'manageusers'}));
                        }
                    }
                });
            }

        }
    },
    computed:{
        ...mapGetters({
            userCapability : 'auth/userCapability',
            userID: 'auth/userID'
        }),
        ...mapState({
            access_token: state => state.auth.access_token,
            userLoged: state => state.auth.authUser
        }),
        filteredDataArray() {
            return this.location.getCountries().filter(country=>this.countrySelected?country.name.toLowerCase().indexOf(this.countrySelected.toLowerCase())>-1:true);
        }
    },
    watch:{
        dropFile:function(val){
            if(val!=null){
                if(val.type!='image/jpeg' && val.type!='image/png'){
                    this.$swal({
                        type: 'error',
                        title: this.$t('pages.mngUser.edit.user.errorFile'),
                        text: this.$t('pages.mngUser.edit.user.errorImage'),
                    });
                    this.dropFile=null;
                } else {
                    this.imgUser=window.URL.createObjectURL(this.dropFile);
                }
            }
        },
        capability:function(val){
            if(val!='agent'){
                this.lvlAgent=null
            }
        }
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