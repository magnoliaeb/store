<template>
  <div class="fill-height">
    <v-container grid-list-md class="fill-height">
      <v-row class="flex justify-center">
        <v-col cols="12" md="6" lg="5">
          <v-card class="py-8 px-2" rounded>
            <v-form @submit.prevent="loginUser">
              <v-card-title primary-title>
                <h2 class="text-h4 font-weight-bold">Store Vue</h2>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="credenciales.email"
                      type="email" autofocus
                      name="email"
                      label="Email" required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="credenciales.password"
                      @click:prepend="showPassword = !showPassword"
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      name="password"
                      label="Password" required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn :loading="loading" type="submit" block large color="primary" dark depressed
                  >Inicia sesión
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <NotifyVue v-if="showNotify" :color="color" :message="message" @onCloseNofity="showNotify = $event" />

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import http from '../../config/http'
import NotifyVue from '@/components/Notify.vue';

export default {
  components: { NotifyVue },
  data() {
    return {
      showPassword: true,
      loading: null,
      credenciales: {
        email: "magno@gmail.com",
        password: "password",
      },
      color: null,
      message: null,
      showNotify: false,
    };
  },
  methods: {
    async loginUser() {
      const { email, password } = this.credenciales
      this.loading = true
      try {
          const res = await http.post('/users/login', { email, password })
          console.log(res)
          this.getToken(res.data.tokenReturn)
          this.$router.push({ name: 'Home'})
      } catch (e) {
        console.log(e.response)
        this.makeToast('error', `Oops! Algo salio mal. ${e.response.data.error}`)
      } finally {
        this.loading = false
      }
    },
     makeToast(color, message) {
       this.color=color;
       this.message = message;
       this.showNotify = true
    },
   
    ...mapActions('auth', ['getToken'])
  },
};
</script>
