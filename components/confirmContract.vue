<template>
    <section class="section">
        <form @submit.prevent="validateBeforeSubmit">
            <div class="columns is-centered content">
                <div class="col-auto">
                    <h2>{{$t('pages.mngContract.create.steps.2.title')}}</h2>
                </div>
            </div>
            <div class="columns is-centered mt-n4">
                <div class="col-auto">
                    <p class="help">{{$t('pages.mngContract.create.steps.2.help')}}</p>
                </div>
            </div>
            <div class="columns is-centered pt-5">
                <div class="col-6">
                    <b-field :type="{'is-danger':errors.has('subject')}" :label="$t('pages.mngContract.create.steps.2.subject')" label-position="on-border">
                        <b-input name="subject" v-validate="'required'" v-model="subject"/>
                    </b-field>
                    <span v-if="errors.has('subject')" class="mt-n2 help is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                </div>
            </div>
            <div class="columns is-centered pt-5">
                <div class="col-6">
                    <b-field :type="{'is-danger':errors.has('description')}" :label="$t('pages.mngContract.create.steps.2.description')" label-position="on-border">
                        <b-input name="description" v-validate="'required'" v-model="description"/>
                    </b-field>
                    <span v-if="errors.has('description')" class="mt-n2 help is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                </div>
            </div>
            <div class="columns is-centered">
                <button type="submit" class="mt-4 btn btn-info">{{$t('pages.mngContract.create.steps.2.submit')}}</button>
            </div>
        </form>
    </section>
</template>

<script>
import {mapActions,mapState} from 'vuex';

export default {
    data(){
        return {
            subject: null,
            description: null
        }
    },
    computed:{
        ...mapState({
            userID: state => state.auth.authUser._id,
            contractToAdd: state => state.managec.contractToAdd
        })
    },
    methods:{
        async validateBeforeSubmit(){
            const result = await this.$validator.validateAll()
            if(!result){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: this.$t('pages.mngContract.create.errors.checkField')
                })
                return;
            }
            let editions = { user: this.userID, date: new Date(),subject: this.subject,description:this.description,logs:[{title:'Creation',newValue:'',oldValue:''}]}
            let response = await this.sendCTA(editions);
            this.fillContracts();
            this.$swal({
                type: 'success',
                title: 'Sucessfully',
                text: `The contract was created successfully.`,
                customClass: {
                    confirmButton: 'btn btn-success ml-2',
                },
                buttonsStyling: false,
                confirmButtonText: 'Ok.',
                allowOutsideClick: false
            }).then((result)=>{
                this.$router.push(this.localePath({name:'managecontracts'}));
            });
        },
        ...mapActions({
            sendCTA: 'managec/sendCTA',
            fillContracts: 'managec/fillContracts'
        })
    },
    props: ['case'],

}
</script>
