<template>
    <div>
        <v-app-bar color="primary" app dark>
      <v-app-bar-nav-icon v-if="user" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Store Vue</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="user" @click="logout" text dark>
        cerrar sesión
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-if="user" v-model="drawer" app>
       <v-list>
        <v-list-item :to="{ name: 'Home' }">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :to="{ name: child.redirecTo }"
            :key="child.title"
          >
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'

    export default {
        data() {
            return {
              drawer: false,
                 items: [
        {
          action: "mdi-silverware-fork-knife",
          active: true,
          title: "Almacén",
          administrador: true,
          almacenero: true,
          vendedor: null,
          items: [
            { title: "Categorias", redirecTo: "Category" },
            { title: "Articulos", redirecTo: "Article" },
          ],
        },
        {
          title: "Compras",
           administrador: true,
          almacenero: false,
          vendedor: true,
          action: "mdi-silverware-fork-knife",
          items: [
            { title: "Ingresos", redirecTo: "Income" },
            { title: "Proveedores", redirecTo: "Provider" },
          ],
        },
        {
          title: "Ventas",
          administrador: true,
          almacenero: true,
          vendedor: true,
          action: "mdi-silverware-fork-knife",
          items: [
            { title: "Ventas", redirecTo: "Invoice" },
            { title: "Clientes", redirecTo: "Client" },
          ],
        },
        {
          title: "Accesos",
          administrador: true,
          almacenero: null,
          vendedor: null,
          action: "mdi-silverware-fork-knife",
          items: [{ title: "Usuarios", redirecTo: "User" }],
        },
        {
          title: "Consultas",
          administrador: true,
          almacenero: true,
          vendedor: true,
          action: "mdi-silverware-fork-knife",
          items: [
            { title: "Consulta compras", redirecTo: "User" },
            { title: "Consulta ventas", redirecTo: "User" },
          ],
        },
      ],
            }
        },
        computed: {
          ...mapGetters('auth', ['user'])
        },
        methods: {
          ...mapActions('auth', ['logout'])
        },
    }
</script>

<style lang="scss" scoped>

</style>