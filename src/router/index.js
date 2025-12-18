import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/stores/authStore";
import MainLayout from '../layouts/MyFlowLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import CustomerList from '../views/CustomerList.vue';
import DeviceList from '../views/DeviceList.vue';
import DatacenterList from '../views/DatacenterList.vue';
import RackList from '../views/RackList.vue';
import VlanList from '../views/VlanList.vue';
import CrossConnectList from '../views/CrossConnectList.vue';
import FoList from '../views/FoList.vue';
import RouteGroupList from '../views/RouteGroupList.vue';
import RouteList from '../views/RouteList.vue';
import LocalLoopCreate from '../views/LocalLoopCreate.vue';
import InternetCreate from '../views/InternetCreate.vue';
import DocumentList from '../views/DocumentList.vue';
import KnowledgeList from '../views/KnowledgeList.vue';
import BackupConfigList from '../views/BackupConfigList.vue';
import GenerateConfig from '../views/GenerateConfig.vue';
import TaskList from '../views/TaskList.vue';

import Demo from '../views/Demo.vue';
import Login from '../views/Login.vue';
import Create from '../views/Create.vue';
import Details from '../views/Details.vue';
import Revision from '../views/Revision.vue';
import Profile from '../views/Profile.vue';

import Draft from '../views/Draft.vue';
import Suggestion from '../views/Suggestion.vue';
import NotFound from '../views/NotFound.vue';
import Services from '../views/Services.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { 
      authPage: true,
      breadcrumb: 'Login'
    }
  },
  {
    path: '/',
    name: 'Public',
    redirect: '/dashboard',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Dashboard - Monitoring'
          }],
        }
      },
      {
        path: 'customer-list',
        name: 'customer-list',
        component: CustomerList,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Inventory'
          },
          {
            to: '',
            text: 'Customer List'
          }],
        }
      },
      {
        path: 'device-list',
        name: 'device-list',
        component: DeviceList,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Inventory'
          },
          {
            to: '',
            text: 'Device List'
          }],
        }
      },
      {
        path: 'datacenter-list',
        name: 'datacenter-list',
        component: DatacenterList,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Inventory'
          },
          {
            to: '',
            text: 'Datacenter List'
          }],
        }
      },
      {
        path: 'rack-list',
        name: 'rack-list',
        component: RackList,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Inventory'
          },
          {
            to: '',
            text: 'Rack List'
          }],
        }
      },
      {
        path: 'vlan-list',
        name: 'vlan-list',
        component: VlanList,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Inventory'
          },
          {
            to: '',
            text: 'Virtual LAN List'
          }],
        }
      },
      {
        path: 'cross-connect-list',
        name: 'cross-connect-list',
        component: CrossConnectList,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Inventory'
          },
          {
            to: '',
            text: 'Cross Connect List'
          }],
        }
      },
      {
        path: 'fo-list',
        name: 'fo-list',
        component: FoList,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Inventory'
          },
          {
            to: '',
            text: 'FO List'
          }],
        }
      },
      {
        path: 'route-group-list',
        name: 'route-group-list',
        component: RouteGroupList,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Inventory'
          },
          {
            to: '',
            text: 'Route Group List'
          }],
        }
      },
      {
        path: 'route-list',
        name: 'route-list',
        component: RouteList,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '',
            text: 'Inventory'
          },
          {
            to: '',
            text: 'Route List'
          }],
        }
      },
      {
        path: 'local-loop-create',
        name: 'local-loop-create',
        component: LocalLoopCreate,
        meta: {
          breadCrumb: [{
            to: '',
            text: 'Services'
          },
          {
            to: '',
            text: 'Local Loop'
          }]
        }
      },
      {
        path: 'internet-create',
        name: 'internet-create',
        component: InternetCreate,
        meta: {
          breadCrumb: [{
            to: '',
            text: 'Services'
          },
          {
            to: '',
            text: 'Internet'
          }]
        }
      },
      {
        path: 'document-list',
        name: 'document-list',
        component: DocumentList,
        meta: {
          breadCrumb: [{
            to: '',
            text: 'Document List'
          }]
        }
      },
      {
        path: 'knowledge-list',
        name: 'knowledge-list',
        component: KnowledgeList,
        meta: {
          breadCrumb: [{
            to: '',
            text: 'Knowledge List'
          }]
        }
      },
      {
        path: 'backup-config-list',
        name: 'backup-config-list',
        component: BackupConfigList,
        meta: {
          breadCrumb: [{
            to: '',
            text: 'Configutation'
          },
          {
            to: '/create',
            text: 'Backup Config List'
          }]
        }
      },
      {
        path: 'general-config-list',
        name: 'general-config-list',
        component: GenerateConfig,
        meta: {
          breadCrumb: [{
            to: '',
            text: 'Configutation'
          },
          {
            to: '/create',
            text: 'General Config List'
          }]
        }
      },
      {
        path: 'task-list',
        name: 'task-list',
        component: TaskList,
        meta: {
          breadCrumb: [{
            to: '',
            text: 'Task List'
          }]
        }
      },
      {
        path: 'create',
        name: 'create',
        component: Create,
        meta: {
          breadCrumb: [{
            to: '/dashboard',
            text: 'Dashboard'
          },
          {
            to: '/create',
            text: 'Create My Flow'
          }]
        }
      },
      {
        path: 'services',
        name: 'services',
        component: Services,
        meta: {
          requiresAuth: true,
          breadCrumb: [{
            to: '/dashboard',
            text: 'Dashboard'
          },
          {
            to: '',
            text: 'Services'
          }]
        }
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
        meta: {
          requiresAuth: true,
          breadCrumb: [{
            to: '/dashboard',
            text: 'Dashboard'
          },
          {
            to: '',
            text: 'Profile'
          }]
        }
      },
      {
        path: 'demo',
        name: 'demo',
        component: Demo,
        meta: {
          requiresAuth: true,
          breadCrumb: [{
            to: '/dashboard',
            text: 'Dashboard'
          },
          {
            to: '',
            text: 'Demo'
          }]
        }
      },
      {
        path: 'suggestion',
        name: 'suggestion',
        component: Suggestion,
        meta: {
          // requiresAuth: true,
          breadCrumb: [{
            to: '/dashboard',
            text: 'Dashboard'
          },
          {
            to: '',
            text: 'Suggestion'
          }]
        }
      },
      {
        path: 'notfound',
        name: 'notfound',
        component: NotFound,
        meta: {
          breadCrumb: [{
            to: '/dashboard',
            text: 'Dashboard'
          },
          {
            to: '',
            text: 'Not Found'
          }]
        }
      },
      {
        path: 'revision/:id',
        name: 'revision',
        component: Revision,
        meta: {
          requiresAuth: true,
          breadCrumb: [{
            to: '/dashboard',
            text: 'Dashboard'
          },
          {
            to: '',
            text: 'Revision'
          }]
        }
      },
      {
        path: 'draft/:id',
        name: 'draft',
        component: Draft,
        meta: {
          requiresAuth: true,
          breadCrumb: [{
            to: '/dashboard',
            text: 'Dashboard'
          },
          {
            to: '',
            text: 'Draft'
          }]
        }
      },
      {
        path: 'details/:id',  // Tambahkan :id sebagai parameter dinamis
        name: 'details',
        component: Details,
        meta: {
          breadCrumb: [
            {
              to: '/dashboard',
              text: 'Dashboard'
            },
            {
              to: '',
              text: 'Details'
            }
          ]
        }
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth) {
    if (auth.isAuthenticated) {
      next();
    } else {
      next("/login");
    }
  } else if (to.meta.authPage) {
    if (!auth.isAuthenticated) {
      next();
    } else {
        next("/dashboard"); // Selain itu, arahkan ke dashboard
    }
  } else {
    next(); // Kalau tidak ada meta requiresAuth atau authPage, tetap lanjut
  }
});


export default router;
