<script setup lang='tsx'>
import { useRouter } from 'vue-router'

const router = useRouter()
const nestedRoute = router.resolveNestedRoute()
</script>

<template>
  <router-view
    v-slot="{ Component }"
    :route="nestedRoute"
  >
    <transition v-bind="$router.currentRouteTransitionProps.value">
      <keep-alive :include="$router.cachedComponentNames.value">
        <component
          :is="Component"
          :key="$router.getRouteKey()"
        />
      </keep-alive>
    </transition>
  </router-view>
</template>
