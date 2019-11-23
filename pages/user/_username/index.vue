<template>
    <section>
        <no-ssr>
                
        <div v-if="user" class="columns">
            <aside class="column is-2 section">
                <figure class="image is-1by1">
                    <img class="img-thumbnail" :src="`/public/users/${user.userImg}`">
                </figure>
                <div v-if="this.authUser.username==this.$route.params.username" class="pt-2 text-center">
                    <nuxt-link :to="localePath({name:'user-username-editinfo',params:{username:user.username}})" class="button is-text is-small">Edit profile</nuxt-link>
                </div>
            </aside>
            <div class="column mt-3 content section is-10">
                <div class="row">
                    <div class="col-auto">
                        <h1>{{user.name.slice(0,1).toUpperCase()}}{{user.name.slice(1)}}</h1>
                    </div>
                    <div class="col-auto ml-n3">
                        <h1 v-if="user.lastName">{{user.lastName.slice(0,1).toUpperCase()}}{{user.lastName.slice(1)}}</h1>
                    </div>
                    <div class="col-auto ml-n3">
                        <b-icon class="mt-2 pt-2" :type="user.isActive?'is-success':''" size="is-small" icon="circle"/>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-1 mr-n3">
                        <p>Email:</p>
                    </div>
                    <div class="col-3 ml-n2">
                        <p>{{user.email}}</p>
                    </div>
                    <div class="col-2 offset-1 mr-n4">
                        <p>Gender:</p>
                    </div>
                    <div class="col-2 ml-n5">
                        <p>{{user.gender=='male'?'Male':'Female'}}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-1 mr-n3">
                        <p>Country:</p>
                    </div>
                    <div class="col-3 ml-n2">
                        <p>{{country.emoji}}  {{country.name}}</p>
                    </div>
                    <div class="col-2 offset-1 mr-n4">
                        <p>Start date:</p>
                    </div>
                    <div class="col-2 ml-n5">
                        <p>{{moment(user.creationDate).format(locale=='es'?'DD/MM/YYYY':'MM/DD/YYYY')}}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-1 mr-n3">
                        <p>Company:</p>
                    </div>
                    <div class="col-3 ml-n2">
                        <p>{{user.company}}</p>
                    </div>
                    <div class="col-2 offset-1 mr-n5">
                        <p>Job Title:</p>
                    </div>
                    <div class="col-3 ml-n5">
                        <p>{{user.jobTitle}}</p>
                    </div>
                </div>
            </div>
        </div>
        </no-ssr>
                
              <!-- <p>{{imgUser}}</p> -->
    </section>
</template>

<script>
import {mapState,mapGetters,mapActions} from 'vuex';
import locationData from 'countrycitystatejson';

export default {
    nuxtI18n: {
        paths: {
            en: '/user/:username',
            es: '/usuario/:username'
        }
    },
    layout: 'navbar-normal',
    middleware: 'auth',
    data(){
        return{
            user:null,
            locale:'',
            location: locationData,
            country:null
        }
    },
    computed:{
        ...mapState({
            authUser: state => state.auth.authUser,
            access_token:state=>state.auth.access_token
        }),
        ...mapGetters({
            getUser: 'manageu/getUser'
        })
    },
    async beforeMount(){
        if(this.authUser.username==this.$route.params.username){
            this.user=this.authUser;
        } else {
            const myHeaders = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.access_token}`
            })
                    
            if(this.authUser.capability=='admin'||this.authUser.capability=='manager'){
                let userFound = this.getUser(this.$route.params.username);
                if(userFound){
                    this.user=userFound;
                } else {
                    const res = await fetch(`/api/user/find/${this.$route.params.username}`,{
                        method: 'GET',
                        headers: myHeaders
                    });
                    const user = await res.json();
                    this.user=user;
                }
            } else {
                const res = await fetch(`/api/user/find/${this.$route.params.username}`,{
                    method: 'GET',
                    headers: myHeaders
                });
                const user = await res.json();
                this.user=user;
            }
        }
        this.locale=this._i18n._vm.locale;
        this.country=this.user.country?this.location.getCountryInfoByShort(this.user.country):null;
    }
}
</script>