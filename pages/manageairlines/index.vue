<template>
    <section>
        <h1>manage airlines</h1>
    </section>
</template>

<script>
export default {
    layout: 'navbar-normal',
    middleware: 'admin',
    nuxtI18n: {
        paths: {
            en: '/manageairlines',
            es: '/administracionaerolineas'
        }
    },
}
</script>

