<template>
    <div class="modal-card" style="width:auto;">
        <section class="content modal-card-body">
            <div class="row">
                <div class="col offset-1 content text-center">
                    <u><h2>Select Region</h2></u>
                </div>
            </div>
            <div class="row">
                <div class="col text-center">
                    <a @click="create=false" class="button is-text"><b-icon icon="check" size="is-small" v-if="!create"/>&nbsp;Seleccionar existente</a>
                </div>
                <div class="col text-center">
                    <a @click="createRegion" class="button is-text"><b-icon icon="check" size="is-small" v-if="create && !edit"/>&nbsp;Crear región</a>
                </div>
                <div v-if="contractToAdd.regions" class="col text-center">
                    <a @click="editRegion" class="button is-text"><b-icon icon="check" size="is-small" v-if="create && edit"/>&nbsp;Editar región</a>
                </div>
            </div>

            <!-- <div v-if="create && edit" class="row py-4 justify-content-center container">
                <div class="box w-100">
                    <div class="row">
                        <p>test</p>
                    </div>
                </div>
            </div> -->

            <div v-if="create && !edit" class="row py-4 justify-content-center container">
                <div class="box w-100">
                    <div class="row block">
                        <div style="white-space: nowrap;" class="col pl-4">
                            <b-radio type="is-info" name="radioN" native-value="airport" v-model="region.typeRegion">
                                {{$t('pages.mngContract.create.steps.1.editRegion.region')}}
                            </b-radio>
                        </div>
                        <div style="white-space: nowrap;" class="col">
                            <b-radio type="is-info" name="radioN" native-value="country" v-model="region.typeRegion">
                                {{$t('pages.mngContract.create.steps.1.editRegion.country')}}
                            </b-radio>
                        </div>
                        <div style="white-space: nowrap;" class="col">
                            <b-radio type="is-info" name="radioN" native-value="continent" v-model="region.typeRegion">
                                {{$t('pages.mngContract.create.steps.1.editRegion.continent')}}
                            </b-radio>
                        </div>
                        <div style="white-space: nowrap;" class="col">
                            <b-radio type="is-info" name="radioN" native-value="group" v-model="region.typeRegion">
                                {{$t('pages.mngContract.create.steps.1.editRegion.group')}}
                            </b-radio>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-7 pl-4">
                            <b-field :type="(errors.has('name') || duplicatedRegions)?'is-danger':''" label-position="on-border" :label="$t('pages.mngContract.create.steps.1.editRegion.name')">
                                <b-input @input="val=>{region.nameEdited=true;}" autocomplete="off" name="name" custom-class="text-uppercase" v-validate="'required'" v-model="region.name"/>
                            </b-field>
                            <span v-if="duplicatedRegions" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.steps.1.editRegion.duplicated')}}</span>
                            <span v-if="errors.has('name')" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.emptyField')}}</span>
                        </div>
                    </div>
                    <template v-if="region.typeRegion=='airport'">
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field :type="region.airport.error?'is-danger':''" label-position="on-border" label="Airports">
                                    <b-autocomplete
                                        v-model="region.airport.input"
                                        :data="dataAirport"
                                        :placeholder="$t('pages.mngContract.create.steps.1.editRegion.airportPH')"
                                        field="airportIC"
                                        :keep-first="true"
                                        :loading="isFetchingAirport"
                                        @typing="text=>getAirport(text)"
                                        @blur="region.airport.input=null"
                                        :clear-on-select="true"
                                        @select="option=>selectAirport(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <strong>{{props.option.airportIC}}</strong>  <small>{{props.option.airportName}}</small>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">{{$t('pages.mngContract.create.steps.1.editRegion.noResult',{input:region.airport.input})}}</template>
                                    </b-autocomplete>
                                </b-field>
                                <span v-if="region.airport.error" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.country')}}</span>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.airport.selected">
                                        <b-tag v-if="index1<3 || !region.airport.hide" closable @close="deleteAirports(index1)" >
                                            {{selected.iata}}
                                        </b-tag>
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.airport.selected.length>3">
                                            <p @click="showRestAirports" class="button is-small is-text">{{region.airport.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="region.typeRegion=='country'" > 
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field :type="region.country.data.error?'is-danger':''" label-position="on-border" label="Country Name">
                                    <b-autocomplete
                                        v-model="region.country.data.input"
                                        :data="arrayCountryFiltered"
                                        placeholder="Peru"
                                        class="inputFields"
                                        field="name"
                                        :keep-first="true"
                                        @select="option=>selectCountry(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <p>{{props.option.emoji}} {{props.option.name}} </p>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">No results for {{region.country.data.input}}</template>
                                    </b-autocomplete>
                                </b-field>
                                <span v-if="region.country.data.error" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.country')}}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field label-position="on-border" label="Airports">
                                    <b-autocomplete
                                        v-model="region.country.airportsIncluded.input"
                                        :data="dataAirport"
                                        :placeholder="$t('pages.mngContract.create.steps.1.editRegion.airportPH')"
                                        field="airportIC"
                                        :keep-first="true"
                                        :loading="isFetchingAirport"
                                        @typing="text=>getAirport(text)"
                                        @blur="region.country.airportsIncluded.input=null"
                                        :clear-on-select="true"
                                        @select="option=>selectAirport(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <strong>{{props.option.airportIC}}</strong>  <small>{{props.option.airportName}}</small>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">{{$t('pages.mngContract.create.steps.1.editRegion.noResult',{input:region.country.airportsIncluded.input})}}</template>
                                    </b-autocomplete>
                                </b-field>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.country.airportsIncluded.selected">
                                        <b-tag v-if="index1<3 || !region.country.airportsIncluded.hide" closable @close="deleteAirports(index1)" >
                                            {{selected.iata}}
                                        </b-tag>
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.country.airportsIncluded.selected.length>3">
                                            <p @click="showRestAirports" class="button is-small is-text">{{region.country.airportsIncluded.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field label-position="on-border" label="Airports Excluded">
                                    <b-autocomplete
                                        v-model="region.country.airportsExcluded.input"
                                        :data="dataAirport"
                                        :placeholder="$t('pages.mngContract.create.steps.1.editRegion.airportPH')"
                                        field="airportIC"
                                        :keep-first="true"
                                        :loading="isFetchingExcludedAirport"
                                        @typing="text=>getAirportExcluded(text)"
                                        @blur="region.country.airportsExcluded.input=null"
                                        :clear-on-select="true"
                                        @select="option=>selectAirportExcluded(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <strong>{{props.option.airportIC}}</strong>  <small>{{props.option.airportName}}</small>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">{{$t('pages.mngContract.create.steps.1.editRegion.noResult',{input:region.country.airportsExcluded.input})}}</template>
                                    </b-autocomplete>
                                </b-field>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.country.airportsExcluded.selected">
                                        <b-tag v-if="index1<3 || !region.country.airportsExcluded.hide" closable @close="deleteAirportsExcluded(index1)" >
                                            {{selected.iata}}
                                        </b-tag>
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.country.airportsExcluded.selected.length>3">
                                            <p @click="showRestAirportsExcluded" class="button is-small is-text">{{region.country.airportsExcluded.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="region.typeRegion=='continent'" > 
                        <div class="row">
                            <div class="col-7 pt-3 pl-4">
                                <b-field :type="region.continent.error?'is-danger':''" label-position="on-border" label="Continent Name">
                                    <b-select @input="e=>{region.continent.subregion='All';region.nameEdited?'':region.name=e}" expanded v-model="region.continent.name" placeholder="Select a continent">
                                        <option :value="continent.region" :key="index" v-for="(continent,index) in continents">
                                            {{continent.region}}
                                        </option>
                                    </b-select>
                                </b-field>
                                <span v-if="region.continent.error" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.continent')}}</span>
                            </div>
                            <div v-if="region.continent.name" class="col-5 pt-3 px-0">
                                <b-field label-position="on-border" label="Sub-Region Name">
                                    <b-select @input="e=>{if(e!='All' && !region.nameEdited){region.name=e}else if(!region.nameEdited){region.name=region.continent.name}}" expanded v-model="region.continent.subregion" placeholder="Select a region">
                                        <option value="All" selected>All</option>
                                        <option :value="continent" :key="index" v-for="(continent,index) in continents.filter(e=>e.region==region.continent.name)[0].subregions">
                                            {{continent}}
                                        </option>
                                    </b-select>
                                </b-field>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field label-position="on-border" label="Countries">
                                    <b-autocomplete
                                        v-model="region.continent.countriesIncluded.input"
                                        :data="arrayCountryFilteredC"
                                        placeholder="Peru"
                                        class="inputFields"
                                        field="name"
                                        :keep-first="true"
                                        :clear-on-select="true"
                                        @select="option=>selectCountryC(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <p>{{props.option.emoji}} {{props.option.name}} </p>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">No results for {{region.continent.countriesIncluded.input}}</template>
                                    </b-autocomplete>
                                </b-field>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.continent.countriesIncluded.selected">
                                        <b-tag v-if="index1<3 || !region.continent.countriesIncluded.hide" closable @close="deleteCountry(index1)" >
                                            {{selected.name}}
                                        </b-tag>
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.continent.countriesIncluded.selected.length>3">
                                            <p @click="showRestCountries" class="button is-small is-text">{{region.continent.countriesIncluded.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field label-position="on-border" label="Countries Excluded">
                                    <b-autocomplete
                                        v-model="region.continent.countriesExcluded.input"
                                        :data="arrayCountryFilteredCE"
                                        placeholder="Peru"
                                        class="inputFields"
                                        field="name"
                                        :keep-first="true"
                                        :clear-on-select="true"
                                        @select="option=>selectCountryExcluded(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <p>{{props.option.emoji}} {{props.option.name}} </p>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">No results for {{region.continent.countriesExcluded.input}}</template>
                                    </b-autocomplete>
                                </b-field>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.continent.countriesExcluded.selected">
                                        <b-tag v-if="index1<3 || !region.continent.countriesExcluded.hide" closable @close="deleteCountryExcluded(index1)" >
                                            {{selected.name}}
                                        </b-tag>
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.continent.countriesExcluded.selected.length>3">
                                            <p @click="showRestCountriesExcluded" class="button is-small is-text">{{region.continent.countriesExcluded.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field label-position="on-border" label="Airports Excluded">
                                    <b-autocomplete
                                        v-model="region.continent.airportsExcluded.input"
                                        :data="dataAirport"
                                        :placeholder="$t('pages.mngContract.create.steps.1.editRegion.airportPH')"
                                        field="airportIC"
                                        :keep-first="true"
                                        :loading="isFetchingExcludedAirport"
                                        @typing="text=>getAirportExcluded(text)"
                                        @blur="region.continent.airportsExcluded.input=null"
                                        :clear-on-select="true"
                                        @select="option=>selectAirportExcludedC(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <strong>{{props.option.airportIC}}</strong>  <small>{{props.option.airportName}}</small>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">{{$t('pages.mngContract.create.steps.1.editRegion.noResult',{input:region.continent.airportsExcluded.input})}}</template>
                                    </b-autocomplete>
                                </b-field>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.continent.airportsExcluded.selected">
                                        <b-tag v-if="index1<3 || !region.continent.airportsExcluded.hide" closable @close="deleteAirportsExcludedC(index1)" >
                                            {{selected.iata}}
                                        </b-tag>
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.continent.airportsExcluded.selected.length>3">
                                            <p @click="showRestAirportsExcludedC" class="button is-small is-text">{{region.continent.airportsExcluded.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="region.typeRegion=='group'" > 
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field :type="region.group.continents.error?'is-danger':''" label-position="on-border" label="Continents">
                                    <b-select @input="e=>selectGroup(e)" expanded placeholder="Select a continent" v-model="region.group.continents.value">
                                        <optgroup :label="continent.region" :key="index" v-for="(continent,index) in region.group.continents.filtered">
                                            <option :value="`${continent.region}%${0}`">{{continent.region}}</option>
                                            <option :value="`${continent.region}%${subcontinent}`" :key="index1" v-for="(subcontinent,index1) in continent.subregions">
                                                {{subcontinent}}
                                            </option>
                                        </optgroup>
                                    </b-select>
                                </b-field>
                                 <span v-if="region.group.continents.error" class="help mt-n3 pt-1 is-danger">{{$t('pages.mngContract.create.errors.group')}}</span>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <template v-for="(selected,index) in region.group.continents.selected">
                                        <div class="pr-1 pt-1" :key="`${index}${index1}`" v-for="(selectedR,index1) in selected.subregions">
                                            <b-tag v-if="index1<3 || !region.group.continents.hide" closable @close="deleteContinents(index,index1,selectedR)" >
                                                {{selectedR=='0'?selected.region:selectedR}}
                                            </b-tag>
                                        </div>
                                    </template>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.group.continents.selected.length>3">
                                            <p @click="showRestContinents" class="button is-small is-text">{{region.group.continents.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field label-position="on-border" label="Countries">
                                    <b-autocomplete
                                        v-model="region.group.countriesIncluded.input"
                                        :data="arrayCountryFilteredG"
                                        placeholder="Peru"
                                        class="inputFields"
                                        field="name"
                                        :keep-first="true"
                                        :clear-on-select="true"
                                        @select="option=>selectCountryG(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <p>{{props.option.emoji}} {{props.option.name}} </p>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">No results for {{region.group.countriesIncluded.input}}</template>
                                    </b-autocomplete>
                                </b-field>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.group.countriesIncluded.selected">
                                        <b-tag v-if="index1<3 || !region.group.countriesIncluded.hide" closable @close="deleteCountryG(index1)" >
                                            {{selected.name}}
                                        </b-tag>
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.group.countriesIncluded.selected.length>3">
                                            <p @click="showRestCountriesG" class="button is-small is-text">{{region.group.countriesIncluded.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field label-position="on-border" label="Countries Excluded">
                                    <b-autocomplete
                                        v-model="region.group.countriesExcluded.input"
                                        :data="arrayCountryFilteredGE"
                                        placeholder="Peru"
                                        class="inputFields"
                                        field="name"
                                        :keep-first="true"
                                        :clear-on-select="true"
                                        @select="option=>selectCountryExcludedG(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <p>{{props.option.emoji}} {{props.option.name}} </p>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">No results for {{region.group.countriesExcluded.input}}</template>
                                    </b-autocomplete>
                                </b-field>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.group.countriesExcluded.selected">
                                        <b-tag v-if="index1<3 || !region.group.countriesExcluded.hide" closable @close="deleteCountryExcludedG(index1)" >
                                            {{selected.name}}
                                        </b-tag>
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.group.countriesExcluded.selected.length>3">
                                            <p @click="showRestCountriesExcludedG" class="button is-small is-text">{{region.group.countriesExcluded.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-7 pt-3 pl-4 dropdownCategory1">
                                <b-field label-position="on-border" label="Airports Excluded">
                                    <b-autocomplete
                                        v-model="region.group.airportsExcluded.input"
                                        :data="dataAirport"
                                        :placeholder="$t('pages.mngContract.create.steps.1.editRegion.airportPH')"
                                        field="airportIC"
                                        :keep-first="true"
                                        :loading="isFetchingExcludedAirport"
                                        @typing="text=>getAirportExcluded(text)"
                                        @blur="region.group.airportsExcluded.input=null"
                                        :clear-on-select="true"
                                        @select="option=>selectAirportExcludedG(option)"
                                    >
                                        <template slot-scope="props">
                                            <div class="media">
                                                <div class="media-content">
                                                    <strong>{{props.option.airportIC}}</strong>  <small>{{props.option.airportName}}</small>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="empty">{{$t('pages.mngContract.create.steps.1.editRegion.noResult',{input:region.group.airportsExcluded.input})}}</template>
                                    </b-autocomplete>
                                </b-field>
                            </div>
                            <div class="col-5 pt-3">
                                <div class="row">
                                    <div class="pr-1 pt-1" :key="index1" v-for="(selected,index1) in region.group.airportsExcluded.selected">
                                        <b-tag v-if="index1<3 || !region.group.airportsExcluded.hide" closable @close="deleteAirportsExcludedG(index1)" >
                                            {{selected.iata}}
                                        </b-tag>
                                    </div>
                                </div>
                                <div class="col-9">
                                    <div class="columns py-3 is-centered">
                                        <div class="col-auto offset-1" v-if="region.group.airportsExcluded.selected.length>3">
                                            <p @click="showRestAirportsExcludedG" class="button is-small is-text">{{region.group.airportsExcluded.hide?$t('pages.mngContract.create.steps.1.editRegion.showAll'):$t('pages.mngContract.create.steps.1.editRegion.showLess')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="row justify-content-center pt-3">
                        <a @click="createRegionToAdd" class="button is-text has-background-light">Create</a>
                    </div>
                </div>
            </div>
            <template v-if="!create">
                <div class="row py-4 justify-content-center ">
                    <p v-if="!contractToAdd.regions">No existen regiones creadas</p>
                    <b-field class="w-75 dropdownCategory1" v-if="contractToAdd.regions" label="Regions" label-position="on-border">
                        <b-select expanded v-model="regionName" placeholder="Select a name">
                            <option v-for="(option,index) in filteredRegions" :value="option.title" :key="index">
                                {{ option.title }}
                            </option>
                        </b-select>
                    </b-field>
                </div>
                <div class="row">
                    <div class="col">
                        <p class="help">Current Value: {{value?value:'-'}}</p>
                        <strong><p class="help mt-n2 mb-3">New Value: {{regionName?regionName:'-'}}</p></strong>
                    </div>
                </div>
            </template>
            
            <div class="row text-white justify-content-center">
                <a @click="saveRegion" class="mr-2 button is-info">Save</a>
                <a @click="$parent.close()" class="ml-2 button has-background-grey">Cancel</a>
            </div>
        </section>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import locationData from 'countrycitystatejson';
import airport from '~/components/airport.vue';
import debounce from 'lodash/debounce';

class regionClass {
  constructor(
        name = null,
        nameEdited = false,
        typeRegion = 'airport',
        airport = {
            selected: [],
            input:null,
            hide:true,
            error: false
        },
        country = {
            data: {
                input: null,
                value: null,
                filtered: [],
                error: false
            },
            airportsIncluded: {
                selected: [],
                input: null,
                hide: true
            },
            airportsExcluded: {
                selected: [],
                input: null,
                hide: true
            }
        },
        continent = {
            name: null,
            subregion: null,
            error: false,
            countriesIncluded: {
                selected: [],
                input: null,
                hide: true
            },
            countriesExcluded: {
                selected: [],
                input: null,
                hide: true
            },
            airportsExcluded: {
                selected: [],
                input: null,
                hide: true
            }
        },
        group = {
            continents: {
                selected: [],
                filtered: [],
                value: null,
                hide: true,
                error: false
            },
            countriesIncluded: {
                selected: [],
                input: null,
                hide: true
            },
            countriesExcluded: {
                selected: [],
                input: null,
                hide: true
            },
            airportsExcluded: {
                selected: [],
                input: null,
                hide: true
            }
        } 
    ) {
    this.name = name;
    this.nameEdited = nameEdited;
    this.typeRegion = typeRegion;
    this.country = country;
    this.continent = continent;
    this.airport = airport;
    this.group = group
  }
}

export default {
    props:['value','notPick'],
    async beforeMount(){
        const loadingComponent = this.$buefy.loading.open({container:null})
        let result = await fetch('https://restcountries.eu/rest/v2/all?fields=region;subregion');
        let data = await result.json();
        for(let region of data){
            if(this.continents.length==0){
                if(region.region!='' && region.region!='Polar'){
                    this.continents.push({region:region.region,subregions:[region.subregion]})
                }
            }
            else if(this.continents.filter(e=>e.region==region.region).length==0){
                if(region.region!='' && region.region!='Polar'){
                    this.continents.push({region:region.region,subregions:[region.subregion]})
                }
            } else if(this.continents.filter(e=>e.region==region.region).length!=0 && this.continents.filter(e=>e.region==region.region)[0].subregions.indexOf(region.subregion)==-1){
                this.continents.filter(e=>e.region==region.region)[0].subregions.push(region.subregion)
            }
        }
        this.continentsAux=[...this.continents];
        loadingComponent.close();
        if(this.value){
            this.regionName=this.value;
        }
    },  
    data(){
        return {
            create: false,
            edit: false,
            region: null,
            dataAirport : [],
            isFetchingAirport: false,
            isFetchingExcludedAirport: false,
            location: locationData,
            continents: [],
            continentsAux: [],
            regionName: null
        }
    },
    computed:{
        arrayCountryFiltered(){
            return this.location.getCountries().filter(country=>this.region.country.data.input?country.name.toLowerCase().indexOf(this.region.country.data.input.toLowerCase())>-1:true);
        },
        arrayCountryFilteredC(){
            return this.location.getCountries().filter(country=>this.region.continent.countriesIncluded.selected.every(e=>e.code!=country.shortName)&&this.region.continent.countriesExcluded.selected.every(e=>e.code!=country.shortName)).filter(country=>
                this.region.continent.countriesIncluded.input?country.name.toLowerCase().indexOf(this.region.continent.countriesIncluded.input.toLowerCase())>-1:true
            );
        },
        arrayCountryFilteredG(){
            return this.location.getCountries().filter(country=>this.region.group.countriesIncluded.selected.every(e=>e.code!=country.shortName)&&this.region.group.countriesExcluded.selected.every(e=>e.code!=country.shortName)).filter(country=>
                this.region.group.countriesIncluded.input?country.name.toLowerCase().indexOf(this.region.group.countriesIncluded.input.toLowerCase())>-1:true
            );
        },
        arrayCountryFilteredCE(){
            return this.location.getCountries().filter(country=>this.region.continent.countriesIncluded.selected.every(e=>e.code!=country.shortName)&&this.region.continent.countriesExcluded.selected.every(e=>e.code!=country.shortName)).filter(country=>
                this.region.continent.countriesExcluded.input?country.name.toLowerCase().indexOf(this.region.continent.countriesExcluded.input.toLowerCase())>-1:true
            );
        },
        duplicatedRegions(){
            if(this.contractToAdd.regions){
                let find = false;
                let temp = this.region.name?this.region.name.toUpperCase():null
                this.contractToAdd.regions.map(region=>{
                    if(region.title == temp){
                        find = true;
                    }
                })
                return find;
            } else {
                return false;
            }
        },
        filteredRegions(){
            return this.contractToAdd.regions.filter(region=>region.title!=this.notPick);
        },
        arrayCountryFilteredGE(){
            return this.location.getCountries().filter(country=>this.region.group.countriesIncluded.selected.every(e=>e.code!=country.shortName)&&this.region.group.countriesExcluded.selected.every(e=>e.code!=country.shortName)).filter(country=>
                this.region.group.countriesExcluded.input?country.name.toLowerCase().indexOf(this.region.group.countriesExcluded.input.toLowerCase())>-1:true
            );
        },
        ...mapState({
            access_token: state => state.auth.access_token,
            contractToAdd: state => state.managec.contractToAdd
        })
    },
    methods:{
        saveRegion(){
            this.$emit('editRegion',this.regionName);
            this.$parent.close()
        },
        createRegion(){
            this.create=true;
            this.edit=false;
            this.region = new regionClass();
            this.region.group.continents.filtered = [...this.continents];
        },
        editRegion(){
            this.$swal({
                toast:true,
                position: 'top',
                showConfirmButton: false,
                timer: 2500,
                type: 'info',
                title: 'Soon'
            });
        },
        getAirport: debounce(async function (name) {
            name=name.toUpperCase();
            if (!name.length) {
                this.dataAirport = [];
                return;
            }
            this.isFetchingAirport = true
            let result = await fetch(`/api/airport/find/${name}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                }
            });
            let data = await result.json();
            if(this.region.typeRegion=='airport'){
                this.dataAirport = data.filter(airport=>this.region.airport.selected.every(e=>e.iata!=airport.airportIC));
            } else if(this.region.typeRegion=='country'){
                this.dataAirport = data.filter(airport=>this.region.country.airportsIncluded.selected.every(e=>e.iata!=airport.airportIC)&&this.region.country.airportsExcluded.selected.every(e=>e.iata!=airport.airportIC));
            }
            this.isFetchingAirport = false;
        }, 500),
        getAirportExcluded: debounce(async function (name) {
            name=name.toUpperCase();
            if (!name.length) {
                this.dataAirport = [];
                return;
            }
            this.isFetchingExcludedAirport = true
            let result = await fetch(`/api/airport/find/${name}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.access_token}`
                }
            });
            let data = await result.json();
            if(this.region.typeRegion=='airport'){
                this.dataAirport = data.filter(airport=>this.region.airport.selected.every(e=>e.iata!=airport.airportIC));
            } else if(this.region.typeRegion=='country'){
                this.dataAirport = data.filter(airport=>this.region.country.airportsIncluded.selected.every(e=>e.iata!=airport.airportIC)&&this.region.country.airportsExcluded.selected.every(e=>e.iata!=airport.airportIC));
            } else if(this.region.typeRegion=='continent'){
                this.dataAirport = data.filter(airport=>this.region.continent.airportsExcluded.selected.every(e=>e.iata!=airport.airportIC));
            } else if(this.region.typeRegion=='group'){
                this.dataAirport = data.filter(airport=>this.region.group.airportsExcluded.selected.every(e=>e.iata!=airport.airportIC));
            } 
            this.isFetchingExcludedAirport = false;
        }, 500),
        selectAirport(option){
            if(option){
                if(this.region.typeRegion=='airport'){
                    if(this.region.airport.selected.filter(e=>e.iata==option.airportIC).length==0){
                        this.region.airport.selected.push({id:option._id,iata:option.airportIC});
                    }
                    if(!this.region.nameEdited){
                        let text = '';
                        this.region.airport.selected.map(e=>{
                        text+=`${e.iata}/`  
                        })
                        this.region.name=text.slice(0,-1)+'.'
                    }
                } else {
                    if(this.region.country.airportsIncluded.selected.filter(e=>e.iata==option.airportIC).length==0){
                       this.region.country.airportsIncluded.selected.push({id:option._id,iata:option.airportIC});
                    }
                }
            }
        },
        selectAirportExcluded(option){
            if(option){
                this.region.country.airportsExcluded.selected.push({id:option._id,iata:option.airportIC});
            }
        },
        selectAirportExcludedC(option){
            if(option){
                this.region.continent.airportsExcluded.selected.push({id:option._id,iata:option.airportIC});
            }
        },
        selectAirportExcludedG(option){
            if(option){
                this.region.group.airportsExcluded.selected.push({id:option._id,iata:option.airportIC});
            }
        },
        selectCountry(option){
            this.region.country.data.value=option?option.shortName:null;
            if(!this.region.nameEdited && option){
                this.region.name=option.name;
            }
        },
        selectCountryC(option){
            if(option){
                this.region.continent.countriesIncluded.selected.push({code:option.shortName,name:option.name});
            }
        },
        selectCountryG(option){
            if(option){
                this.region.group.countriesIncluded.selected.push({code:option.shortName,name:option.name});
            }
        },
        selectGroup(er){
            if(er){
                let data = er.split('%')
                if(this.region.group.continents.selected.filter(r=>r.region==data[0]).length==0){
                    this.region.group.continents.selected.push({region:data[0],subregions:[data[1]]});
                } else {
                    if(data[1]=='0'){
                        this.region.group.continents.selected.filter(r=>r.region==data[0])[0].subregions.splice(0);
                        this.region.group.continents.selected.filter(r=>r.region==data[0])[0].subregions.push(data[1]);
                    } else {
                        this.region.group.continents.selected.filter(r=>r.region==data[0])[0].subregions.push(data[1]);
                    }
                }
                if(data[1]=='0'){
                    this.region.group.continents.filtered = this.region.group.continents.filtered.filter(re=>re.region!=data[0]);
                } else {
                    let temp = this.region.group.continents.filtered.filter(re=>re.region==data[0])[0].subregions;
                    this.region.group.continents.filtered.filter(re=>re.region==data[0])[0].subregions.splice(temp.indexOf(data[1]),1);
                }
                this.region.group.continents.value='';
            }
        },
        deleteContinents(index,index1,selectedR){
            if(selectedR=='0'){
                this.region.group.continents.filtered.push(this.continents.filter(e=>e.region==this.region.group.continents.selected[index].region)[0]);
                this.region.group.continents.selected.splice(index,1);
            } else {
                this.region.group.continents.filtered.filter(er=>er.region==this.region.group.continents.selected[index].region)[0].subregions.push(selectedR);
                this.region.group.continents.selected[index].subregions.splice(index1,1);
            }
        },
        showRestContinents(){
            this.region.group.continents.hide=!this.region.group.continents.hide
        },
        selectCountryExcluded(option){
            if(option){
                this.region.continent.countriesExcluded.selected.push({code:option.shortName,name:option.name});
            }
        },
        selectCountryExcludedG(option){
            if(option){
                this.region.group.countriesExcluded.selected.push({code:option.shortName,name:option.name});
            }
        },
        showRestAirports(){
            if(this.region.typeRegion=='airport'){
                this.region.airport.hide=!this.region.airport.hide;
            } else {
                this.region.country.airportsIncluded.hide=!this.region.country.airportsIncluded.hide;
            }
        },
        showRestAirportsExcluded(){
            this.region.country.airportsExcluded.hide=!this.region.country.airportsExcluded.hide;
        },
        showRestAirportsExcludedC(){
            this.region.continent.airportsExcluded.hide=!this.region.continent.airportsExcluded.hide;
        },
        showRestAirportsExcludedG(){
            this.region.group.airportsExcluded.hide=!this.region.group.airportsExcluded.hide;
        },
        showRestCountries(){
            this.region.continent.countriesIncluded.hide=!this.region.continent.countriesIncluded.hide;
        },
        showRestCountriesG(){
            this.region.group.countriesIncluded.hide=!this.region.group.countriesIncluded.hide;
        },
        showRestCountriesExcluded(){
            this.region.continent.countriesExcluded.hide=!this.region.continent.countriesExcluded.hide;
        },
        showRestCountriesExcludedG(){
            this.region.group.countriesExcluded.hide=!this.region.group.countriesExcluded.hide;
        },
        deleteAirports(index1){
            if(this.region.typeRegion=='airport'){
                this.region.airport.selected.splice(index1,1);
                if(this.region.airport.selected.length<4 && !this.region.airport.hide){
                    this.region.airport.hide=true;
                }
            } else {
                this.region.country.airportsIncluded.selected.splice(index1,1);
                if(this.region.country.airportsIncluded.selected.length<4 && !this.region.country.airportsIncluded.hide){
                    this.region.country.airportsIncluded.hide=true;
                }
            }
        },
        deleteAirportsExcluded(index1){
            this.region.country.airportsExcluded.selected.splice(index1,1);
            if(this.region.country.airportsExcluded.selected.length<4 && !this.region.country.airportsExcluded.hide){
                this.region.country.airportsExcluded.hide=true;
            }
        },
        deleteAirportsExcludedC(index1){
            this.region.continent.airportsExcluded.selected.splice(index1,1);
            if(this.region.continent.airportsExcluded.selected.length<4 && !this.region.continent.airportsExcluded.hide){
                this.region.continent.airportsExcluded.hide=true;
            }
        },
        deleteAirportsExcludedG(index1){
            this.region.group.airportsExcluded.selected.splice(index1,1);
            if(this.region.group.airportsExcluded.selected.length<4 && !this.region.group.airportsExcluded.hide){
                this.region.group.airportsExcluded.hide=true;
            }
        },
        deleteCountry(index1){
            this.region.continent.countriesIncluded.selected.splice(index1,1);
            if(this.region.continent.countriesIncluded.selected.length<4 && this.region.continent.countriesIncluded.hide){
                this.region.continent.countriesIncluded.hide=true;
            }
        },
        deleteCountryG(index1){
            this.region.group.countriesIncluded.selected.splice(index1,1);
            if(this.region.group.countriesIncluded.selected.length<4 && this.region.group.countriesIncluded.hide){
                this.region.group.countriesIncluded.hide=true;
            }
        },
        deleteCountryExcluded(index1){
            this.region.continent.countriesExcluded.selected.splice(index1,1);
            if(this.region.continent.countriesExcluded.selected.length<4 && this.region.continent.countriesExcluded.hide){
                this.region.continent.countriesExcluded.hide=true;
            }
        },
        deleteCountryExcludedG(index1){
            this.region.group.countriesExcluded.selected.splice(index1,1);
            if(this.region.group.countriesExcluded.selected.length<4 && this.region.group.countriesExcluded.hide){
                this.region.group.countriesExcluded.hide=true;
            }
        },
        async createRegionToAdd(){
            const result = await this.$validator.validateAll();
            let error = false;
            if(!result){
                error=true;
            }
            if(this.region.typeRegion=='airport'){
                if(this.region.airport.selected.length==0){
                    this.region.airport.error=true;
                    error=true;
                } else {
                    this.region.airport.error=false;
                }
            } else if(this.region.typeRegion=='country'){
                if(!this.region.country.data.value){
                    this.region.country.data.error=true;
                    error=true;
                } else {
                    this.region.country.data.error=false;
                }
            } else if(this.region.typeRegion=='continent'){
                if(!this.region.continent.name){
                    this.region.continent.error=true;
                    error=true;
                } else {
                    this.region.continent.error=false;
                }
            } else if(this.region.typeRegion=='group'){
                if(this.region.group.continents.selected.length==0){
                    this.region.group.continents.error=true;
                    error=true;
                } else {
                     this.region.group.continents.error=false;
                }
            }

            if(error){
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'error',
                    title: this.$t('pages.mngContract.create.errors.checkField')
                });
                return;
            }
            
            let regionsToAdd = this.contractToAdd.regions?this.contractToAdd.regions.slice():[];
            let dataToSend = {regions: regionsToAdd}
            dataToSend.regions.push({
                title: this.region.name.toUpperCase(),
                typeRegion: this.region.typeRegion,
                airport: {
                    selected: this.region.airport.selected.slice()
                },
                country: {
                    title: this.region.country.data.value,
                    airportsIncluded: this.region.country.airportsIncluded.selected.slice(),
                    airportsExcluded: this.region.country.airportsExcluded.selected.slice(),
                },
                continent: {
                    region: this.region.continent.name,
                    subregion: this.region.continent.subregion,
                    countriesIncluded: this.region.continent.countriesIncluded.selected.slice(),
                    countriesExcluded: this.region.continent.countriesExcluded.selected.slice(),
                    airportsExcluded: this.region.continent.airportsExcluded.selected.slice()
                },
                group: {
                    continents: this.region.group.continents.selected.slice(),
                    countriesIncluded: this.region.group.countriesIncluded.selected.slice(),
                    countriesExcluded: this.region.group.countriesExcluded.selected.slice(),
                    airportsExcluded: this.region.group.airportsExcluded.selected.slice()
                }
            });
            this.setFieldsCTA(dataToSend);
            this.$swal({
                toast:true,
                position: 'top',
                showConfirmButton: false,
                timer: 2500,
                type: 'success',
                title: this.$t('pages.mngContract.create.confirm.success')
            })
            this.region = new regionClass();
            this.region.group.continents.filtered = [...this.continentsAux];
        },
        ...mapActions({
            setFieldsCTA: 'managec/setFieldsCTA'
        })
    }
}
</script>

<style lang="scss">
.dropdownCategory1{
    .dropdown-menu{
        border:none;
    }
    .dropdown-content{
        position: fixed;
    }
}
</style>