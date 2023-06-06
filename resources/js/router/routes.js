// General Routes
const Home = () => import('@pages/Home.vue');
const About = () => import('@pages/About.vue');
const Terms = () => import('@pages/Terms.vue');
const Dashboard = () => import('@pages/Dashboard.vue');
const Login = () => import('@pages/Login.vue');
const ForgotPassword = () => import('@pages/ForgotPassword.vue');
const ResetPassword = () => import('@pages/ResetPassword.vue');
const Register = () => import('@pages/Register.vue');
const VerifyEmail = () => import('@pages/VerifyEmail.vue');

const Settings = () => import('@pages/settings/Settings.vue');
const Profile = () => import('@pages/settings/Profile.vue');
const Password = () => import('@pages/settings/Password.vue');
const Account = () => import('@pages/settings/Account.vue');
const NotFound = () => import('@pages/NotFound.vue');

const AdminLayout = () => import('@/layouts/AdminLayout.vue');
const Admin = () => import('@/views/admin/Admin.vue');
const Users = () => import('@/views/admin/Users.vue');
const Roles = () => import('@/views/admin/Roles.vue');
const Permissions = () => import('@/views/admin/Permissions.vue');
const AppSettings = () => import('@/views/admin/AppSettings.vue');

import { defineAsyncComponent } from 'vue';

import auth from '@/middleware/auth';
import guest from '@/middleware/guest';
import roleAdmin from '@/middleware/roleAdmin';
import roleSuperAdmin from '@/middleware/roleSuperAdmin';
import roleUser from '@/middleware/roleUser';

export default [
  {
    path: '/',
    component: Home,
    name: 'home',
  },
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'dashboard',
    meta: {
      middleware: [auth],
    },
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'admin',
        component: Admin,
      },
      {
        path: 'users',
        name: 'users',
        component: Users,
      },
      {
        path: 'roles',
        name: 'roles',
        component: Roles,
      },
      {
        path: 'permissions',
        name: 'permissions',
        component: Permissions,
      },
      {
        path: 'phpinfo',
        name: 'phpinfo',
        component: defineAsyncComponent(() =>
          import('@/views/admin/PhpInfo.vue'),
        ),
      },
      {
        path: 'app-settings',
        name: 'app-settings',
        component: AppSettings,
      },
    ],
    meta: {
      middleware: [roleAdmin],
    },
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: {
      middleware: [guest],
    },
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    name: 'forgot-password',
    meta: {
      middleware: [guest],
    },
  },
  {
    path: '/reset-password/:token',
    props: (route) => ({
      token: route.params.token,
      email: route.query.email,
    }),
    component: ResetPassword,
    name: 'reset-password',
    meta: {
      middleware: [guest],
    },
  },
  {
    path: '/register',
    component: Register,
    name: 'register',
    meta: {
      middleware: [guest],
    },
  },
  {
    path: '/verify-email/:id/:hash',
    props: (route) => ({
      id: route.params.id,
      hash: route.params.hash,
    }),
    component: VerifyEmail,
    name: 'verify-email',
  },
  {
    path: '/settings',
    component: Settings,
    redirect: {
      name: 'account',
    },
    name: 'settings',
    meta: {
      middleware: [auth],
    },
    children: [
      {
        path: 'account',
        component: Account,
        name: 'account',
        meta: {
          middleware: [auth],
        },
      },
      {
        path: 'profile',
        component: Profile,
        name: 'profile',
        meta: {
          middleware: [auth],
        },
      },
      {
        path: 'password',
        component: Password,
        name: 'password',
        meta: {
          middleware: [auth],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    name: 'NotFound',
  },
];
