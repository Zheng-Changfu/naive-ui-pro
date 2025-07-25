<script setup lang='tsx'>
</script>

<template>
  <router-view
    v-slot="{ Component }"
    exact
  >
    <transition v-bind="$router.currentRouteTransitionProps.value">
      <keep-alive :include="$router.keepAliveList.value">
        <component
          :is="Component"
          :key="$router.getRouteKey()"
        />
      </keep-alive>
    </transition>
  </router-view>
</template>
