<template>
  <v-container>

  <NotifyVue v-if="showNotify" :color="color" :message="message" 
  @onCloseNofity="showNotify = $event" />

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
                      v-model.trim="editedItem.name" :error="errorName" :error-messages="messageErrorName"
                      :rules="rules.nameRules"
                      name="name"
                      label="Nombre"
                    ></v-text-field>

                    </v-col>
                    <v-col cols="12" md="12">
                      <v-select dense v-model="editedItem.category"
                       :rules="rules.categoryRules"
                      :items="categories"
                      label="Categoria"
                    ></v-select>
                     
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field dense type="number"
                      v-model.trim="editedItem.price"
                      :rules="rules.priceRules"
                      name="price" prefix="$"
                      label="Precio"
                    ></v-text-field>
                    </v-col>
                 
                    <v-col cols="12" md="6">
                      <v-text-field dense type="number"
                      v-model.trim="editedItem.stock"
                      name="stock" prefix="U"
                      label="Stock"
                    ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      
                    <v-textarea dense
                    v-model.trim="editedItem.description"
                    :rules="rules.descriptionRules"
                      name="description"
                      label="Description"
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

    <h2 class="mb-6 text-md-h4 font-weight-bold">Articulos</h2>

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
            :items="articles"
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
import NotifyVue from '@/components/Notify.vue';


export default {
  name: "Article",
  components: { NotifyVue },
  data() {
    return {
      search: "",
      loadingTable: true,
      categories: [],
      articles: [],
       headers: [
        { text: "Código", align: "start", sortable: true, value: "code" },
        { text: "Nombre", align: "start", sortable: true, value: "name" },
        { text: "Categoria", align: "start", sortable: true, value: "category.name" },
        { text: "Precio", align: "start", sortable: true, value: "price" },
        { text: "Stock", align: "start", sortable: true, value: "stock" },
        { text: "Estado", align: "start", sortable: true, value: "state" },
        { text: "Fecha", align: "start", sortable: true, value: "createdAt" },
        { text: "Acciones", align: "start", false: false, value: "actions" },
      ],
      dialog: false,
      editedIndex: -1,
      valid: true,
      isLoadingBtn: false,
      itemSelected: null,
      errorName: null,
      messageErrorName: null,
      color: null,
      message: null,
      showNotify: false,
      defaultItem: {
        name: '',
        category:'',
        price: null,
        stock: 0,
        description: ''
      },
      editedItem: {
        name: '',
        category:'',
        price: null,
        stock: 0,
        description: ''
      },
        rules: {
        nameRules: [
         v => !!v || 'El nombre es requerido',
         v => (v && v.length <= 100) || 'El nombre debe tener menos de 100 caracteres',
       ],
       priceRules: [
        v => !!v || 'El precio es requerido',
      ],
       categoryRules: [
        v => !!v || 'La categoria es requerida',
      ],
       descriptionRules: [
        v => (v.length <= 255) || 'La dirección debe tener menos de 255 caracteres',
      ],
      }
    };
  },
  async created() {
    await this.getArticles();
    await this.getCategories()
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

    'editedItem.name': function(value) {

      const existProduct = this.articles.some((item) => item.name.toLowerCase() === value.toLowerCase());

      const productSelected = this.articles.find((item) => item._id === this.itemSelected)

      if (this.editedIndex > -1 && productSelected.name.toLowerCase() === value.toLowerCase()) return

      if (existProduct) {
          this.errorName = true;
          this.messageErrorName = 'El artículo ya está registrado'
        } else {
          this.errorName = false;
          this.messageErrorName = null

        }
    },

  },
  methods: {
    async getArticles() {
       const header = { token: this.$store.getters['auth/token'] };
      const config = { headers: header };

      const res = await http.get("/articles", config);
      this.articles = res.data.records
      this.loadingTable = false;
    },
    async getCategories() {
          const header = { token: this.$store.getters['auth/token'] };
      const config = { headers: header };

        const res = await http.get("/categories", config);
        const categories = res.data.records.map((item) => {
            return {
                text: item.name,
                value: item._id
            }
        })
        this.categories = categories;
      },

    async changeState(item) {
       const header = { token: this.$store.getters['auth/token'] };
      const config = { headers: header };

      const index = this.articles.findIndex(
        (category) => category._id === item._id
      );
      if (item.state) {
        await http.put(`/articles/${item._id}/disabled`, {}, config);
        this.articles[index].state = false;
      } else {
        await http.put(`/articles/${item._id}/enabled`, {}, config);
        this.articles[index].state = true;
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
            await http.put(`/articles/${this.itemSelected}`, this.editedItem, config);
            await this.getArticles()
            this.makeToast('success', 'En Hora Buena!, El registro fue actualizaddo de forma carrectamente...')
            this.close()
          } catch (e) {
            console.log(e);
            this.makeToast('error', 'Oops! Algo salio mal.')
          } 
        } else {
          try {
            await http.post("/articles", this.editedItem, config);
            await this.getArticles()
            this.makeToast('success', 'En Hora Buena!, El registro fue guardado de forma carrectamente...')
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

