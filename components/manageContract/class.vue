<template>
    <div class="modal-card" style="width:auto;">
        <section class="content modal-card-body inputAirport">
            <div class="row justify-content-center">
                <h2>Edit Class</h2>
            </div>

            <div class="row pt-3 text-uppercase">
                <b-taginput
                    v-model="tags"
                    ellipsis
                    :before-adding="beforeAdding"
                    icon="label"
                    custom-class="text-uppercase"
                    maxlength="1"
                    placeholder="Add a class">
                </b-taginput>
            </div>
            <p class="help pt-3">Current values: {{value.length==0?'-':value.toString()}}</p>
            <strong><p class="help mt-n2">New Values: {{tags.toString().toUpperCase()}}</p></strong>
        
            <div class="row text-white justify-content-center">
                <a @click="saveClass" class="mr-2 button is-info">Save</a>
                <a @click="$parent.close()" class="ml-2 button has-background-grey">Cancel</a>
            </div>
        </section>
    </div>
</template>

<script>

export default {
    props:['value','notPick'],
    beforeMount(){
        this.tags=this.value.slice();
    },
    data(){
        return {
            tags: [],
        }
    },
    methods:{
        beforeAdding(tag){
            if(this.tags.indexOf(tag.toUpperCase())==-1 && this.notPick.indexOf(tag.toUpperCase())==-1){
                this.tags.push(tag.toUpperCase())
            } else {
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: 'This class already exists.'
                })
            }
        },
        saveClass(){
            this.$emit('editClassF',{data:this.tags});
            this.$parent.close()
        }
    }
}
</script>


