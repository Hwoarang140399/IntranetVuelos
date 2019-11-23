<template>
    <section>
        edit contract
    </section>
</template>

<script>
export default {
    layout: 'navbar-normal',
    middleware: 'admin',
    nuxtI18n: {
        paths: {
            en: '/managecontracts/edit',
            es: '/administracioncontractos/editar'
        }
    },
}
</script>
