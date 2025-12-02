<template>
  <v-app>
    <v-navigation-drawer 
      app 
      v-model="drawer" 
      image="../assets/background.png"
      class="text-white"
      permanent
    >
      <v-list nav>
        <v-list-item
            v-show="!$vuetify.display.mobile"
        >
          <v-img
            src="..\assets\indonet-logo.png"
            alt="Logo"
            contain
            max-width="150"
            class="mb-5 mt-1 ml-1"
          ></v-img>
        </v-list-item>
        <template v-for="(item, index) in items" :key="index">
          <v-list-group v-if="item.child" :value="item.title">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.child"
              :key="i"
              :title="child.title"
              :to="child.to"
            ></v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
          ></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      class="text-white"
      image="../assets/background2.png"
      prominent
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
          <v-img
              src="..\assets\indonet-logo.png"
              alt="Logo"
              contain
              max-width="150"
              v-show="$vuetify.display.mobile"
              class="mt-2"
          ></v-img>
      <v-spacer></v-spacer>
      <span class="mr-3" v-show="!$vuetify.display.mobile">Hi</span>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon  v-bind="props" variant="text">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon :icon="'mdi-export'"></v-icon>
            </template>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <v-breadcrumbs :items="breadcrumbs" class="mx-5">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :href="item.href">
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </template>
      
    </v-app-bar>
    <v-main>
        <router-view />
    </v-main>
  </v-app>
</template>
  
<script>
  export default {
    name: 'MainLayout',
    data() {
      return {
        drawer: true,
        breadcrumbs: [
          {
            text: '',
            href: ''
          }
        ],
        items: [
        {
          icon: 'mdi-sale-outline',
          title: 'Sales',
          child: [
            {
              title: 'Service Provider',
              to: {
                name: 'service-provider'
              }
            },
            {
              title: 'Services',
              to: {
                name: 'services'
              }
            }
          ]
        },
        {
          icon: 'mdi-finance',
          title: 'Finance',
          child: [
            {
              title: 'Billing',
              to: {
                name: 'billing'
              }
            },
            {
              title: 'Services',
              to: {
                name: 'services'
              }
            }
          ]
        },
        {
          icon: 'mdi-wrench',
          title: 'Technical',
          child: [
            {
              title: 'Provisioning',
              to: {
                name: 'provisioning'
              }
            }
          ]
        },
        {
          icon: 'mdi-shield-account',
          title: 'Master',
          child: [
            {
              title: 'User',
              to: {
                name: 'user'
              }
            },
            {
              title: 'Authentication',
              to: {
                name: 'authentication'
              }
            }
          ]
        }
      ]
      };
    },
    watch: {
      $route(to) {
        this.updateBreadcrumbs(to);
      }
    },
    mounted() {
      this.updateBreadcrumbs(this.$route);
    },
    methods: {
      updateBreadcrumbs(route) {
        // Split the breadcrumb string into parts
        const breadcrumbArray = route.meta.breadcrumb.split('/').filter(Boolean);
        // Split the route path into parts
        const pathArray = route.path.split('/').filter(Boolean);
        
        // Initialize an empty array for breadcrumbs
        const breadcrumbs = [];

        // Construct each breadcrumb part
        breadcrumbArray.forEach((text, index) => {
          const href = '/' + pathArray.slice(0, index + 1).join('/');
          breadcrumbs.push({
            text: text.charAt(0).toUpperCase() + text.slice(1), // Capitalize the text
            href: href
          });
        });

        // Update the breadcrumbs state
        this.breadcrumbs = breadcrumbs;
      }
    }
  }
</script>
<style>
.v-data-table__th{
  background-color: #CFD8DC;
}
</style>