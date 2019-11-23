<template>
    <section class="content section row mt-5 justify-content-center">
        <div class="card">
            <div class="card-header text-center bg-dark justify-content-center">
                <h1 class="text-white mb-0 is-size-4"> {{this.$t('pages.reset.title')}}</h1>
            </div>
           <form @submit.prevent="validateBeforeSubmit">
                <div class="card-body">
                    <p class="help">{{this.$t('pages.reset.description')}}</p>
                        <div class="field">
                            <label class="label">{{this.$t('pages.reset.field1')}}</label>        
                            <div class="control has-icons-left">
                                <input type="password" v-model="password" v-validate="'required|min:8'" name="password" :class="errors.has('password')?'input is-danger':'input'">
                                <b-icon class="is-left" icon="lock-question" ></b-icon>
                            </div>
                            <p v-if="errors.firstByRule('password','required')" class="help is-danger">{{this.$t('pages.firstlogin.error.required')}}</p>
                            <p v-if="errors.firstByRule('password','min')" class="help is-danger">{{this.$t('pages.firstlogin.error.passwordWrong')}}</p>
                        </div>

                        <div class="field">
                            <label class="label">{{this.$t('pages.reset.field2')}}</label>
                            <div class="control has-icons-left">
                                <input type="password" v-validate="{required:true,min:8,is:password}" :class="errors.has('confirm-password')?'input is-danger':'input'" name="confirm-password">
                                <b-icon class="is-left" icon="lock-question" ></b-icon> 
                            </div>
                            <p v-if="errors.firstByRule('confirm-password','required')" class="help is-danger">{{this.$t('pages.firstlogin.error.required')}}</p>
                            <p v-if="errors.firstByRule('confirm-password','is')" class="help is-danger">{{this.$t('pages.firstlogin.error.confirmPasswordWrong')}}</p>
                            <p v-if="errors.firstByRule('confirm-password','min')" class="help is-danger">{{this.$t('pages.firstlogin.error.passwordWrong')}}</p>
                        </div>
                </div>
                <div class="card-footer justify-content-center">
                    <button type="submit" class="btn btn-dark"> {{this.$t('pages.reset.submit')}} </button>
                </div>
            </form>
        </div>
        <b-loading :active.sync="isLoading" :can-cancel="true"></b-loading>
        <!-- <p>{{id}}</p> -->
    </section>
</template>

<script>
import { mapGetters,mapState } from 'vuex';

export default {
    middleware: 'resetpassword',
    nuxtI18n: {
        paths: {
            en: '/user/:username/editpassword',
            es: '/usuario/:username/editarcontrasena'
        }
    },
    layout: 'navbar-normal',
    data(){
        return {
            password:null,
            isLoading:false,
            id: null,
            userState:false
        }
    },
    async beforeMount(){
        if(this.user.username!=this.$route.params.username){
            let userStore = this.getUser(this.$route.params.username)
            if(userStore){
                this.id=this.getUser(this.$route.params.username)._id
            } else {
                const res = await fetch(`/api/user/findone/${this.$route.params.username}`);
                this.id = await res.json();
            }
        } else {
            this.id=this.user._id;
            this.userState=true;
        }
    },
    computed:{
        ...mapGetters({
            getUser:'manageu/getUser'
        }),
        ...mapState({
            user: state => state.auth.authUser,
            access_token: state => state.auth.access_token
        })
    },
    methods:{
        async validateBeforeSubmit(){
            const result = await this.$validator.validateAll();
            if(!result){
                this.$swal({
                    toast:true,
                    position:'top',
                    showConfirmButton: false,
                    timer: 2500,
                    title: this.$t('pages.recovery.error.notificationRequired'),
                    type: 'error'
                });
                return;
            }
            this.isLoading=true;
            const resultC1 = await fetch(`/api/user/data/${this.id}`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                },
                method: 'PUT',
                body: JSON.stringify({password:this.password})
            });
            const resultC = await resultC1.json();
            this.isLoading=false;
            if(resultC.hasOwnProperty('message')){
                this.$swal({
                    type:'info',
                    title: this.$t('pages.reset.notificationTitleSuccess'),
                    text: this.$t('pages.reset.notificationDescriptionFail'),
                    allowOutsideClick: false,
                    onAfterClose: () => {
                        this.done=true;
                        this.$router.push(this.localePath({name:'user-username'}));
                    }
                })
            } else {
                this.$swal({
                    type:'success',
                    title: this.$t('pages.reset.notificationTitleSuccess'),
                    text: this.$t('pages.reset.notificationDescriptionSuccess'),
                    allowOutsideClick: false,
                    onAfterClose: () => {
                        this.done=true;
                        this.userState?this.$router.push(this.localePath({name:'user-username'})):this.$router.push(this.localePath({name:'manageusers'}));
                    }
                })
            }
        }
    },
    beforeRouteLeave(to,from,next){
        let lang = this.$i18n.locale;
        let toLang = lang=='es'?'en':'es';
        let pathTo = this.localePath({name:'user-username-editpassword'},toLang);
        if(to.path==pathTo){
            next();
        }  else if(this.done){
            next();
        }   else if(!this.done){
            this.$swal({
                type:'warning',
                title: this.$t('pages.reset.leavingTitle'),
                text: this.$t('pages.reset.leavingDescriptionUser'),
                showCancelButton: true,
                confirmButtonText: this.$t('pages.reset.buttonLeavingCancel'),
                cancelButtonText: this.$t('pages.reset.buttonLeavingOk'),
                reverseButtons: false,
                customClass: {
                    confirmButton: 'btn btn-danger m-2',
                    cancelButton: 'btn btn-success m-2'
                },
                buttonsStyling: false,
                allowOutsideClick: false
            }) .then(async (result) => {
                if(result.value){
                    next();
                } else if(result.dismiss == 'cancel'){
                    next(false);
                }
            });
        }
    }
}
</script>

