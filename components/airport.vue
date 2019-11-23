<template>
    <section class="section">
        <form @submit="preventBeforeSubmit">
            <div class="card content" style="width:auto;">
                <div class="card-body">
                    <h4 class="card-title has-text-centered">ADD NEW AIRPORT</h4>
                    <div class="row container pt-4">
                        <div class="col">
                            <b-field label-position="on-border" label="Name">
                                <b-input v-model="name" />
                            </b-field>
                        </div>
                    </div>
                    <div class="row container pt-4">
                        <div class="col-6">
                            <b-field label-position="on-border" label="IATA Code">
                                <b-input v-model="iata" />
                            </b-field>
                        </div>
                        <div class="col-6">
                            <b-field label-position="on-border" label="Country">
                                <b-autocomplete
                                    v-model="country.name"
                                    placeholder="PERU"
                                    :keep-first="true"
                                    class="inputFields"
                                    :open-on-focus="true"
                                    :data="filteredCountry"
                                    field="name"
                                    @select="selectCountry"
                                >
                                    <template slot-scope="props">
                                        <div class="media">
                                            <div class="media-content">
                                                <p>{{props.option.emoji}} {{props.option.name}} </p>
                                            </div>
                                        </div>
                                    </template>
                                    <template slot="empty">No results for {{country.name}}</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                    </div>
                    <div v-if="country.iata" class="row container pt-4">
                        <div class="col-6">
                            <b-field label-position="on-border" label="City name">
                                <b-input class="is-loading" />
                            </b-field>
                        </div>
                        <div class="col-6">
                            <b-field label-position="on-border" label="City iata code">
                                <b-input class="is-loading" />
                            </b-field>
                        </div>
                    </div>
                    <div class="columns is-centered container pt-4">
                        <button type="submit" class="button is-dark">Add</button>
                    </div>
                </div>
                <!-- <span :key="index" v-for="(state,index) in location.getCountryByShort('PE').states">
                    {{state}}
                </span> -->
                <!-- {{airports}} -->
                {{country}}
                <!-- {{location.getStatesByShort('PE')}} -->
                <!-- {{location.getCities('PE','Lima y Callao')}} -->
                <!-- {{cities.filter(city=>city.country=="PE")}} -->
            </div>
            
        </form>
    </section>
</template>

<script>
import locationData from 'countrycitystatejson';

export default {
    
    data(){
        return {
            name: null,
            iata: null,
            country: { name: null, iata: null},
            city: { name: null, iata: null },
            location: locationData,
        }
    },
    computed:{
        filteredCountry(){
            return this.location.getCountries().filter(country=>this.country.name?country.name.toLowerCase().indexOf(this.country.name.toLowerCase())>-1:true);
        },
        filteredCity(){
            return this.location.getCountries().filter(country=>country.name==this.country.name)[0]
        },
        filteredAirport(){
            return this.airports.filter(airport=>{
                return this.airport?(
                    airport.name.toLowerCase().indexOf(this.airport.toLowerCase())>-1 || 
                    airport.city.toLowerCase().indexOf(this.airport.toLowerCase())>-1 ||
                    airport.iata.toLowerCase().indexOf(this.airport.toLowerCase())>-1 ||
                    airport.country.toLowerCase().indexOf(this.airport.toLowerCase())>-1 
                ):true
            })
        }
    },
    methods:{
        preventBeforeSubmit(){
            alert('ok')
        },
        async selectCountry(val){
            if(val){
                this.country.iata = val.shortName;
            } else {
                this.country.iata = val;
            }
        }
    }
}
</script>

