<template>
    <section>
        <form ref="formLogin" @submit.prevent="validateBeforeSubmit">
            <div class="modal-card" style="width:auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{$t('components.Navbar.login')}}</p>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">{{this.$t('components.loginForm.emailText')}}</label>
                        <div class="control has-icons-left has-icons-right">
                            <input :class="errors.has('email')?'input is-danger':'input'" name="email" v-model="id" :placeholder="this.$t('components.loginForm.emailPlaceholder')" autocomplete="off" v-validate.disable="'required'">
                            <b-icon class="is-left" icon="account"></b-icon>
                            <b-icon v-if="errors.has('email')" :type="errors.has('email')?'is-danger':''" class="is-right" icon="alert-circle"></b-icon>
                        </div>
                        <span class="help is-danger" v-if="errors.firstByRule('email','required')">{{this.$t('components.loginForm.errors.empty')}}</span>
                    </div>
                    
                    <b-field :label="this.$t('components.loginForm.passwordText')"
                        :type="{'is-danger': errors.has('password')}"
                        :message="errors.has('password')?this.$t('components.loginForm.errors.empty'):''">
                        <b-input icon="lock-question" :placeholder="this.$t('components.loginForm.passwordPlaceholder')" autocomplete="off" :type="errors.has('password')?'password is-danger':'password'" v-model="password" password-reveal name="password" v-validate="'required'" />
                    </b-field>

                    <div class="is-size-7 row justify-content-end">
                        <nuxt-link :to="localePath('recovery')">{{this.$t('components.loginForm.forgot')}}</nuxt-link>
                    </div>

                        <my-toast 
                            id="my-toast"
                            toaster='b-toaster-top-center' 
                            variant='danger' 
                            icon= 'close' 
                            :title="this.$t('components.loginForm.errors.notificationValidate.title')" 
                            subtitle=''
                            :content="this.$t('components.loginForm.errors.notificationValidate.body')"
                            delay='2500'
                            close="false"
                        >
                        </my-toast> 
                        <my-toast 
                            id="my-toast-two"
                            toaster='b-toaster-top-center' 
                            variant='danger' 
                            icon= 'close' 
                            :title="this.$t('components.loginForm.errors.notificationResult.title')" 
                            subtitle=''
                            :content='errorBodyToastTwo'
                            delay='2500'
                            close="false"
                        >
                        </my-toast>                
                </section>
                <footer class="modal-card-foot row justify-content-center">
                        <button type="submit" class="button is-primary"> {{this.$t('components.loginForm.submit')}} </button>
                </footer>
            </div>
        </form>
    </section>
</template>
<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
import Toast from './Toast';
import { mapGetters } from 'vuex';

Vue.use(VeeValidate,{events:''});

export default {
    data(){
        return{
            errorBodyToastTwoEmail: this.$t('components.loginForm.errors.notificationResult.body[0]'),
            errorBodyToastTwoPassword: this.$t('components.loginForm.errors.notificationResult.body[1]'),
            errorBodyToastTwo: '',
            id:'',
            password: '',
            typePwd: true
        }
    },
    components:{
        'my-toast':Toast
    },
    methods:{
        async validateBeforeSubmit(){
            const result = await this.$validator.validateAll()
            if(!result){
                this.$bvToast.show('my-toast');
                return;
            }
            const loadingComponent  = this.$buefy.loading.open({container:this.$refs.formLogin.$el});
            const responseAction = await this.$store.dispatch('auth/login',{email:this.id,password:this.password});
            loadingComponent.close();
            if(responseAction.hasOwnProperty('message')){
                responseAction.message==0?this.errorBodyToastTwo=`${responseAction.field} ${this.errorBodyToastTwoEmail}`:this.errorBodyToastTwo=this.errorBodyToastTwoPassword;
                this.$bvToast.show('my-toast-two');
                return;
            }
            this.$socket.emit('login',this.userID);
            if(responseAction.status){
                this.$router.push(this.localePath({name:'firstlogin'}))
            } else {
                // this.$router.push(this.localePath({name:'index'})).catch(err=>console.log('error in index'))
            }
            this.$parent.close();
        },
        changeTypePwd(){
            this.typePwd=!this.typePwd
        }
    },
    computed:{
        ...mapGetters({
            userID: 'auth/userID'
        })
    }
}
</script>
