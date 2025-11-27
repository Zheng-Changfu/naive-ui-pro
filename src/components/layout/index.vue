<script setup lang='tsx'>
import type { MenuOption } from 'naive-ui'
import type { ProLayoutMode } from 'pro-naive-ui'
import { isNil } from 'lodash-es'
import { useThemeVars } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useLayoutMenu } from 'pro-naive-ui'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/store/use-layout-store'
import { isSafari } from '@/utils/brower'
import { ProMenu } from '../menu'
import CollapseSidebarButton from './collapse-sidebar-button.vue'
import Content from './content.vue'
import Logo from './logo.vue'
import MobileSidebarDrawer from './mobile-sidebar-drawer.vue'
import NavLeft from './nav-left.vue'
import NavRight from './nav-right.vue'
import Tabbar from './tabbar.vue'

const route = useRoute()
const router = useRouter()
const vars = useThemeVars()
const safariPlatform = isSafari()

const {
  mode,
  mobile,
  showNav,
  showLogo,
  navFixed,
  navHeight,
  collapsed,
  showFooter,
  showTabbar,
  showSidebar,
  footerFixed,
  footerHeight,
  sidebarWidth,
  tabbarHeight,
  sidebarMenuGroup,
  sidebarMenuDivider,
  sidebarCollapsedWidth,
  sidebarCollapsedShowMenuTitle,
  sidebarCollapsedWidthWhenShowMenuTitle,
} = storeToRefs(useLayoutStore())

const {
  layout,
  fullKeys,
  activeKey,
  verticalLayout,
} = useLayoutMenu({
  mode,
  menus: computed(() => router.buildMenus()),
})

const finalShowSidebar = computed(() => {
  const verticalMenuOptions = layout.value.verticalMenuProps.options ?? []
  return showSidebar.value && verticalMenuOptions.length > 0
})

const showSidebarExtra = computed(() => {
  const verticalExtraMenuOptions = layout.value.verticalExtraMenuProps.options ?? []
  return verticalExtraMenuOptions.length > 0
})

const finalSidebarCollapsedWidth = computed(() => {
  return !sidebarCollapsedShowMenuTitle.value
    ? sidebarCollapsedWidth.value
    : sidebarCollapsedWidthWhenShowMenuTitle.value
})

const showSidebarCollapseButton = computed(() => {
  const layoutMode = mode.value as ProLayoutMode
  return layoutMode === 'vertical'
    || layoutMode === 'sidebar'
    || layoutMode === 'mixed-sidebar'
})

const showSidebarExtraCollapseButton = computed(() => {
  const layoutMode = mode.value as ProLayoutMode
  return layoutMode === 'two-column'
    || layoutMode === 'mixed-two-column'
})

watch(() => route.path, (path) => {
  if (activeKey.value === path) {
    return
  }
  const key = findAvailableMenuKey()
  if (isNil(key) && __DEV__) {
    console.warn('This looks like a bug, please open an issue to report this problem')
    return
  }
  activeKey.value = key!
}, { immediate: true })

function findAvailableMenuKey() {
  const keys = fullKeys.value
  for (let i = route.matched.length - 1; i >= 0; i--) {
    const item = route.matched[i]
    if (keys.includes(item.path)) {
      return item.path
    }
  }
}

function handleMenuGroupAndDivider(menus: MenuOption[] = []) {
  let finalMenus: MenuOption[] = menus
  // 处理菜单分割线
  if (sidebarMenuDivider.value) {
    finalMenus = finalMenus.flatMap((item) => {
      return item.children?.length ? [item, { type: 'divider' }] : [item]
    })
  }
  // 处理菜单分组
  if (sidebarMenuGroup.value) {
    if (collapsed.value) {
      finalMenus = finalMenus.flatMap((item) => {
        return item.children?.length ? [...item.children] : [item]
      })
    }
    else {
      finalMenus = finalMenus.map((item) => {
        return item.children?.length ? { ...item, type: 'group' } : item
      })
    }
  }
  return finalMenus
}

async function pushTo(path: string) {
  const failure = await router.push(path)
  if (failure) {
    // 跳转失败回退
    activeKey.value = route.path
  }
}
</script>

<template>
  <pro-layout
    v-model:collapsed="collapsed"
    :mode="mode"
    :is-mobile="mobile"
    :show-nav="showNav"
    :show-logo="showLogo"
    :nav-fixed="navFixed"
    :nav-height="navHeight"
    :show-footer="showFooter"
    :show-tabbar="showTabbar"
    :footer-fixed="footerFixed"
    :footer-height="footerHeight"
    :sidebar-width="sidebarWidth"
    :tabbar-height="tabbarHeight"
    :show-sidebar="finalShowSidebar"
    :show-sidebar-extra="showSidebarExtra"
    content-class="pro-layout__content--embedded p-16px"
    :sidebar-collapsed-width="finalSidebarCollapsedWidth"
    :scrollbar-props="{
      // @ts-ignore
      class: safariPlatform && 'pro-layout__scrollbar--safari',
    }"
  >
    <template #logo>
      <logo />
    </template>
    <template #nav-left>
      <nav-left />
      <mobile-sidebar-drawer :collapsed-width="finalSidebarCollapsedWidth">
        <n-scrollbar class="flex-[1_0_0]">
          <pro-menu
            v-bind="verticalLayout.verticalMenuProps"
            :indent="18"
            :collapsed-width="finalSidebarCollapsedWidth"
            :collapsed-show-title="sidebarCollapsedShowMenuTitle"
            :options="handleMenuGroupAndDivider(verticalLayout.verticalMenuProps.options)"
            @update:value="pushTo"
          />
        </n-scrollbar>
      </mobile-sidebar-drawer>
    </template>
    <template #nav-center>
      <div
        v-show="!mobile"
        class="flex items-center h-full"
      >
        <pro-menu
          v-bind="layout.horizontalMenuProps"
          :indent="18"
          @update:value="pushTo"
        />
      </div>
    </template>
    <template #nav-right>
      <nav-right />
    </template>
    <template #tabbar>
      <tabbar />
    </template>
    <template #sidebar>
      <div class="flex flex-col h-full">
        <n-scrollbar class="flex-[1_0_0]">
          <pro-menu
            v-bind="layout.verticalMenuProps"
            :indent="18"
            :collapsed-width="finalSidebarCollapsedWidth"
            :collapsed-show-title="sidebarCollapsedShowMenuTitle"
            :options="handleMenuGroupAndDivider(layout.verticalMenuProps.options)"
            @update:value="pushTo"
          />
        </n-scrollbar>
        <div
          v-if="showSidebarCollapseButton"
          class="flex p-8px"
        >
          <collapse-sidebar-button />
        </div>
      </div>
    </template>
    <template #sidebar-extra>
      <div class="flex flex-col h-full">
        <n-scrollbar class="flex-[1_0_0]">
          <pro-menu
            v-bind="layout.verticalExtraMenuProps"
            :indent="18"
            :collapsed-width="finalSidebarCollapsedWidth"
            :collapsed-show-title="sidebarCollapsedShowMenuTitle"
            :options="handleMenuGroupAndDivider(layout.verticalExtraMenuProps.options)"
            @update:value="pushTo"
          />
        </n-scrollbar>
        <div
          v-if="showSidebarExtraCollapseButton"
          class="flex p-8px"
        >
          <collapse-sidebar-button />
        </div>
      </div>
    </template>
    <template #default>
      <content />
    </template>
    <template #footer>
      <footer />
    </template>
  </pro-layout>
</template>

<style scoped lang="scss">
:deep(.n-pro-layout__content.pro-layout__content--embedded) {
  background-color: v-bind('vars.actionColor');
}

/**
 修复 safari 中 height:100% 无效问题
*/
:deep(.pro-layout__scrollbar--safari) {
  & > .n-scrollbar-container {
    display: flex;
    flex-direction: column;

    & > .n-scrollbar-content {
      flex-grow: 1;
      flex-basis: 0;
      min-height: auto;
    }
  }
}
</style>
