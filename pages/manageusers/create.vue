<template>
    <section class="section">
        <form class="columns is-centered" @submit.prevent="validateBeforeSubmit">
            <div class="column is-1 w-50 ml-n5 box">
                <label style="border-bottom:2px solid black" class="pb-2 mt-n3 label text-center is-size-3">{{$t('pages.mngUser.create.title')}}</label>
                <p class="help">{{$t('pages.mngUser.create.help')}}</p>
                <div class="pt-3 field">
                    <div class="align-items-center row">
                        <div class="col-2">
                            <label class="label">{{$t('pages.mngUser.create.email')}}</label>
                        </div>
                        <div class="col-6">
                            <input :class="errors.has('email')?'input is-danger':'input'" v-model="email" name="email" v-validate="'required|email'" autocomplete="off" :placeholder="$t('pages.mngUser.create.emailPH')" type="text">
                        </div>    
                    </div>
                    <div v-if="errors.has('email')" class="row pb-2">
                        <span v-if="errors.firstByRule('email','required')" class="col-6 offset-2 help is-danger">It's empty</span>
                        <span v-if="errors.firstByRule('email','email')" class="col-6 offset-2 help is-danger">It's not a email</span>
                    </div>
                </div>
                <div class="field">
                    <div class="align-items-center row">
                        <div class="col-2">
                            <label class="label">{{$t('pages.mngUser.create.genderTitle')}}</label>
                        </div>
                        <div class="col-6">
                            <b-radio v-model="gender" v-validate="'required'" name="gender" native-value="male">{{$t('pages.mngUser.create.gender1')}}</b-radio>
                            <b-radio v-model="gender" v-validate="'required'" name="gender" native-value="female">{{$t('pages.mngUser.create.gender2')}}</b-radio>
                        </div>
                    </div>
                    <div v-if="errors.has('gender')" class="row pb-2">
                        <span v-if="errors.first('gender')" class="col-6 offset-2 help is-danger">It's empty</span>
                    </div>    
                </div>
                <div class="field">
                    <div class="align-items-center row">
                        <div class="col-2">
                            <label class="label">{{$t('pages.mngUser.create.capability')}}</label>
                        </div>
                        <div :class="capability=='agent'?'col-3':'col-5'">
                            <b-field :type="{'is-danger': errors.has('capability')}">
                                <b-select name="capability" v-validate="'required'" v-model="capability" :placeholder="$t('pages.mngUser.create.capabilityPH')">
                                    <option value="agent">{{$t('pages.mngUser.create.capability1')}}</option>
                                    <option value="manager">{{$t('pages.mngUser.create.capability2')}}</option>
                                    <option value="admin">{{$t('pages.mngUser.create.capability3')}}</option>
                                </b-select>
                            </b-field>
                        </div>
                        <div v-if="capability=='agent'" class="col-2">
                            <label class="label">{{$t('pages.mngUser.create.accessAgent')}}</label>
                        </div>
                        <div v-if="capability=='agent'" class="col-4">
                            <b-field :type="{'is-danger': errors.has('lvlagent')}">
                                <b-select v-model="levelAgent" :type="{'is-danger': errors.has('lvlagent')}" name="lvlagent" v-validate="'required'" :placeholder="$t('pages.mngUser.create.accessAgentPH')">
                                    <option value="peru">{{$t('pages.mngUser.create.accessAgent1')}}</option>
                                    <option value="basic">{{$t('pages.mngUser.create.accessAgent2')}}</option>
                                    <option value="ota">{{$t('pages.mngUser.create.accessAgent3')}}</option>
                                    <option value="premium">{{$t('pages.mngUser.create.accessAgent4')}}</option>
                                    <option value="staff">{{$t('pages.mngUser.create.accessAgent5')}}</option>
                                </b-select>
                            </b-field>
                        </div>
                    </div>
                    <div v-if="errors.has('capability')" class="row">
                        <span v-if="errors.first('capability')" class="col-5 offset-2 help is-danger">It's empty</span>
                    </div>
                    <div v-if="errors.has('lvlagent')" class="row">
                        <span v-if="errors.first('lvlagent')" class="col-4 offset-7 help is-danger">It's empty</span>
                    </div>
                </div>
                <div class="row field pt-3 justify-content-center">
                    <button type="submit" class="button is-dark">{{$t('pages.mngUser.create.submit')}}</button>
                </div>
            </div>
        </form>
        <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
    </section>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
import {mapActions,mapState} from 'vuex'

Vue.use(VeeValidate,{
    events: ''
})

export default {
    nuxtI18n: {
        paths: {
            en: '/manageusers/create',
            es: '/administracionusuarios/crear'
        }
    },
    layout: 'navbar-normal',
    middleware: 'manager',
    data(){
        return{
            email:null,
            gender:null,
            capability:null,
            levelAgent:null,
            isLoading: false
        }
    },
    watch:{
        capability(){
            this.levelAgent=null;
        }
    },
    computed:{
        ...mapState({
            access_token:state=>state.auth.access_token
        })
    },
    methods:{
        ...mapActions({
            fillUsers: 'manageu/fillUsers'
        }),
        async validateBeforeSubmit(){
            const result = await this.$validator.validateAll()
            if(!result){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'Please, check the fields.'
                })
                return;
            }
            this.isLoading=true;
            let dataToSend = {email:this.email,gender:this.gender,capability:this.capability.toLowerCase(),lvlAgent:this.capability=='agent'?this.levelAgent.toLowerCase():null}
            const res = await fetch('/api/user/signup',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                },
                body: JSON.stringify(dataToSend)
            });
            const data = await res.json();
            this.isLoading=false;
            if(data.hasOwnProperty('message')){
                if(data.message==1){
                    this.$swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Email already exits!'
                    });
                } else if(data.message==2){
                    this.$swal({
                        type: 'info',
                        title: 'Something wrong',
                        text: 'The user is created but not notified'
                    });
                }
            } else {
                this.fillUsers();
                this.$swal({
                    type: 'success',
                    title: 'Sucessfully',
                    text: `The user was created successfully and have notified how proceed.`,
                    customClass: {
                        confirmButton: 'btn btn-info ml-2',
                        cancelButton: 'btn btn-primary mr-2'
                    },
                    buttonsStyling: false,
                    showCancelButton: true,
                    confirmButtonText: 'Add another user',
                    cancelButtonText: 'Show all users',
                    reverseButtons: true,
                    allowOutsideClick: false
                }).then((result)=>{
                    this.email=null;
                    this.gender=null;
                    this.capability=null;
                    if(result.value){

                    } else if(result.dismiss == 'cancel'){
                        this.$router.push(this.localePath({name:'manageusers'}));
                    }
                });
            }
        }
    }
}
</script>

