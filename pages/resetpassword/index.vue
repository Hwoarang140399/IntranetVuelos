<template>
    <section class="content">
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
    </section>
</template>

<script>
import { mapActions,mapState } from 'vuex';

export default {
    middleware: 'reset',
    nuxtI18n: {
        paths: {
            en: '/resetpassword',
            es: '/reiniciarcontraseña'
        }
    },
    layout: 'navbar-simple',
    computed:{
        ...mapState({
            userRecover: state => state.auth.userToRecover
        })
    },
    data(){
        return {
            password:null,
            isLoading:false,
            done:false
        }
    },
    methods:{
        ...mapActions({
            setUserToRecover: 'auth/setUserToRecover'
        }),
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
            const resultC1 = await fetch('/api/user/reset',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({user:this.userRecover,password:this.password})
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
                        this.setUserToRecover(null);
                        this.done=true;
                        this.$router.push(this.localePath({name:'index'}));
                    }
                })
            } else {
                this.$swal({
                    type:'success',
                    title: this.$t('pages.reset.notificationTitleSuccess'),
                    text: this.$t('pages.reset.notificationDescriptionSuccess'),
                    allowOutsideClick: false,
                    onAfterClose: () => {
                        this.setUserToRecover(null);
                        this.done=true;
                        this.$router.push(this.localePath({name:'index'}));
                    }
                })
            }
        }
    },
    beforeRouteLeave(to,from,next){
        let lang = this.$i18n.locale;
        let toLang = lang=='es'?'en':'es';
        let pathTo = this.localePath({name:'resetpassword'},toLang);
        if(to.path==pathTo){
            next();
        }  else if(this.done){
            next();
        }   else if(!this.done){
            this.$swal({
                type:'warning',
                title: this.$t('pages.reset.leavingTitle'),
                text: this.$t('pages.reset.leavingDescription'),
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
                    this.setUserToRecover(null);
                    next();
                } else if(result.dismiss == 'cancel'){
                    next(false);
                }
            });
        }
    }
}
</script>
<style scoped>
.content {
  position: absolute;
  top: 50%;
  left:50%;
  transform: translate(-50%,-50%);
}
</style>
