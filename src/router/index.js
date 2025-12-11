import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/stores/authStore";
import MainLayout from '../layouts/MyFlowLayout.vue';
import Dashboard from '../views/Dashboard.vue';
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
