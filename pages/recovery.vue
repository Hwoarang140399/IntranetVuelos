<template>
    <section class="content">
        <div class="card">
            <div class="card-header text-center bg-dark justify-content-center">
                <h1 class="text-white is-size-4"> {{this.$t('pages.recovery.title')}}</h1>
            </div>
            <form @submit.prevent="validateBeforeSubmit">
                <div class="card-body">
                    <p v-if="token" class="help">{{this.$t('pages.recovery.descriptionIT')}}</p>
                    <p v-if="!token" class="help mb-n2 text-center">{{this.$t('pages.recovery.descriptionET1')}}</p>
                    <p v-if="!token" class="help pb-2 text-center">{{this.$t('pages.recovery.descriptionET2')}}</p>
                    <div class="field">
                        <label class="label">{{token?this.$t('pages.recovery.labelIT'):this.$t('pages.recovery.labelET')}}</label>        
                        <div class="control has-icons-left">
                            <input type="text" v-model="user" v-validate="'required'" name="user" :class="errors.has('user')?'input is-danger':'input'" autocomplete="off">
                            <b-icon class="is-left" :icon="token?'account-key':'account'"></b-icon>
                        </div>
                        <p v-if="errors.firstByRule('user','required')" class="help is-danger">{{this.$t('pages.recovery.error.required')}}</p>
                    </div>
                    <div class="row mb-n3 mt-n3 justify-content-end">
                        <p @click="toggleModal" class="button help is-text"><strong>{{token?this.$t('pages.recovery.labelSwitchIT'):this.$t('pages.recovery.labelSwitchET')}}</strong></p>
                    </div>
                </div>
                <div class="card-footer justify-content-center">
                    <button type="submit" class="btn btn-dark"> {{this.$t('pages.recovery.submit')}} </button>
                </div>
            </form>
        </div>
        <b-loading :active.sync="isLoading" :can-cancel="true"></b-loading>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate,{
    events:''
});

export default {
    nuxtI18n: {
        paths: {
            en: '/recovery',
            es: '/recuperar'
        }
    },
    layout: 'navbar-simple',
    data(){
        return {
            user: null,
            isLoading: false
        }
    },
    computed:{
        ...mapState({
            token: state => state.auth.token
        })
    },
    methods:{
        ...mapActions({
            toggleToken: 'auth/toggleToken',
            setUserToRecover: 'auth/setUserToRecover'
        }),
        toggleModal(){
            this.toggleToken(!this.token);
            this.user=null;
        },
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
            if(this.token){

                this.isLoading=true;
                const resultC1 = await fetch('/api/user/reset/'+this.user);
                const resultC = await resultC1.json();
                this.isLoading=false;
                if(resultC.hasOwnProperty('error')){
                    this.$swal({
                        toast:true,
                        position:'top',
                        showConfirmButton: false,
                        timer: 2500,
                        title: this.$t('pages.recovery.error.notificationTokenFail'),
                        type: 'error'
                    });
                } else {
                    this.$swal({
                        type:'success',
                        title: this.$t('pages.recovery.successTitle'),
                        text: this.$t('pages.recovery.tokenSuccessDescription'),
                        allowOutsideClick: false,
                        onAfterClose: () => {
                            this.setUserToRecover(resultC.user);
                            this.$router.push(this.localePath({name:'resetpassword'}));
                        }
                    })
                }
            } else {
                this.isLoading=true;
                const resultA1 = await fetch('/api/user/forgot',{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({email:this.user,resend:false})
                });
                const resultA = await resultA1.json();
                this.isLoading=false;
                if(resultA.hasOwnProperty('message')){
                    this.$swal({
                        toast:true,
                        position:'top',
                        showConfirmButton: false,
                        timer: 2500,
                        title: `${resultA.message==1?`${this.user}${this.$t('pages.recovery.error.notificationUserFound')}`:`${this.$t('pages.recovery.error.notificationTokenNoSent')}`}`,
                        type: 'error'
                    });
                } else {
                    if(resultA.status==1){
                        this.$swal({
                            type:'success',
                            title: this.$t('pages.recovery.successTitle'),
                            text: this.$t('pages.recovery.userSuccessDescription',{email:resultA.email}),
                            allowOutsideClick: false,
                            onAfterClose: () => {
                                this.$router.push(this.localePath({name:'index'}));
                            }
                        })
                    } else if(resultA.status==2){
                        this.$swal({
                            type:'warning',
                            title: this.$t('pages.recovery.error.notificationAlreadySentTitle'),
                            text: this.$t('pages.recovery.error.notificationAlreadySentDescription',{email:resultA.email}),
                            showCancelButton: true,
                            confirmButtonText: this.$t('pages.recovery.error.buttonAlreadySentTrue'),
                            cancelButtonText: this.$t('pages.recovery.error.buttonAlreadySentFalse'),
                            reverseButtons: true,
                            customClass: {
                                confirmButton: 'btn btn-success m-2',
                                cancelButton: 'btn btn-danger m-2'
                            },
                            buttonsStyling: false,
                            allowOutsideClick: false
                        }) .then(async (result) => {
                            if(result.value){
                                this.isLoading=true;
                                const resultB1 = await fetch('/api/user/forgot',{
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    method: 'POST',
                                    body: JSON.stringify({email:this.user,resend:true})
                                });
                                const resultB = await resultB1.json();
                                this.isLoading=false;
                                this.$swal({
                                    type:'success',
                                    title: this.$t('pages.recovery.successTitle'),
                                    text: this.$t('pages.recovery.userSuccessDescriptionCopy',{email:resultB.email}),
                                    allowOutsideClick: false,
                                    onAfterClose: () => {
                                        this.$router.push(this.localePath({name:'index'}));
                                    }
                                })
                            } else if(result.dismiss == 'cancel'){
                                this.$swal({
                                    type:'error',
                                    title: this.$t('pages.recovery.error.cancelCopyTitle'),
                                    text: this.$t('pages.recovery.error.cancelCopyDescription'),
                                    allowOutsideClick: false,
                                    onAfterClose: () => {
                                        this.$router.push(this.localePath({name:'index'}));
                                    }
                                })
                            }
                        });
                    }
                }
            }
        }
    },
    beforeRouteLeave(to,from,next){
        let lang = this.$i18n.locale;
        let toLang = lang=='es'?'en':'es';
        let pathTo = this.localePath({name:'recovery'},toLang);
        if(to.path!=pathTo){
            this.toggleToken(false)
        } 
        next();
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
