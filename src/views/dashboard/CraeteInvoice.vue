<template>
  <v-container>
  <NotifyVue v-if="showNotify" :color="color" :message="message" 
  @onCloseNofity="showNotify = $event" />

    <h2 class="mb-6 text-md-h4 font-weight-bold">Crear nueva venta</h2>

    <v-card style="position: relative">
      <v-btn @click="closeform" fab x-large absolute top right color="secondary lighten-2">
        <v-icon class="">mdi-arrow-left</v-icon>
      </v-btn>
      

      
            <v-container grid-list-md class="pa-4">
             

                     <v-form id="form"
                  @submit.prevent="save"
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                 <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field type="text" readonly
                            name="num_voucher" 
                            
                            v-model="editedItem.num_voucher"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field type="text" readonly
                            name="serie_voucher"
                            
                            v-model="editedItem.serie_voucher"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field type="number"
                            name="tax"
                            label="Impuesto" :rules="rules.taxRules"
                            v-model="editedItem.tax" min="0" max="1"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" lg="6">
                        <v-select
                            :items="vouchers" :rules="rules.voucherRules"
                            v-model="editedItem.type_voucher"
                            label="Tipo de comprobante"
                        ></v-select>
                    </v-col>
                    
                    <v-col cols="12" md="12" lg="6">
                        <v-autocomplete
                            label="Cliente" :rules="rules.clientRules"
                            :items="clients"
                            v-model="editedItem.client"
                        ></v-autocomplete>
                    </v-col>
                 </v-row>
                   </v-form>
                 
              
                   <v-row>
                        <v-col cols="12" sm="8">
                        <v-text-field append-icon="mdi-magnify" @keyup.enter="getArticleByCode" :error="errorCode"
                            name="code" :messages="messageErrorCode"
                            label="Buscar articulo por código"
                            v-model="code"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="2">
                       <!-- modal  -->
                       <ModalArticleVue @onAddArticle="addDetails" />
                    </v-col>
                   </v-row>

              
                <v-row >
                    
                 
                    <!-- <v-col v-show="errorDetails">
                      <p class="error--text">{{ errorDetailsMessage }}</p>
                    </v-col> -->
                 
                 
                     <v-col cols="12" sm="12">
                        <v-data-table
                            :headers="headerDetails"
                            :items="details"
                            hide-default-footer
                        >
                        <template v-slot:item.actions="{ item }">
                            <v-icon @click="deleteItemDetails(item)" class="">mdi-trash-can</v-icon>
                        </template>

                         <template v-slot:item.subTotal="{ item }">
                            $ {{ ((item.price * item.quantity) - item.discount).toFixed(2) }}
                        </template>
                         <template v-slot:item.price="{ item }">
                            <v-text-field type="number" prefix="$"
                              name="price" v-model="item.price" dense
                            ></v-text-field>
                        </template>
                         <template v-slot:item.discount="{ item }">
                            <v-text-field type="number" prefix="$"
                              name="price" v-model="item.discount" dense
                            ></v-text-field>
                        </template>
                         <template v-slot:item.quantity="{ item }">
                            <v-text-field type="number"
                              name="price" v-model="item.quantity" dense
                            ></v-text-field>
                        </template>
                        <template slot="no-data">
                            <h3>No hay articulos agregados al detalle</h3>
                        </template>
                            
                        </v-data-table>
                        <v-col class="text-sm-right pb-0">
                          <strong>Total Parcial</strong> $ {{ calculeTotalParcial }}
                        </v-col>
                        <v-col class="text-sm-right pb-0">
                          <strong>Total Impuesto</strong> $ {{ calculeTotalTax }}
                        </v-col>
                        <v-col class="text-sm-right pb-0">
                          <strong>Total Neto</strong> $ {{ calculeTotal }}
                        </v-col>
                    </v-col>
                    <v-col cols="12">
                        <v-btn @click="closeform" color="secondary"  text>
                    cancelar
                  </v-btn>
                  <v-btn type="submit" form="form" :disabled="!valid" color="primary" depressed>
                    guardar
                  </v-btn>
                    </v-col>
                    
                </v-row>
              
                
            </v-container>
    </v-card>

    
  </v-container>
</template>

<script>
import http from "@/config/http";
import NotifyVue from '@/components/Notify.vue';
import ModalArticleVue from '../../components/ModalArticle.vue';
import voucher_codes from 'voucher-code-generator'

export default {
  name: "CreateInvoice",
  components: { NotifyVue, ModalArticleVue },
   data() {
    return {
        valid: true,
        errorCode: null,
      messageErrorCode: null,
            showNotify: false,
      vouchers: ["FACTURA", "TICKET", "BOLETA", "GUIA"],
      clients: [],
      defaultItem: {
        type_voucher: "FACTURA",
        client: "",
        tax: 0.18,
        serie_voucher: '',
        num_voucher: ''
      },
      editedItem: {
        type_voucher: "FACTURA",
        client: "",
        tax: 0.18,
        serie_voucher: '',
        num_voucher: ''
      },
      headerDetails: [
        { text: "Acciones", align: "start", sortable: false, value: "actions" },
        { text: "Articulo", align: "start", sortable: false, value: "article" },
        { text: "Cantidad", align: "start", sortable: false, value: "quantity" },
        { text: "Precio", align: "start", sortable: false, value: "price" },
        { text: "Descento", align: "start", sortable: false, value: "discount" },
        { text: "Sub Total", align: "start", sortable: false, value: "subTotal" },

      ],
      details: [],
      code: '',
    //   errorArticle: null,
      rules: {
        voucherRules: [
          (v) => !!v || "El tipo de comprobante es requerido",
        ],
        clientRules: [
          (v) => !!v || "El proveedor es requerido",
        ],
        taxRules: [
          (v) => !!v || "El impuesto es requerido",
          v => ( v >=0  && v <= 1) || 'El impuesto no es un valor válido',
        ],
        
        
      },
    };
  },
   computed: {
    calculeTotal() {
      let res = 0.0;
      res = this.details.reduce((total, article) => {
        return total += (article.price * article.quantity) - article.discount
      }, 0)
      return res.toFixed(2)
    },
    calculeTotalTax() {
      return ((this.calculeTotal * this.editedItem.tax)/ (1+this.editedItem.tax)).toFixed(2)
    },
    calculeTotalParcial() {
      return (this.calculeTotal - this.calculeTotalTax).toFixed(2)
    },
    get_num_voucher() {
      return voucher_codes.generate({
                length: 8,
                prefix: "n-",
                charset: voucher_codes.charset("numbers")
            })[0]
      
    },
    get_serie_voucher() {
      return  voucher_codes.generate({
                length: 5,
                prefix: "s-",
                charset: voucher_codes.charset("numbers")
            })[0]
    },

  
  },
   mounted () {
    this.editedItem.num_voucher = this.get_num_voucher
    this.editedItem.serie_voucher = this.get_serie_voucher
  },
  async created() {
      await this.getClient()
     
  },

  methods: {
     async getClient() {
         const header = { token: this.$store.getters['auth/token'] };
         const config = { headers: header };

        const res = await http.get("/clients", config);
        const clients = res.data.records.map((item) => {
            return {
                text: item.name,
                value: item._id
            }
        })
        this.clients = clients;
      },
       async getArticleByCode() {
        this.errorCode = null
        const header = { token: this.$store.getters['auth/token'] };
        const config = { headers: header };

        if (this.code) {
          try {
            
            const res = await http.get("/articles/code?code="+this.code, config)
            console.log(res)
            this.addDetails(res.data.record)
          } catch (e) {
            this.errorCode = true
            this.messageErrorCode = 'Articulo no encontrado'
          }
        } else {
          return
        }
      },
       addDetails(data) {
        if (this.findArticle(data._id)) {
          const index = this.details.findIndex((item) => item._id === data._id)
          this.details[index].quantity++
          return
        }
        this.details.push({
          _id: data._id,
          article: data.name,
          quantity: 1,
          price: data.price,
          discount: 0
        })
        this.code = ''
      },
       deleteItemDetails(item) {
        const index = this.details.indexOf(item);
        this.details.splice(index,1)
      },

      findArticle(id) {
        return this.details.some((item) => item._id === id)
      },
      validateDetails() {
         if (this.details.length <= 0) {
            this.makeToast('error', 'Oops! Algo salio mal. Debes añadir por lo menos 1 articulo')

            return false
         }
           this.errorDetails = false
            this.errorDetailsMessage = null;
         return true
      },
      makeToast(color, message) {
       this.color=color;
       this.message = message;
       this.showNotify = true
    },

       async save() {
         
         if (this.$refs.form.validate() && this.validateDetails()) {
        const header = { token: this.$store.getters['auth/token'] };
        const config = { headers: header };
          try {
            const income = { 
              ...this.editedItem, 
              user: this.$store.getters['auth/user']._id, 
              total: this.calculeTotal, 
              details: this.details 
            }
             await http.post("/invoices", income, config);
            this.editedItem = Object.assign({}, this.defaultItem)
            this.$refs.form.resetValidation();
             this.editedItem.num_voucher = this.get_num_voucher
      this.editedItem.serie_voucher = this.get_serie_voucher
            this.details = []
             this.makeToast('success', 'En Hora Buena!, El registro fue guardado de forma carrectamente...')
             
            //  this.closeform()
            
          } catch (e) {
              console.log(e);
              this.makeToast('error', 'Oops! Algo salio mal.')
          }


      }
    },


     closeform() {
            this.$router.push({ name: 'Invoice'})
            // this.details = [];
            // this.editedItem = Object.assign({}, this.defaultItem)
            },
    
  },
  
};
</script>

<style lang="scss" scoped></style>
