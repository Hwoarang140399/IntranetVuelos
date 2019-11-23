<template>
    <section class="section">
        <b-steps
            v-model="activeStep"
            animated
            :has-navigation="false"
            type="is-danger"
        >
            <b-step-item :label="$t('pages.mngContract.create.steps.0.label')" icon="file-document">
                <basic-information v-if="activeStep==0"/>
            </b-step-item>
            <!-- <b-step-item :label="$t('pages.mngContract.create.steps.1.label')" icon="map-legend">
                <region v-if="activeStep==1"/>
            </b-step-item> -->
            <b-step-item :label="$t('pages.mngContract.create.steps.1.label')" icon="shield-airplane">
                <zone v-if="activeStep==1"/>
            </b-step-item>
            <b-step-item :label="$t('pages.mngContract.create.steps.2.label')" icon="file-check">
                <confirm-steps v-if="activeStep==2"/>
            </b-step-item>

            <nav class="level">
                <div class="level-left">
                    <div v-if="activeStep!=0" class="level-item">
                        <a @click="backStep" class="button is-text"> <b-icon icon="chevron-left"/> &nbsp; {{$t('pages.mngContract.create.navigation.left')}}</a>
                    </div>
                </div>
                <div class="level-right">
                    <div v-if="activeStep!=2" class="level-item">
                        <a @click="nextStep" class="button is-text">{{$t('pages.mngContract.create.navigation.right')}} &nbsp; <b-icon icon="chevron-right"/> </a>
                    </div>
                </div>
            </nav>
        </b-steps>
    </section>
</template>

<script>
import confirmSteps from '~/components/confirmContract.vue';
import basicInformation from '~/components/basicInformation.vue';
import region from '~/components/region.vue';
import zone from '~/components/zones.vue';
import {mapState,mapActions} from 'vuex';
import { Promise } from 'q';

export default {
    layout: 'navbar-normal',
    middleware: 'admin',
    nuxtI18n: {
        paths: {
            en: '/managecontracts/create',
            es: '/administracioncontractos/crear'
        }
    },
    components:{
        'confirm-steps': confirmSteps,
        'basic-information': basicInformation,
        'region': region,
        'zone': zone
    },
    computed:{
        ...mapState({
            stepCompleted: state=> state.managec.stepsCompletedToAdd,
            activeStep: state=>state.managec.activeStep,
            contractToAdd: state=>state.managec.contractToAdd
        })
    },
    methods:{
        backStep(){
            this.undoStep({index:this.activeStep-1,val:false})
            this.setActiveStep(this.activeStep-1);
        },
        nextStep(){
            if(!this.stepCompleted[this.activeStep]){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'warning',
                    title: this.$t('pages.mngContract.create.errors.save')
                })
            } else {
                this.setActiveStep(this.activeStep+1);
            }
        },
        ...mapActions({
            undoStep : 'managec/setCompletedStepsToAdd',
            setActiveStep: 'managec/setActiveStep'
        })
    }
}
</script>
