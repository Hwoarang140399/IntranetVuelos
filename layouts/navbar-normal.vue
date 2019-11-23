<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <nuxt-link class="navbar-brand align-items-center" :to="localePath('index')">
                <figure class="figure">
                    <img style="height:3rem;" src="~/assets/logo_01.png">
                </figure>
            </nuxt-link>
            <button @click="isOpen=!isOpen" :class="isOpen?'navbar-toggler':'navbar-toggler collapsed'" type="button" data-toggle="collapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div :class="isOpen?'collapse navbar-collapse show':'collapse navbar-collapse'">
                <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <nuxt-link
                            v-for="locale in $i18n.locales"
                            v-if="locale.code !== $i18n.locale"
                            :key="locale.code"
                            :to="switchLocalePath(locale.code)"
                        >
                            <div class="row text-white">
                                <div class="col-1"><span class="icon"><img :src="require(`~/assets/flag-icons/${locale.code}.svg`)"></span></div>
                                <p class="col-1">{{ locale.name }}</p>
                            </div>
                        </nuxt-link> 
                    </li>
                </ul>
                <ul class="navbar-nav my-2 my-lg-0">
                    <template v-if="auth">
                        <li class="nav-item">
                            <nuxt-link :to="localePath({name:'user-username',params:{username:auth.username}})">
                                <figure class="image is-48x48">
                                    <img class="is-rounded fluid" :src="`/public/users/${auth.userImg}`">
                                </figure>
                            </nuxt-link>
                        </li>
                        <li class="nav-item mt-1">
                            <nuxt-link class="btn btn-text text-white" :to="localePath({name:'user-username',params:{username:auth.username}})"><strong>{{getNameFC}}</strong></nuxt-link>
                        </li>
                        <li class="ml-n2 nav-item">
                            <button class="btn btn-text text-white">
                                <span class="icon is-medium text-white">
                                    <i class="mdi mdi-24px mdi-earth"></i>
                                    <span class="badge ml-n2 mt-n2 badge-pill badge-danger">9</span>
                                </span>
                            </button>
                        </li>
                    </template>
                    <li class="nav-item">
                        <a class="button ml-3 mt-1 btn-light" @click="sign">{{ signText }}</a>
                    </li>
                </ul>
            </div>
        </nav>

        <b-modal :active.sync="isComponentModalActive" has-modal-card>
            <login-form/>
        </b-modal>

        <section v-if="auth" class="main-content columns">
            <aside class="menu column is-2 section">
                <p class="menu-label is-hidden-touch">{{$t('components.Navbar.general')}}</p>
                <ul class="menu-list">
                    <li>
                        <nuxt-link :to="localePath({name:'index'})" exact-active-class="is-active has-background-black"><b-icon icon="home"/>&nbsp;{{$t('components.Navbar.home')}}</nuxt-link>
                    </li>
                    <li>
                        <nuxt-link :to="localePath({name:'findcommissions'})" exact-active-class="is-active has-background-black"><b-icon icon="coins"/>&nbsp;{{$t('components.Navbar.commission')}}</nuxt-link>
                    </li>
                </ul>
                <p class="menu-label is-hidden-touch">{{$t('components.Navbar.admin')}}</p>
                <ul class="menu-list"> 
                    <li v-if="auth.capability=='admin' || auth.capability=='manager'">
                        <nuxt-link :to="localePath({name:'manageusers'})" exact-active-class="is-active has-background-black"><b-icon icon="account-star"/>&nbsp;{{$t('components.Navbar.mngUser.title')}}</nuxt-link>
                    </li>
                    <li v-if="auth.capability=='admin'">
                        <nuxt-link :to="localePath({name:'managecontracts-editcommissions'})" exact-active-class="is-active has-background-black"><b-icon icon="transition-masked"/>&nbsp;{{$t('components.Navbar.mngContract.editCommission')}}</nuxt-link>
                    </li>

                    <li v-if="auth.capability=='admin'">
                        <a @click="stateC=!stateC"><b-icon :icon="`chevron-${stateC?'up':'down'}`"/>&nbsp;{{$t('components.Navbar.mngContract.title')}}</a>
                        <ul v-if="stateC">
                            <li><nuxt-link :to="localePath({name:'managecontracts'})" exact-active-class="is-active has-background-black"><b-icon icon="file-multiple"/>&nbsp;{{$t('components.Navbar.mngContract.show')}}</nuxt-link></li>
                            <li><nuxt-link :to="localePath({name:'managecontracts-addinformation'})" exact-active-class="is-active has-background-black"><b-icon icon="file-plus"/>&nbsp;{{$t('components.Navbar.mngContract.create')}}</nuxt-link></li>
                            <li><nuxt-link :to="localePath({name:'managecontracts-edit'})" exact-active-class="is-active has-background-black"><b-icon icon="file-document-edit" />&nbsp;{{$t('components.Navbar.mngContract.edit')}}</nuxt-link></li>
                        </ul>
                    </li>

                    <li v-if="auth.capability=='admin'">
                        <a @click="stateA=!stateA"><b-icon :icon="`chevron-${stateA?'up':'down'}`"/>&nbsp;{{$t('components.Navbar.aditionalMng.title')}}</a>
                        <ul v-if="stateA">
                            <li><nuxt-link :to="localePath({name:'manageairlines'})" exact-active-class="is-active has-background-black"><b-icon icon="airplane"/>&nbsp;{{$t('components.Navbar.aditionalMng.airline.title')}}</nuxt-link></li>
                            <li><nuxt-link :to="localePath({name:'manageairports'})" exact-active-class="is-active has-background-black"><b-icon icon="airport"/>&nbsp;{{$t('components.Navbar.aditionalMng.airports.title')}}</nuxt-link></li>
                        </ul>
                    </li>
                </ul>
                <p class="menu-label is-hidden-touch">{{$t('components.Navbar.support.title')}}</p>
                <ul class="menu-list">
                    <li>
                        <a @click="tutorial"><b-icon icon="account-question"/>&nbsp;Tutorial</a>
                    </li>
                    <li>
                        <nuxt-link :to="localePath({name:'support-faq'})" exact-active-class="is-active has-background-black"><b-icon icon="frequently-asked-questions"/>&nbsp;{{$t('components.Navbar.support.faq')}}</nuxt-link>
                    </li>
                    <li>
                        <nuxt-link :to="localePath({name:'support'})" exact-active-class="is-active has-background-black"><b-icon icon="help-circle"/>&nbsp;{{$t('components.Navbar.support.support')}}</nuxt-link>
                    </li>
                </ul>
            </aside>
            <div class="container column is-10">
                <nuxt/>
            </div>
        </section>

        <template v-if="auth==null">
            <nuxt/>
        </template>
    </div>
</template>

<script>
import { mapState,mapGetters,mapActions } from 'vuex';
import Loginform from '~/components/Loginform';

export default {
    data(){
        return {
            isComponentModalActive: false,
            isOpen:false,
            stateA:false,
            stateC:false
        }
    },
    computed:{
        ...mapState({
            auth: state => state.auth.authUser,
        }),
        ...mapGetters({
            getNameFC:'auth/userNameFC'
        }),
        signText(){
            return this.auth?this.$t('components.Navbar.logout'):this.$t('components.Navbar.login')
        },
    },
    methods:{
        async sign(){
            if(!this.auth){
                this.isComponentModalActive= true;
            } else {
                if(this.$router.currentRoute.path!='/'){
                    await this.$router.push(this.localePath({name:'index'}));
                }
                this.logout();
            }
        },
        tutorial(){
            this.$swal({
                toast:true,
                position:'top',
                showConfirmButton: false,
                timer: 2500,
                title: 'Tutorial soon',
                type: 'info'
            });
        },
        ...mapActions({
            logout: 'auth/logout'
        })
    },
    components: {
        'login-form':Loginform
    }
}
</script>
