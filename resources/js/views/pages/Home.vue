<template>
  <div class="rounded-lg p-12 text-center">
    <div class="mb-5 flex items-center justify-between">
      <ChatBubbleLeftEllipsisIcon
        class="r-2 flex h-20 w-20 flex-1 justify-start text-indigo-400 dark:text-indigo-200"
      />
    </div>
    <h1 class="mb-5 text-4xl font-medium text-slate-700 dark:text-slate-100">
      Welcome{{ user && user.name ? ' ' + user.name : '' }}!
    </h1>
    <h4
      v-if="user && user.name"
      class="mb-5 text-2xl font-medium text-slate-700 dark:text-slate-100"
    >
      Thank you for being a member!
    </h4>
    <p class="mb-2 text-2xl text-slate-500 dark:text-slate-300">
      Laravel / Vite / Vue3 / TailwindCSS
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/outline';
import BmcButtons from '@components/BmcButtons.vue';
import PatreonButton from '@components/PatreonButton.vue';
import VultrReferral from '@components/VultrReferral.vue';

export default {
  name: 'Home',
  components: {
    ChatBubbleLeftEllipsisIcon,
    BmcButtons,
    VultrReferral,
    PatreonButton,
  },
  props: {
    enableVultrReferral: { type: Boolean, default: true },
    enableBmcButtons: { type: Boolean, default: true },
    enablePatreonButton: { type: Boolean, default: true },
  },
  data() {
    return {
      VULTR_REFERRAL_ENABLED: VULTR_REFERRAL_ENABLED, // eslint-disable-line
      VULTR_REFERRAL_LINK: VULTR_REFERRAL_LINK, // eslint-disable-line
    };
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user',
    }),
  },
};
</script>
