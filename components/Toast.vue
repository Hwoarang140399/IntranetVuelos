<template>
    <div>
        <b-toast :id="id" :no-close-button="Boolean(close)" :toaster="toaster" :variant="variant" solid :auto-hide-delay="Number(delay)">
            <div slot="toast-title" class="d-flex flex-grow-1 align-items-center">
                <b-icon class="my-2 mr-2" :icon="icon"></b-icon>
                <strong class="mr-auto">{{title}}</strong>
                <small class="text-muted mr-2">{{subtitle}}</small>
            </div>
            {{content}}
        </b-toast>
    </div>
</template>

<script>
export default {
    props:['id','toaster','variant','icon','title','subtitle','content','delay','close']
}
</script>
