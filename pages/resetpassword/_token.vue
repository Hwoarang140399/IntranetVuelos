<template>
    <section>
    </section>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    middleware: 'resetToken',
    nuxtI18n: {
        paths: {
            en: '/resetpassword/:token',
            es: '/reiniciar contraseña/:token'
        }
    },
    layout: 'navbar-simple',
    methods: {
        ...mapActions({
            setUserToRecover: 'auth/setUserToRecover'
        })
    },
    async mounted() {
        const resultC1 = await fetch('/api/user/reset/'+this.$route.params.token);
        const resultC = await resultC1.json();
        if(resultC.hasOwnProperty('error')){
            this.$swal({
                toast:true,
                position:'top',
                showConfirmButton: false,
                timer: 2500,
                title: this.$t('pages.recovery.error.notificationTokenFail'),
                type: 'error'
            });
            this.$swal({
                type:'error',
                title: this.$t('pages.recovery.error.notificationTokenFail'),
                text: this.$t('pages.recovery.error.notificationTokenFailText'),
                allowOutsideClick: false,
                onAfterClose: () => {
                    this.$router.push(this.localePath({name:'recovery'}));
                }
            })
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
        
    }
}
</script>