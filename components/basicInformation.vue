<template>
    <section class="section">
        <form @submit.prevent="validateBeforeSubmit">
            <div class="columns is-centered narrow">
                <div class="col-2 offset-2 has-text-centered">
                    <figure class="ml-4 image is-128x128">
                        <img class="h-100" :src="logo">
                    </figure>
                    <p v-if="this.dropFile!=null" class="help text-info">{{$t('pages.mngContract.create.steps.0.preview')}}</p>
                    <b-upload 
                        v-model="dropFile"
                        v-if="!dropFile"
                        class="mt-2"
                        :multiple="false"
                        drag-drop
                    >
                        <div class="has-text-centered">
                            <p class="help"><b-icon icon="upload"/><br>{{$t('pages.mngContract.create.steps.0.logo')}}</p>
                        </div>
                    </b-upload>
                    <b-tag v-if="dropFile!=null"
                        closable
                        @close="deleteDropFile">
                        {{`${this.dropFile.name.length>14?this.dropFile.name.slice(0,10):this.dropFile.name}${this.dropFile.name.length>14?`...${this.dropFile.name.slice(-3)}`:''}`}}
                    </b-tag>
                </div>
                <div class="col-8">
                    <div class="row">
                        <div class="col-7 offset-1">
                            <b-field :type="errors.has('owner')?'is-danger':''"  label-position="on-border" :label="$t('pages.mngContract.create.steps.0.owner')">
                                <b-input autocomplete="off" custom-class="text-uppercase" name="owner" v-validate="'required'" v-model="owner"/>
                            </b-field>
                            <span v-if="errors.has('owner')" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                        </div>
                    </div>
                    <div class="row pt-4">
                        <div class="col-4 offset-1">
                            <b-field :type="(errors.has('code')||duplicated)?'is-danger':''" label-position="on-border" :label="$t('pages.mngContract.create.steps.0.code')">
                                <b-input autocomplete="off" name="code" v-validate="'required'" v-model="code"/>
                            </b-field>
                            <span v-if="errors.has('code')" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                            <span v-if="duplicated" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.duplicated')}}</span>
                        </div>
                        <div class="col-3">
                            <b-field :type="errors.has('iata')?'is-danger':''" label-position="on-border" :label="$t('pages.mngContract.create.steps.0.iata')">
                                <b-select name="iata" v-validate="'required'" expanded v-model="iata" :placeholder="$t('pages.mngContract.create.steps.0.iataPh')">
                                    <option value="USA">USA</option>
                                    <option value="PERU">PERU</option>
                                </b-select>
                            </b-field>
                            <span v-if="errors.has('iata')" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                        </div>
                    </div>
                    <div class="row pt-4">
                        <div class="col-2 offset-1">
                            <b-field :type="(verificated && selectedVisibility.length==0)?'is-danger':''" label-position="on-border" :label="$t('pages.mngContract.create.steps.0.visibility')">
                                <b-autocomplete
                                    v-model="inputVisibility"
                                    :data="filteredVisibility"
                                    class="inputFields"
                                    :open-on-focus="true"
                                    placeholder="Staff"
                                    :keep-first="true"
                                    @blur="inputVisibility=null"
                                    :clear-on-select="true"
                                    @select="selectVisibility"
                                >
                                    <template slot="empty">{{$t('pages.mngContract.create.steps.0.empty',{input:inputVisibility})}}</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                        <div class="col-auto ml-2">
                            <div class="row pt-1">
                                <div :key="index" v-for="(kind,index) in selectedVisibility">
                                    <b-tag closable @close="popVisibility(index)"> {{kind.toUpperCase()}} </b-tag>&nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <span v-if="(verificated && selectedVisibility.length==0)" class="col-auto offset-1 help is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                    </div>
                    <no-ssr>
                    <div class="row pt-4">
                        <div class="col-4 offset-1">
                            <b-field label-position="on-border" :label="$t('pages.mngContract.create.steps.0.dates')">
                                <date-picker name="dates" v-validate="'required'" :input-class="errors.has('dates')?'input is-danger':'input'" @clear="diffDays=null" width="100%" :shortcuts="false" :not-before="new Date()" v-model="diffDays" range :lang="locale" :format="locale=='es'?'DD-MM-YYYY':'MM-DD-YYYY'" confirm/>
                            </b-field>
                        </div>
                        <div class="col-4">
                            <p v-if="diffDays" class="help pt-1 ml-n4">{{$t('pages.mngContract.create.steps.0.datesValid',{days:moment(diffDays[1]).diff(moment(diffDays[0]),'days'),s:moment(diffDays[1]).diff(moment(diffDays[0]),'days')==1?'':'s'})}}</p>
                        </div>
                    </div>
                    </no-ssr>
                    <div class="row">
                        <span v-if="errors.has('dates')" class="help col-auto offset-1 is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                    </div>
                    <div class="row pt-4">
                        <div class="col-auto offset-1">
                            <b-field class="file">
                                <b-upload v-model="contractFile">
                                    <a class="button is-light has-text-black"><b-icon icon="upload"/><span>{{$t('pages.mngContract.create.steps.0.upload')}}</span></a>
                                </b-upload>
                            </b-field>
                        </div>
                        <a v-if="contractFile" class="button is-text is-paddingless" @click="previewContract" > 
                            {{`${this.contractFile.name.length>14?this.contractFile.name.slice(0,10):this.dropFile.name}${this.contractFile.name.length>14?`...${this.contractFile.name.slice(-3)}`:''}`}}
                        </a>
                        <a v-if="contractFile" class="ml-1 mt-1" @click="contractFile=null">
                            <b-icon icon="close-circle" />
                        </a>
                    </div>
                    <div class="row">
                        <span v-if="(verificated && !contractFile)" class="help col-auto offset-1 mt-n2 is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                    </div>
                </div>
            </div>
            <div class="columns is-narrow">
                <div class="column is-1 offset-4">
                    <button type="submit" class="button is-dark">{{$t('pages.mngContract.create.steps.0.submit')}}</button>
                </div>
            </div>
        </form>
    </section>
</template>

<script>
import {mapActions,mapState,mapGetters} from 'vuex';

export default {
    props: ['contract'],
    data(){
        return {
            owner: null,
            iata: null,
            code: null,
            locale: null,
            diffDays: null,
            inputVisibility: null,
            arrayVisibility: ['peru','ota','basic','premium','staff'],
            logoDefault: '/public/contracts/logos/default.png',
            logo: '/public/contracts/logos/default.png',
            selectedVisibility: [],
            dropFile: null,
            contractFile: null,
            verificated: false,
            duplicated: false,
            done: false
        }
    },
    beforeMount(){
        this.locale=this._i18n._vm.locale;
        this.contractToAdd.owner?this.owner=this.contractToAdd.owner:'';
        this.contractToAdd.code?this.code=this.contractToAdd.code:'';
        this.contractToAdd.iata?this.iata=this.contractToAdd.iata:'';
        this.contractToAdd.visibility?this.selectedVisibility=this.contractToAdd.visibility.slice():'';
        this.contractToAdd.dates?this.diffDays=this.contractToAdd.dates:'';
        this.contractToAdd.contractFile?this.contractFile=this.contractToAdd.contractFile:'';
        this.contractToAdd.logo?this.logo=this.contractToAdd.logo:'';
        this.done=true;
    },
    computed: {
        filteredVisibility(){
            return this.arrayVisibility.filter(option=>this.selectedVisibility.indexOf(option)==-1).filter(option=>{
                return this.inputVisibility?(option.indexOf(this.inputVisibility.toLowerCase()) > -1):true
            })
        },
        ...mapState({
            contractToAdd: state=>state.managec.contractToAdd
        }),
        ...mapGetters({
            codeContracts: 'managec/getCodes'
        })
    },
    methods: {
        selectVisibility(val){
            if(val){
                this.selectedVisibility.push(val);
            }
        },
        popVisibility(val){
            this.selectedVisibility.splice(val,1);
        },
        deleteDropFile(val){
            this.logo=this.logoDefault;
            this.dropFile=null;
        },
        previewContract(){
            let blob = new Blob([this.contractFile], {type: 'application/pdf'});
            const url = window.URL.createObjectURL(blob);
            let intLeft = (screen.width) ? ((screen.width - screen.width*0.8) / 2) : 0;
            let intTop = (screen.height) ? ((screen.height - screen.height*0.8) / 2) : 0;
            var windowToOpen = window.open('', '_blank', `width=${screen.width*0.8},height=${screen.height*0.8},top=${intTop},left=${intLeft}`);
            let html = `
                <html>
                <head>
                    <title>CONTRACT PREVIEW</title>
                </head>
                <body style="margin:0;padding:0">
                    <embed src=${url} type='application/pdf' width='100%' height='100%' />
                </body>
                </html>
            `
            windowToOpen.document.write(html)
            windowToOpen.name="test"
        },
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
                if(this.selectedVisibility.length==0 || !this.contractFile){
                    this.verificated=true;
                }
                return;
            }
            if(this.selectedVisibility.length==0 || !this.contractFile){
                this.verificated=true;
                return;
            }
            if(this.codeContracts.indexOf(this.code)!=-1){
                this.duplicated=true;
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: this.$t('pages.mngContract.create.errors.checkField')
                });
                return;
            } else {
                this.duplicated=false;
            }
            let dataToSend = {
                owner: this.owner,
                code: this.code,
                iata: this.iata,
                visibility: this.selectedVisibility,
                dates: this.diffDays,
                contractFile: this.contractFile,
                logo: this.dropFile
            }
            this.setFieldsCTA(dataToSend);
            this.completeStep({index:0,val:true})
            this.$swal({
                toast:true,
                position: 'top',
                showConfirmButton: false,
                timer: 2500,
                type: 'success',
                title: this.$t('pages.mngContract.create.confirm.success')
            })
        },
        ...mapActions({
            setFieldsCTA: 'managec/setFieldsCTA',
            completeStep: 'managec/setCompletedStepsToAdd'
        })
    },
    watch:{
        dropFile: function(val){
            if(val){
                if (val.type != "image/jpeg" && val.type != "image/png") {
                    this.$swal({
                        type: "error",
                        title: this.$t("pages.mngUser.edit.user.errorFile"),
                        text: this.$t("pages.mngUser.edit.user.errorImage")
                    });
                    this.dropFile = null;
                } else {
                    this.logo = window.URL.createObjectURL(this.dropFile);
                }
            }
        },
        contractFile: function(val){
            if(val){
                if (val.type != "application/pdf") {
                    this.$swal({
                        type: "error",
                        title: this.$t("pages.mngUser.edit.user.errorFile"),
                        text: this.$t("pages.mngUser.edit.user.errorImage")
                    });
                    this.contractFile = null;
                }
            }
        }
    }
}
</script>

<style>
table td:not([align]), table th:not([align]){
    text-align: center;
}
.inputFields .dropdown-menu {
  border: none;
}
.inputFields .dropdown-content {
  position: absolute;
}
</style>
