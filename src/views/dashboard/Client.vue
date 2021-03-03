<template>
  <v-container>

<NotifyVue v-if="showNotify" :color="color" :message="message" @onCloseNofity="showNotify = $event" />

        <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-form @submit.prevent="save"
            ref="form"
            v-model="valid"
            lazy-validation>
        <v-card-title class="headline">
          {{ formTitle }}
        </v-card-title>

        <v-card-text>
              <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field dense
                      v-model.trim="editedItem.name"
                      :rules="rules.nameRules"
                      name="name"
                      label="Nombre"
                    ></v-text-field>

                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select dense v-model="editedItem.type_document"
                       :rules="rules.tdocumentRules"
                      :items="type_documents"
                      label="Tipo de documento"
                    ></v-select>
                     
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field dense
                      v-model.trim="editedItem.num_document" :error="errorDocument" :error-messages="messageErrorDocument"
                      :rules="rules.ndocumentRules"
                      name="num_document"
                      label="N° de documento"
                    ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field dense
                      v-model.trim="editedItem.email"
                      :rules="rules.emailRules"
                      name="email"
                      label="Email"
                    ></v-text-field>

                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field dense
                      v-model.trim="editedItem.phone"
                      :rules="rules.phoneRules"
                      name="phone"
                      label="Teléfono"
                    ></v-text-field>

                    </v-col>
                    <v-col cols="12">
                       <v-textarea dense
                  v-model.trim="editedItem.address"
                  :rules="rules.addressRules"
                    name="address"
                    label="Dirección"
                    ></v-textarea>

                    </v-col>
                    
                  </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary darken-1" text @click="dialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn color="primary darken-1" :disabled="!valid" type="submit" :loading="isLoadingBtn"
          >
            Guardar
          </v-btn>
        </v-card-actions>
          </v-form>
      </v-card>
    </v-dialog>

    <h2 class="mb-6 text-md-h4 font-weight-bold">Clientes</h2>

    <v-card style="position: relative">
      <v-btn @click.stop="dialog = true" fab x-large absolute top right color="primary lighten-2">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-card-title>
          <v-row class="flex align-center">
              <v-col cols="12" md="8">
                <v-text-field
                    autocomplete="off"
                    append-icon="mdi-magnify"
                    name="search"
                    label="Buscar"
                    v-model="search"
                ></v-text-field>
              </v-col>
              <v-col>
                  <v-btn color="secondary" text>
                      <v-icon left>mdi-printer-3d</v-icon>
                      Imprimir</v-btn>
              </v-col>
          </v-row>
      </v-card-title>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="clients"
            :loading="loadingTable"
            :search="search"
            item-key="_id"
            :items-per-page="10"
          >
            <template v-slot:item.state="{ item }">
              <v-chip
                @click="changeState(item)"
                v-if="item.state"
                color="success"
                dark
              >
                Activo
              </v-chip>
              <v-chip @click="changeState(item)" v-else color="error" dark>
                Inactivo
              </v-chip>
            </template>
            <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt | formatDate }}
            </template>
             <template v-slot:item.actions="{ item }">
                <v-btn @click="editItem(item)" icon color="gray">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>

    
  </v-container>
</template>

<script>
import http from "@/config/http";
import moment from "moment";
import NotifyVue from '../../components/Notify.vue';


export default {
  name: "Client",
  components: { NotifyVue },
  data() {
    return {
      search: "",
      loadingTable: true,
      clients: [],
       headers: [
        { text: "Documento", align: "start", sortable: true, value: "type_document" },
        { text: "N° Documento", align: "start", sortable: true, value: "num_document" },
        { text: "Nombre", align: "start", sortable: true, value: "name" },
        { text: "Email", align: "start", sortable: true, value: "email" },
        { text: "Estado", align: "start", sortable: true, value: "state" },
        { text: "Fecha", align: "start", sortable: true, value: "createdAt" },
        { text: "Acciones", align: "start", false: false, value: "actions" },
      ],
      type_documents: ['DNI','RUC','PASAPORTE','CEDULA'],
      dialog: false,
      editedIndex: -1,
      valid: true,
      isLoadingBtn: false,
      itemSelected: null,
      errorDocument: null,
      messageErrorDocument: null,
      color: null,
      message: null,
      showNotify: false,
      defaultItem: {
       name: '',
        type_document: '',
        num_document: '',
        address: '',
        phone: '',
        email: '',
      },
      editedItem: {
       name: '',
        type_document: '',
        num_document: '',
        address: '',
        phone: '',
        email: '',
      },
        rules: {
        nameRules: [
         v => !!v || 'El nombre es requerido',
         v => (v && v.length <= 50) || 'El nombre debe tener menos de 50 caracteres',
       ],
       tdocumentRules: [
        v => !!v || 'El tipo del documento es requerido',
      ],
       ndocumentRules: [
        v => !!v || 'El número del documento es requerido',
        v => (v && v.length <= 20) || 'El nombre debe tener menos de 20 caracteres',
      ],
       addressRules: [
        v => (v.length <= 100) || 'La dirección debe tener menos de 100 caracteres',
      ],
       emailRules: [
        v => !!v || 'El email es requerido',
        v => (v.length <= 60) || 'EL email debe tener menos de 60 caracteres',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'El email no es válido'
      ],
       phoneRules: [
        v => (v.length <= 20) || 'La teléfono debe tener menos de 20 caracteres',
      ],

      }
    };
  },
  async created() {
    await this.getClients();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    },
  },
  filters: {
    formatDate: function(value) {
      return moment(value).format("MMMM Do YYYY, h:mm:ss a");
    },
  },
   watch: {
    dialog(val) {
      val || this.close();
    },

    'editedItem.num_document': function(value) {

      const existClient = this.clients.some((item) => item.num_document.toLowerCase() === value.toLowerCase());

      const clientSelected = this.clients.find((item) => item._id === this.itemSelected)

      if (this.editedIndex > -1 && clientSelected.num_document.toLowerCase() === value.toLowerCase()) return

      if (existClient) {
          this.errorDocument = true;
          this.messageErrorDocument = 'El N° de documento ya está registrado'
        } else {
          this.errorDocument = false;
          this.messageErrorDocument = null

        }
    },

  },
  methods: {
    async getClients() {
      const header = { token: this.$store.getters['auth/token'] };
      const config = { headers: header };

      const res = await http.get("/clients", config);
      this.clients = res.data.records
      this.loadingTable = false;
    },
    async changeState(item) {
      const header = { token: this.$store.getters['auth/token'] };
      const config = { headers: header };

      const index = this.clients.findIndex(
        (client) => client._id === item._id
      );
      if (item.state) {
        await http.put(`/clients/${item._id}/disabled`, {}, config);
        this.clients[index].state = false;
      } else {
        await http.put(`/clients/${item._id}/enabled`, {}, config);
        this.clients[index].state = true;
      }
    },
     editItem(item) {
      this.itemSelected = item._id;
      Object.assign(this.editedItem, item);
      this.dialog = true;
      this.editedIndex = 1;
    },

    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    makeToast(color, message) {
       this.color=color;
       this.message = message;
       this.showNotify = true
    },
   
    async save() {
    const header = { token: this.$store.getters['auth/token'] };
      const config = { headers: header };

      if (this.$refs.form.validate()) {
        this.isLoadingBtn = true
        if (this.editedIndex > -1) {
          try {
            await http.put(`/clients/${this.itemSelected}`, this.editedItem, config);
            this.makeToast('success', 'En Hora Buena!, El registro fue actualizaddo de forma carrectamente...')
            await this.getClients()
            this.close()
          } catch (e) {
            console.log(e);
            this.makeToast('error', 'Oops! Algo salio mal.')
          } 
        } else {
          try {
            await http.post("/clients", this.editedItem, config);
            this.makeToast('success', 'En Hora Buena!, El registro fue guardado de forma carrectamente...')
            await this.getClients()
            this.close()
            
          } catch (e) {
            this.makeToast('error', 'Oops! Algo salio mal.')
            console.log(e);
          }  
        }
      }
      this.isLoadingBtn = false
    },
  },
  
};
</script>

<style lang="scss" scoped></style>
