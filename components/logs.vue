<template>
    <section class="section">
        <div class="modal-card" style="width:auto;">
            <header class="modal-card-head">
                <p class="modal-card-title has-text-centered">{{$t('pages.mngContract.show.logs.title')}}</p>
            </header>
            <section class="modal-card-body">
                <b-table
                    :data="editions"
                    bordered
                    striped 
                >
                    <template slot-scope="props">
                        <b-table-column field="subject" :label="$t('pages.mngContract.show.logs.table.subject')">
                            {{props.row.subject}}
                        </b-table-column>
                        <b-table-column class="text-uppercase" field="description" :label="$t('pages.mngContract.show.logs.table.description')">
                            {{props.row.description}}
                        </b-table-column>
                        <b-table-column class="text-uppercase" field="user" :label="$t('pages.mngContract.show.logs.table.user')">
                            {{props.row.user.name}} {{props.row.user.lastName}}
                        </b-table-column>    
                        <b-table-column field="date" :label="$t('pages.mngContract.show.logs.table.date')">
                            {{moment(props.row.date).locale(locale).format('L')}}
                        </b-table-column>
                        <b-table-column field="logs" :label="$t('pages.mngContract.show.logs.table.logs')">
                            <ul :key="index" v-for="(log,index) in props.row.logs">
                                <li>{{log}}</li>
                            </ul>
                        </b-table-column>
                    </template>
                </b-table>
            </section>
        </div>
    </section>
</template>

<script>
export default {
    props: ['editions','locale']
}
</script>

