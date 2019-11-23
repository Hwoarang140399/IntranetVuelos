<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <nuxt-link class="navbar-brand align-items-center" :to="localePath('index')">
                <figure class="figure">
                    <img style="height:3rem;" src="~/assets/logo_01.png">
                </figure>
            </nuxt-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToogle" aria-controls="navbarToogle" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarToogle">
                <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <nuxt-link
                            v-for="locale in $i18n.locales"
                            v-if="locale.code !== $i18n.locale"
                            :key="locale.code"
                            :to="switchLocalePath(locale.code)"
                        >
                            <div class="navbar-item text-white">
                                <span class="icon"><img :src="require(`~/assets/flag-icons/${locale.code}.svg`)"></span>
                                <p class="pl-2">{{ locale.name }}</p>
                            </div>
                        </nuxt-link> 
                    </li>
                </ul>
            </div>
        </nav>
        <nuxt/>
    </div>
</template>