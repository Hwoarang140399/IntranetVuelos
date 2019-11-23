<template>
    <section>
        <edit-user v-if="user" :user="user"/>
    </section>
</template>

<script>
import editUser from '~/components/editUser'
import {mapState} from 'vuex'

export default {
    nuxtI18n: {
        paths: {
            en: '/user/:username/editinfo',
            es: '/usuario/:username/editarinformacion'
        }
    },
    layout: 'navbar-normal',
    middleware: 'editinfo',
    components:{
        'edit-user': editUser
    },
    computed:{
        ...mapState({
            user: state => state.auth.authUser
        })
    }
}
</script>
