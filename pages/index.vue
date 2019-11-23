<template>
    <div>
        <template v-if="auth">
            <template v-if="!firstLogin">
                <home-a/>
            </template>
        </template>
        <template v-else>
            <home-na/>
        </template>
    </div>
</template>

<script>
import homeA from '~/components/homeA'
import homeNA from '~/components/homeNA'
import {mapState} from 'vuex'

export default {
    sockets:{
        connect(){
            if(this.auth!=null){
                this.$socket.emit('login',this.auth._id);
            }
        }
    },
    computed:{
        ...mapState({
            firstLogin: state => state.auth.firstLogin,
            auth: state => state.auth.authUser
        })
    },
    components:{
        'home-a':homeA,
        'home-na':homeNA
    },
    layout: 'navbar-normal'
}
</script>