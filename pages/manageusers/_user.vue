<template>
    <section>
        <edit-user v-if="done" :user="user"/>
    </section>
</template>
<script>
import editUser from '~/components/editUser'
import {mapGetters,mapActions} from 'vuex'

export default {
    layout: 'navbar-normal',
    nuxtI18n: {
        paths: {
            en: '/manageusers/:user',
            es: '/administracionusuarios/:user'
        }
    },
    middleware: 'manager',
    components: {
        'edit-user': editUser
    },
    async beforeMount(){
        if(this.getUser(this.$route.params.user)==null){
            await this.fillUsers();
            this.user = this.getUser(this.$route.params.user);
            this.done=true;
        } else {
            this.user = this.getUser(this.$route.params.user);
            this.done=true;
        }
        
    },
    data(){
        return {
            user: null,
            done:false
        }
    },
    computed: {
        ...mapGetters({
            getUser: 'manageu/getUser'
        })
    },
    methods:{
        ...mapActions({
            fillUsers:'manageu/fillUsers',
        })
    }
}
</script>