<template>
  <InternalLink class="home-tab" v-bind="$attrs">
    <template v-slot:prefix>
      <img class="logo" :src="`/2020/images/logo.svg`" />
    </template>
    <template v-slot:default>
      <p class="coscup">COSCUP</p>
      <p class="year">2020</p>
    </template>
  </InternalLink>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InternalLink from '../Basic/InternalLink.vue'

export default defineComponent({
  name: 'HomeTab',
  components: {
    InternalLink
  },
  setup () {
    return {}
  }
})
</script>

<style lang="scss">
@import "@/assets/scss/shared";

.home-tab {
  .navbar-item__prefix {
    display: flex;
    align-items: center;
  }

  .logo {
    display: inline-block;
    width: 2rem;
    height: auto;
    margin-right: 8px;
  }

  .coscup {
    font-weight: 900;
  }

  .year {
    margin-top: 4px;
    font-weight: 400 !important;
    font-size: 0.75rem !important;
    text-align: left;
    color: var(--color-text);
  }
}

@include smAndUp {
  .navbar-item-list {
    .home-tab .navbar-item-content {
      flex-direction: column;
    }
  }
}

@include xsOnly {
  .navbar-item-list {
    .home-tab {
      margin-right: auto;

      &:not(&::hover).active .navbar-item {
        background-color: transparent !important;
      }
    }
  }
}
</style>
