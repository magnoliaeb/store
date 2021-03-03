<template>
  <div>
    <v-container>
      <h1>bienvenido</h1>
    <p>{{ user }}</p>
    </v-container>

  </div>
</template>

<script>
import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState('auth', ['user'])
    },
  }
</script>
