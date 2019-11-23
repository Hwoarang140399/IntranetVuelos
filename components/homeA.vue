<template>
  <section class="section">
    <p>{{$t('pages.homeA.content')}}</p>
  </section>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  name: 'HomePage',
  data(){
    return{
        
    }
  },
  computed:{
    ...mapState({
      firstTime: state => state.auth.firstTime
    }),
    ...mapGetters({
      toastText:'auth/toastConfirmLogin'
    }),
    
  },
  methods:{
    ...mapActions({
      notFirstTime: 'auth/notFirstTime'
    })
  },
  mounted(){
    if(this.firstTime){
      this.$swal({
        toast:true,
        position:'top',
        showConfirmButton:false,
        timer:2500,
        type:'success',
        title:`${this.$t('components.loginForm.success')} - ${this.toastText.gender=='male'?`${this.$t('components.loginForm.successMale')} ${this.toastText.name.slice(0,1).toUpperCase()}${this.toastText.name.slice(1)}`:`${this.$t('components.loginForm.successFemale')} ${this.toastText.name.slice(0,1).toUpperCase()}${this.toastText.name.slice(1)}`}`
      })
      this.notFirstTime();
    }
  }
}
</script>
