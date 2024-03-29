<template>
  <Popover class="relative bg-white dark:bg-slate-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div
        class="flex items-center justify-between border-b-2 border-gray-100 py-6 dark:border-slate-700 md:justify-start md:space-x-10"
      >
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link :to="{ name: 'home' }" @click="closeDrop">
            <span class="sr-only">{{ appName }}</span>
            <svg
              viewBox="0 0 50 31"
              class="h-6 w-auto text-indigo-500 dark:text-indigo-300"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.381 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.483-3.329-1.883-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z"
                fill="currentColor"
              ></path>
            </svg>
          </router-link>
        </div>
        <div class="-my-2 -mr-2 md:hidden">
          <PopoverButton
            class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-slate-800 dark:hover:bg-slate-800"
            @click="openDrop"
          >
            <span class="sr-only">Open menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </PopoverButton>
        </div>
        <PopoverGroup as="nav" class="hidden space-x-10 md:flex">
          <router-link
            v-if="authenticated && roles && (roles.admin || roles.superAdmin)"
            v-slot="{ isActive }"
            :to="{ name: 'admin' }"
            class="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400"
            @click="closeDrop"
          >
            <span
              :class="[
                isActive &&
                  'cursor-default text-gray-800 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-500',
              ]"
            >
              <BuildingLibraryIcon class="float-left mr-2 h-6 w-6" />
            </span>
          </router-link>

          <router-link
            v-if="authenticated"
            v-slot="{ isActive }"
            :to="{ name: 'dashboard' }"
            class="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400"
            @click="closeDrop"
          >
            <span
              :class="[
                isActive &&
                  'cursor-default text-gray-800 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-500',
              ]"
            >
              <HomeIcon class="float-left mr-2 h-6 w-6" />
            </span>
          </router-link>
        </PopoverGroup>
        <div
          v-if="authenticated && user"
          class="hidden items-center justify-end md:flex md:flex-1 lg:w-0"
        >
          <AppButton
            v-if="isImpersonating"
            v-tippy="'Return to your account'"
            icon="fa-solid fa-user-secret"
            class="float-right mr-4 h-3 w-3 rounded"
            style="background: transparent !important"
            @click="leaveImpersonating"
          />

          <span
            v-tippy="'Toggle Theme ' + (user.theme_dark ? 'Light' : 'Dark')"
            class="mr-2"
            :class="
              loading ? 'default disabled cursor-pointer' : 'cursor-pointer'
            "
            @click="toggleTheme()"
          >
            <Switch
              :default-checked="user.theme_dark"
              :class="user.theme_dark ? 'bg-gray-500' : 'bg-gray-400'"
              class="relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <span class="sr-only">Toggle Theme</span>
              <span
                aria-hidden="true"
                :class="
                  user.theme_dark
                    ? 'translate-x-4 bg-gray-800'
                    : 'translate-x-0 bg-white'
                "
                class="pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out"
              />
            </Switch>
          </span>
          <div ref="dropMenu" class="relative">
            <div
              class="cursor-pointer items-center p-3 text-base font-medium tracking-wider text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400"
              @click="drop = !drop"
            >
              {{ user && user.name ? user.name : '' }}
              <!--
              <span
                v-if="user.email_verified_at"
                v-tippy="
                  'Email Verified on ' +
                  parseDisplayDate(user.email_verified_at)
                "
                class="fa-solid fa-check-circle fa-xs text-green-500"
                style="position: absolute; top: 12px; right: 38px"
              />
              -->
              <span
                v-if="!user.email_verified_at"
                v-tippy="'Email Not Verified'"
                class="fa-solid fa-exclamation-circle fa-xs text-orange-600"
                style="position: absolute; top: 12px; right: 38px"
              />

              <img
                v-if="user && user.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="float-right ml-2 mt-0 h-6 w-6 rounded-full"
              />
              <UserCircleIcon v-else class="float-right ml-2 mt-0 h-6 w-6" />
            </div>

            <div
              v-show="drop"
              class="absolute right-5 z-10 flex w-auto flex-col whitespace-nowrap rounded border bg-white shadow-md dark:bg-slate-900"
              @click="drop = !drop"
            >
              <router-link
                v-if="
                  authenticated && roles && (roles.admin || roles.superAdmin)
                "
                v-slot="{ isActive }"
                :to="{ name: 'admin' }"
              >
                <span
                  class="flex items-center rounded-t p-4 pr-10 pl-8 hover:bg-slate-800 hover:text-white"
                  :class="
                    isActive
                      ? 'cursor-default whitespace-nowrap bg-slate-500 text-white'
                      : 'text-gray-700'
                  "
                >
                  <BuildingLibraryIcon class="mr-2 h-6 w-6" />
                  Admin
                </span>
              </router-link>
              <router-link
                v-if="authenticated"
                v-slot="{ isActive }"
                :to="{ name: 'dashboard' }"
              >
                <span
                  class="flex items-center p-4 pr-10 pl-8 hover:bg-slate-800 hover:text-white"
                  :class="
                    isActive
                      ? roles && (roles.admin || roles.superAdmin)
                        ? 'cursor-default whitespace-nowrap bg-slate-500 text-white'
                        : 'cursor-default whitespace-nowrap rounded-t bg-slate-500 text-white'
                      : roles && (roles.admin || roles.superAdmin)
                      ? 'text-gray-700'
                      : 'rounded-t text-gray-700'
                  "
                >
                  <HomeIcon class="mr-2 h-6 w-6" />
                  Dashboard
                </span>
              </router-link>

              <router-link
                v-if="authenticated"
                v-slot="{ isActive }"
                :to="{ name: 'settings' }"
              >
                <span
                  class="flex items-center p-4 pr-10 pl-8 hover:bg-slate-800 hover:text-white"
                  :class="
                    isActive
                      ? 'cursor-default whitespace-nowrap bg-slate-500 text-white'
                      : 'text-gray-700'
                  "
                >
                  <CogIcon class="mr-2 h-6 w-6" />
                  Settings
                </span>
              </router-link>

              <div
                class="flex cursor-pointer items-center rounded-b p-4 pr-10 pl-8 text-gray-700 hover:bg-slate-800 hover:text-white"
                @click.prevent="logout(), closeDrop()"
              >
                <ArrowLeftOnRectangleIcon
                  class="mr-2 h-6 w-6"
                ></ArrowLeftOnRectangleIcon>
                Logout
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="!authenticated"
          class="hidden items-center justify-end md:flex md:flex-1 lg:w-0"
        >
          <router-link
            v-slot="{ isActive }"
            :to="{ name: 'login' }"
            class="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400"
            @click="closeDrop"
          >
            <span
              :class="[
                isActive &&
                  'cursor-default text-gray-800 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-500',
              ]"
            >
              Sign in
            </span>
          </router-link>

          <router-link
            v-slot="{ isActive }"
            :to="{ name: 'register' }"
            @click="closeDrop"
          >
            <AppButton
              primary
              text="Sign Up"
              class="ml-8"
              :class="[isActive && 'opacity-60']"
            />
          </router-link>
        </div>
      </div>
    </div>
    <transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <PopoverPanel
        v-show="drop"
        v-slot="{ close }"
        focus
        class="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
      >
        <div
          class="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:divide-gray-700 dark:bg-slate-900"
        >
          <div class="px-5 pt-5 pb-6">
            <div class="flex items-center justify-between">
              <div>
                <!-- <img class="h-8 w-auto" :src="logo" :alt="appName" /> -->
                <span class="sr-only">{{ appName }}</span>

                <router-link
                  v-slot="{ isActive }"
                  :to="{ name: 'home' }"
                  @click="close"
                >
                  <svg viewBox="0 0 50 31" class="h-6 w-auto text-indigo-500">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.381 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.483-3.329-1.883-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </router-link>
              </div>
              <div class="-mr-2">
                <PopoverButton
                  class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-slate-800"
                >
                  <span class="sr-only">Close menu</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </PopoverButton>
              </div>
            </div>
          </div>
          <div class="space-y-6 py-6 px-5">
            <div class="">
              <div
                v-if="
                  authenticated && roles && (roles.admin || roles.superAdmin)
                "
                class="mb-6 text-left"
              >
                <router-link
                  v-slot="{ isActive }"
                  :to="{ name: 'admin' }"
                  class="text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                  @click="close"
                >
                  <span
                    :class="[
                      isActive &&
                        'text-gray-800 hover:text-gray-900 dark:text-gray-600',
                    ]"
                  >
                    <HomeIcon class="float-left mr-2 h-6 w-6" /> Admin
                  </span>
                </router-link>
              </div>

              <div v-if="authenticated" class="mb-6 text-left">
                <router-link
                  v-slot="{ isActive }"
                  :to="{ name: 'dashboard' }"
                  class="text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                  @click="close"
                >
                  <span
                    :class="[
                      isActive &&
                        'text-gray-800 hover:text-gray-900 dark:text-gray-600',
                    ]"
                  >
                    <HomeIcon class="float-left mr-2 h-6 w-6" /> Dashboard
                  </span>
                </router-link>
              </div>

              <div class="mb-7 text-left">
                <router-link
                  v-if="authenticated"
                  v-slot="{ isActive }"
                  :to="{ name: 'settings' }"
                  class="text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                  @click="close"
                >
                  <span
                    :class="[
                      isActive &&
                        'text-gray-800 hover:text-gray-900 dark:text-gray-600',
                    ]"
                  >
                    <CogIcon class="float-left mr-2 h-6 w-6" />
                    Settings
                  </span>
                </router-link>
              </div>

              <div
                v-if="authenticated && user"
                class="mr-2 mb-10"
                :class="
                  loading ? 'default disabled cursor-pointer' : 'cursor-pointer'
                "
                @click="toggleTheme()"
              >
                <Switch
                  :default-checked="user.theme_dark"
                  :class="user.theme_dark ? 'bg-gray-500' : 'bg-gray-400'"
                  class="relative inline-flex h-[18px] w-[30px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                  <span class="sr-only">Toggle Theme</span>
                  <span
                    aria-hidden="true"
                    :class="
                      user.theme_dark
                        ? 'translate-x-3 bg-gray-800'
                        : 'translate-x-0 bg-white'
                    "
                    class="pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out"
                  />
                </Switch>
                <span
                  class="text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Toggle Theme {{ user.theme_dark ? 'Light' : 'Dark' }}
                </span>
              </div>

              <div
                v-if="isImpersonating && authenticated"
                class="mb-8 text-left"
                style="margin-top: -0.5em"
              >
                <div
                  class="cursor-pointer text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                  @click="leaveImpersonating(), close()"
                >
                  <span class="fa-solid fa-user-secret fa-fw mr-2 ml-1" />
                  Return to your account
                </div>
              </div>
            </div>
            <div v-if="!authenticated">
              <router-link v-slot="{ isActive }" :to="{ name: 'register' }">
                <AppButton
                  primary
                  text="Sign up"
                  class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                  :class="[isActive && 'opacity-60']"
                  @click="close"
                />
              </router-link>
              <p class="mt-6 text-center text-base font-medium text-gray-500">
                Existing customer?
                {{ ' ' }}
                <router-link
                  v-slot="{ isActive }"
                  :to="{ name: 'login' }"
                  class="whitespace-nowrap text-base font-medium text-indigo-500 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-400"
                  @click="close"
                >
                  <span
                    :class="[
                      isActive &&
                        'text-indigo-800 hover:text-indigo-900 dark:text-indigo-500 dark:hover:text-indigo-500',
                    ]"
                  >
                    Sign in
                  </span>
                </router-link>
              </p>
            </div>
            <div v-if="authenticated">
              <AppButton
                primary
                text="Logout"
                type="button"
                class="flex w-full items-center justify-center px-4 py-2"
                @click.prevent="logout(), closeDrop()"
              >
                <template #text>
                  <ArrowLeftOnRectangleIcon
                    class="mr-2 h-6 w-6"
                  ></ArrowLeftOnRectangleIcon>
                  Logout
                </template>
              </AppButton>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { parseDisplayDate } from '@services/common';
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Switch,
} from '@headlessui/vue';
import {
  Bars3Icon,
  HomeIcon,
  BuildingLibraryIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  XMarkIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline';

export default {
  name: 'AppNav',
  components: {
    HomeIcon,
    BuildingLibraryIcon,
    InformationCircleIcon,
    DocumentTextIcon,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    Bars3Icon,
    XMarkIcon,
    CogIcon,
    ArrowLeftOnRectangleIcon,
    ChevronDownIcon,
    UserCircleIcon,
    Switch, // eslint-disable-line
  },
  props: {},
  data() {
    return {
      appName: 'Workflow',
      // logo: "https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600",
      drop: false,
      errors: null,
      success: '',
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user',
      roles: 'auth/roles',
      currentUserToken: 'auth/currentUserToken',
      impersonatorToken: 'auth/impersonatorToken',
    }),
    isImpersonating() {
      if (this.currentUserToken && this.impersonatorToken) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout',
      updateTheme: 'auth/theme',
      popToast: 'toast/popToast',
      leaveImpersonatingUser: 'auth/leaveImpersonatingUser',
    }),
    parseDisplayDate,
    closeDrop() {
      this.drop = false;
    },
    openDrop() {
      this.drop = true;
    },
    async toggleTheme() {
      this.loading = true;
      this.errors = null;
      this.success = '';
      try {
        await this.updateTheme({ theme_dark: !this.user.theme_dark }).then(
          (response) => {
            if (
              response &&
              response.data &&
              response.data.user &&
              response.data.user.id
            ) {
              this.popToast({
                message: 'Theme Saved',
                timer: 2000,
                icon: 'success',
              });
            }
          },
        );
      } catch (e) {
        this.errors = e.data;
        this.popToast({
          message: 'Error Updating Theme',
          timer: 5000,
          icon: 'error',
        });
      }
      this.loading = false;
    },
    async leaveImpersonating() {
      try {
        await this.leaveImpersonatingUser().then((response) => {
          //
        });
      } catch (e) {
        this.popToast({
          message: 'Unable To Return To Yourself',
          timer: 5000,
          icon: 'error',
        });
      }
    },
  },
};
</script>

<style scoped></style>
<style lang="scss" scoped></style>
