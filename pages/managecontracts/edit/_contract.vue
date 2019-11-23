<template>
    <section class="section">
        <p>test edit c</p>
        <p>{{contract}}</p>
    </section>
</template>
<script>
import Cookies from 'universal-cookie';
export default {
    layout: 'navbar-normal',
    middleware: 'admin',
    nuxtI18n: {
        paths: {
            en: '/managecontracts/edit/:contract',
            es: '/administracioncontractos/edit/:contract'
        }
    },
    async asyncData({req,params}){
        const cookies = process.server?new Cookies(req.headers.cookie):new Cookies();
        const result = await fetch(`${process.server?process.env.baseUrl:''}/api/contract/${params.contract}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get('token')}`
            }
        })
        const data = await result.json();
        return {contract: data}
    }
}
</script>