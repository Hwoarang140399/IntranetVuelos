<template>
    <section class="section">
        <p>ver c</p>
    </section>
</template>
<script>
export default {
    layout: 'navbar-normal',
    middleware: 'admin',
    nuxtI18n: {
        paths: {
            en: '/managecontracts/:contract',
            es: '/administracioncontractos/:contract'
        }
    },
}
</script>