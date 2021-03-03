<template>
  <v-container>

    <h2 class="mb-6 text-md-h4 font-weight-bold">Ventas</h2>

    <v-card style="position: relative">
      <v-btn @click="$router.push({ name: 'CraeteInvoice'})" fab x-large absolute top right color="primary lighten-2">
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
            :items="invoices"
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
  name: "Category",
  components: { NotifyVue },
  data() {
    return {
      search: "",
      loadingTable: true,
      invoices: [],
      headers: [
        { text: "Acciones", align: "start", sortable: false, value: "actions" },
        { text: "N° comprobante", align: "start", sortable: true, value: "num_voucher" },
        { text: "Serie comprobante", align: "start", sortable: true, value: "serie_voucher" },
        { text: "Tipo de comprobante", align: "start", sortable: true, value: "type_voucher" },
        { text: "Usuario", align: "start", sortable: true, value: "user.name" },
        { text: "Cliente", align: "start", sortable: true, value: "client.name" },
        { text: "Impuesto", align: "start", sortable: true, value: "tax" },
        { text: "Total", align: "start", sortable: true, value: "total" },
        { text: "Estado", align: "start", sortable: true, value: "state" },
        { text: "Fecha", align: "start", sortable: true, value: "createdAt" },
      ],
      
    };
  },
  async created() {
    await this.getInvoices();
  },

  filters: {
    formatDate: function(value) {
      return moment(value).format("MMMM Do YYYY, h:mm:ss a");
    },
  },

  methods: {
    async getInvoices() {
        const header = { token: this.$store.getters['auth/token'] };
      const config = { headers: header };
      const res = await http.get("/invoices", config);
      this.invoices = res.data.records
      this.loadingTable = false;
    },
    async changeState(item) {
        const header = { token: this.$store.getters['auth/token'] };
      const config = { headers: header };

      const index = this.invoices.findIndex(
        (invoice) => invoice._id === item._id
      );
      if (item.state) {
        await http.put(`/invoices/${item._id}/disabled`, {}, config);
        this.invoices[index].state = false;
      } else {
        await http.put(`/invoices/${item._id}/enabled`, {}, config);
        this.invoices[index].state = true;
      }
    },
    
  },
  
};
</script>

<style lang="scss" scoped></style>
