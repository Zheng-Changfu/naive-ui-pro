<script setup lang='tsx'>
import type { ProLayoutMode } from 'pro-naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { $t } from '@/locales/locales'
import { useLayoutStore } from '@/store/use-layout-store'

const {
  mode,
  showNav,
  tabsMode,
  showLogo,
  navFixed,
  navHeight,
  collapsed,
  showTabbar,
  showFooter,
  tabsPersist,
  showSidebar,
  footerFixed,
  footerHeight,
  tabbarHeight,
  sidebarWidth,
  sidebarMenuGroup,
  sidebarMenuDivider,
  sidebarCollapsedWidth,
  resetCacheAfterCloseTab,
  sidebarCollapsedShowMenuTitle,
} = storeToRefs(useLayoutStore())

const tabsModeOptions = computed(() => [
  { label: $t('common.preference.layout.chrome'), value: 'chrome' },
  { label: $t('common.preference.layout.card'), value: 'card' },
])

const layoutOptions = computed<Array<{ label: string, value: ProLayoutMode }>>(() => [
  { label: $t('common.preference.layout.vertical'), value: 'vertical' },
  { label: $t('common.preference.layout.horizontal'), value: 'horizontal' },
  { label: $t('common.preference.layout.mixedTwoColumn'), value: 'mixed-two-column' },
  { label: $t('common.preference.layout.sidebar'), value: 'sidebar' },
  { label: $t('common.preference.layout.mixedSidebar'), value: 'mixed-sidebar' },
  { label: $t('common.preference.layout.fullContent'), value: 'full-content' },
  { label: $t('common.preference.layout.twoColumn'), value: 'two-column' },
])
</script>

<template>
  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="preference-item">
      <span>{{ $t('common.preference.layout.showLogo') }}</span>
      <n-switch v-model:value="showLogo" />
    </div>
    <div class="preference-item">
      <span>{{ $t('common.preference.layout.layoutMode') }}</span>
      <n-select
        v-model:value="mode"
        class="w-150px"
        :options="layoutOptions"
      />
    </div>
    <div class="preference-item">
      <span>{{ $t('common.preference.layout.menuGroup') }}</span>
      <n-switch v-model:value="sidebarMenuGroup" />
    </div>
    <div class="preference-item">
      <span>{{ $t('common.preference.layout.menuDivider') }}</span>
      <n-switch v-model:value="sidebarMenuDivider" />
    </div>
  </n-flex>

  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="font-bold text-16px">
      {{ $t('common.preference.layout.header') }}
    </div>
    <n-flex
      vertical
      :size="12"
      class="pl-8px"
    >
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.showHeader') }}</span>
        <n-switch v-model:value="showNav" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.fixedHeader') }}</span>
        <n-switch v-model:value="navFixed" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.headerHeight') }}</span>
        <n-input-number
          v-model:value="navHeight"
          class="w-120px"
        />
      </div>
    </n-flex>
  </n-flex>

  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="font-bold text-16px">
      {{ $t('common.preference.layout.tabbar') }}
    </div>
    <n-flex
      vertical
      :size="12"
      class="pl-8px"
    >
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.showTabbar') }}</span>
        <n-switch v-model:value="showTabbar" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.tabsPersist') }}</span>
        <n-switch v-model:value="tabsPersist" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.resetCacheAfterCloseTab') }}</span>
        <n-switch v-model:value="resetCacheAfterCloseTab" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.tabbarHeight') }}</span>
        <n-input-number
          v-model:value="tabbarHeight"
          class="w-120px"
        />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.tabsMode') }}</span>
        <n-select
          v-model:value="tabsMode"
          class="w-120px"
          :options="tabsModeOptions"
        />
      </div>
    </n-flex>
  </n-flex>

  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="font-bold text-16px">
      {{ $t('common.preference.layout.sidebar') }}
    </div>
    <n-flex
      vertical
      :size="12"
      class="pl-8px"
    >
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.showSidebar') }}</span>
        <n-switch v-model:value="showSidebar" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.sidebarCollapsed') }}</span>
        <n-switch v-model:value="collapsed" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.showMenuTitle') }}</span>
        <n-switch v-model:value="sidebarCollapsedShowMenuTitle" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.sidebarWidth') }}</span>
        <n-input-number
          v-model:value="sidebarWidth"
          class="w-120px"
        />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.collapsedWidth') }}</span>
        <n-input-number
          v-model:value="sidebarCollapsedWidth"
          class="w-120px"
        />
      </div>
    </n-flex>
  </n-flex>

  <n-flex
    vertical
    :size="12"
    class="my-24px"
  >
    <div class="font-bold text-16px">
      {{ $t('common.preference.layout.footer') }}
    </div>
    <n-flex
      vertical
      :size="12"
      class="pl-8px"
    >
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.showFooter') }}</span>
        <n-switch v-model:value="showFooter" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.fixedFooter') }}</span>
        <n-switch v-model:value="footerFixed" />
      </div>
      <div class="preference-item">
        <span>{{ $t('common.preference.layout.footerHeight') }}</span>
        <n-input-number
          v-model:value="footerHeight"
          class="w-120px"
        />
      </div>
    </n-flex>
  </n-flex>
</template>
