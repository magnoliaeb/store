<template>
  <v-dialog v-model="dialog" width="1000">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary lighten-2" fab dark large v-bind="attrs" v-on="on">
        <v-icon>mdi-view-list</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline">
        Seleccione un articulo
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              name="search"
              label="Buscar articulo"
              v-model="search"
              @keyup.enter="getArticles"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-data-table
              :headers="headerArticle"
              :items="articles" :loading="isLoadingTable"
              hide-default-footer
            >
              <template v-slot:item.actions="{ item }">
                <v-btn @click="addProductToDetails(item)" icon color="primary">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false" color="secondary" text>
          cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import http from '../config/http'
export default {
  data() {
    return {
        name: 'ModalArticle',
        dialog: false,
        search: null,
        headerArticle: [
            { text: "Seleccionar", align: "start", false: false, value: "actions" },
            { text: "Código", align: "start", sortable: true, value: "code" },
            { text: "Nombre", align: "start", sortable: true, value: "name" },
            {
            text: "Categoria",
            align: "start",
            sortable: true,
            value: "category.name",
            },
            { text: "Precio", align: "start", sortable: true, value: "price" },
            { text: "Stock", align: "start", sortable: true, value: "stock" },
        ],
        articles: [],
        isLoadingTable: null
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    
  },

  methods: {
    async getArticles() {
       const header = { token: this.$store.getters['auth/token'] };
      const config = { headers: header };
      
      if (this.search) {
        this.isLoadingTable = true;
        const res = await http.get( "/articles?value=" + this.search, config);
        this.articles = res.data.records;
        this.isLoadingTable = false;
        this.search = null
      } else {
        return
      }
        
      
    },

    addProductToDetails(item) {
      this.$emit('onAddArticle', item)
    },

     close() {
      this.dialog = false;
    },
   

  },
};
</script>

<style lang="scss" scoped></style>
