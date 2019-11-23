<template>
    <section class="section">
        <p>test add features</p>
    </section>
</template>
<script>
export default {
    layout: 'navbar-normal',
    middleware: 'admin',
    nuxtI18n: {
        paths: {
            en: '/managecontracts/addinformation',
            es: '/administracioncontractos/agregarinformacion'
        }
    },
}
</script>
