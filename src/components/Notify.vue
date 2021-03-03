<template>
      <v-snackbar :color="color"
      v-model="snackbar"  :timeout="timeout"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="closeSnackbar"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
    export default {
        data() {
            return {
                 snackbar: true,
                 timeout: 3000
            }
        },
        watch: {
            snackbar() {
                if (!this.snackbar) {
                    this.closeSnackbar()
                }
            }
        },
        props: {
            message: {
                type: String,
            },
            color: {
                type: String,
            },
        },
        methods: {
            closeSnackbar() {
                this.snackbar = false
                this.$emit('onCloseNofity', this.snackbar)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>