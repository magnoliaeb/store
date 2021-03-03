<template>
  <v-app>
    <NavBarVue />
  
    <v-main class="">
        <router-view></router-view>
    </v-main>

  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

import NavBarVue from './components/NavBar.vue'

  export default {
    components: {
      NavBarVue,
    },
    created () {
      this.autoLogin();
    },
    methods: {
      ...mapActions('auth', ['autoLogin'])
    },
  }
</script>
