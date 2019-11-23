<template>
    <section>
        <b-modal v-if="authUser==null" :active.sync="isComponentModalActive" :on-cancel="closed" has-modal-card>
            <login-form/>
        </b-modal>
    </section>
</template>

<script>
import LoginForm from '~/components/Loginform';
import {mapState} from 'vuex';

export default {
    nuxtI18n: {
        paths: {
            en: '/login',
            es: '/iniciosesion'
        }
    },
    components: {
        'login-form': LoginForm
    },
    layout: 'navbar-simple',
    data(){
        return{
            isComponentModalActive: true
        }
    },
    computed:{
        ...mapState({
            authUser: state => state.auth.authUser
        })
    },
    methods:{
        closed(){
            this.$router.push(this.localePath({name:'index'}))
        }
    },
    beforeMount(){
        if(this.authUser!=null){
            this.$swal({
                title: this.$t('pages.login.title'),
                text: this.$t('pages.login.text'),
                type: 'info',
                customClass:{
                    confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false,
                confirmButtonText: this.$t('pages.login.button'),
                allowOutsideClick: false
            }) .then(result=>{
                if(result.value){
                    this.$router.push(this.localePath({name:'index'}))
                }
            })
        }
    }

}
</script>

<style scoped>
.centerContent {
  position: absolute;
  top: 50%;
  left:50%;
  transform: translate(-50%,-50%);
}
</style>
