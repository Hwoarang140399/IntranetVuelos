<template>
    <section ref="firstLogin" class="content">
        <div class="card">
            <div class="card-header text-center bg-dark">
                <h1 class="text-white is-size-4"> {{nameUser.gender=='male'?this.$t('pages.firstlogin.titleMale'):this.$t('pages.firstlogin.titleFemale')}} {{nameUser.name}}</h1>
            </div>
            <form @submit.prevent="validateBeforeSubmit">
                <div class="card-body">
                    <p class="help">{{this.$t('pages.firstlogin.description')}}</p>
                        <div class="field">
                            <label class="label">{{this.$t('pages.firstlogin.passwordLabel')}}</label>        
                            <div class="control has-icons-left">
                                <input type="password" v-model="password" v-validate="'required|min:8'" name="password" :class="errors.has('password')?'input is-danger':'input'">
                                <b-icon class="is-left" icon="lock-question" ></b-icon>
                            </div>
                            <p v-if="errors.firstByRule('password','required')" class="help is-danger">{{this.$t('pages.firstlogin.error.required')}}</p>
                            <p v-if="errors.firstByRule('password','min')" class="help is-danger">{{this.$t('pages.firstlogin.error.passwordWrong')}}</p>
                        </div>

                        <div class="field">
                            <label class="label">{{this.$t('pages.firstlogin.confirmPasswordLabel')}}</label>
                            <div class="control has-icons-left">
                                <input type="password" v-model="confirmPassword" v-validate="{required:true,min:8,is:password}" :class="errors.has('confirm-password')?'input is-danger':'input'" name="confirm-password">
                                <b-icon class="is-left" icon="lock-question" ></b-icon> 
                            </div>
                            <p v-if="errors.firstByRule('confirm-password','required')" class="help is-danger">{{this.$t('pages.firstlogin.error.required')}}</p>
                            <p v-if="errors.firstByRule('confirm-password','is')" class="help is-danger">{{this.$t('pages.firstlogin.error.confirmPasswordWrong')}}</p>
                            <p v-if="errors.firstByRule('confirm-password','min')" class="help is-danger">{{this.$t('pages.firstlogin.error.passwordWrong')}}</p>
                        </div>
                </div>
                <div class="card-footer justify-content-center">
                    <button type="submit" class="btn btn-dark"> {{this.$t('pages.firstlogin.submit')}} </button>
                </div>
            </form>
        </div>

        <my-toast 
            id="my-toast"
            toaster='b-toaster-top-center' 
            variant='danger' 
            icon= 'close' 
            :title="this.$t('pages.firstlogin.error.notificationValidate.title')" 
            subtitle=''
            :content="this.$t('pages.firstlogin.error.notificationValidate.body')"
            delay='2500'
            close="false"
        >
        </my-toast>
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Toast from '~/components/Toast'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate,{
    events:''
})

export default {
    nuxtI18n: {
        paths: {
            en: '/firstlogin',
            es: '/primerinicio'
        }
    },
    middleware: 'firstlogin',
    components: {
        'my-toast': Toast
    },
    layout: 'navbar-simple',
    computed:{
        ...mapGetters({
            nameUser:'auth/userGenderUC',
            idUser: 'auth/userID'
        })
    },
    data(){
        return {
            password: null,
            confirmPassword: null
        }
    },
    methods:{
        ...mapActions({
            firstLogin: 'auth/firstLogin',
            logoutUser: 'auth/logout',
            setFirstChange: 'auth/setFirstChange'
        }),
        async validateBeforeSubmit(){
            const result = await this.$validator.validateAll();
            if(!result){
                this.$bvToast.show('my-toast');
                return;
            }
            const loadingComponent  = this.$buefy.loading.open({container:this.$refs.firstLogin.$el});
            const resultA = await this.firstLogin({id:this.idUser, password:this.password});
            loadingComponent.close();
            this.$router.push(this.localePath({name:'index'}));
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
