<template>
    <section>
        <h1>manage routes</h1>
    </section>
</template>
<script>
export default {
    layout: 'navbar-normal',
    middleware: 'admin',
    nuxtI18n: {
        paths: {
            en: '/manageairports',
            es: '/administracionaeropuertos'
        }
    },
}
</script>
