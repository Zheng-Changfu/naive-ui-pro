<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useThemeVars } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/store/use-layout-store'
import { useThemeStore } from '@/store/use-theme-store'
import { useContextMenu } from './composables/use-context-menu'
import { useScroll } from './composables/use-scroll'

const route = useRoute()
const router = useRouter()
const vars = useThemeVars()

const {
  routes,
  activeIndex,
  move,
  remove,
} = router.visitedRoutesPlugin

const {
  tabsMode,
} = storeToRefs(useLayoutStore())

const {
  primaryColors,
} = storeToRefs(useThemeStore())

const {
  tabsRef,
  handleWheel,
  scrollbarRef,
  scrollbarContainerCls,
} = useScroll()

const {
  showDropdown,
  dropdownPosition,
  handleContextMenu,
  handleDropdownSelect,
  createDropdownOptions,
} = useContextMenu()

async function handleUnFixed(index: number) {
  routes[index].meta.fixedInTabs = false
  const fixedCount = routes.filter(r => r.meta?.fixedInTabs).length
  await move(index, Math.max(0, fixedCount))
}

function onBeforeLeave(el: Element) {
  const dom = el as HTMLElement
  const { offsetLeft, offsetHeight } = dom

  Object.assign(dom.style, {
    position: 'absolute',
    left: `${offsetLeft}px`,
    height: `${offsetHeight}px`,
  })
}

watch(
  () => routes[activeIndex.value]?.path,
  async () => {
    const path = routes[activeIndex.value]?.path
    if (path && path !== route.path && path !== route.fullPath) {
      router.push(path)
    }
  },
)
</script>

<template>
  <n-scrollbar
    ref="scrollbarRef"
    x-scrollable
    :class="scrollbarContainerCls"
    :builtin-theme-overrides="{
      width: '0px',
      height: '0px',
      railColor: 'transparent',
    }"
    :content-style="{ height: '100%' }"
    @wheel.prevent="handleWheel"
  >
    <div
      ref="tabsRef"
      class="tabs"
      :class="[`tabs--${tabsMode}-theme`]"
    >
      <transition-group
        leave-to-class="translate-x--5 scale-95  opacity-0"
        enter-from-class="translate-x--5 scale-45 opacity-0"
        move-class="transition-[opacity,transform]! duration-300 ease"
        enter-active-class="transition-[opacity,transform] duration-300 ease"
        leave-active-class="transition-[opacity,transform] duration-300 ease"
        @before-leave="onBeforeLeave"
      >
        <div
          v-for="(tab, index) in routes"
          :key="tab.path"
          class="tabs__item"
          :class="{
            'tabs__item--active': activeIndex === index,
          }"
          @click="activeIndex = index"
          @contextmenu.prevent="handleContextMenu(index, $event)"
        >
          <icon
            v-if="tab.meta?.icon"
            :icon="tab.meta.icon"
            class="tabs__item__icon"
          />
          <span>{{ tab.meta?.titleI18nKey ? $t(tab.meta.titleI18nKey) : tab.meta?.title }}</span>
          <icon
            v-if="tab.meta?.fixedInTabs"
            class="tabs__item__extra"
            icon="mdi:pin-outline"
            @click.stop="handleUnFixed(index)"
          />
          <icon
            v-if="!tab.meta?.fixedInTabs && routes.length > 1"
            class="tabs__item__extra"
            icon="mdi:close"
            @click.stop="remove(index)"
          />
        </div>
      </transition-group>
    </div>
    <n-dropdown
      :show="showDropdown"
      :x="dropdownPosition.x"
      :y="dropdownPosition.y"
      placement="bottom-start"
      :options="createDropdownOptions()"
      @select="handleDropdownSelect"
      @clickoutside="showDropdown = false"
    />
  </n-scrollbar>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  padding: 0 14px;
  white-space: nowrap;

  &__item {
    position: relative;
    padding: 0 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition:
      color 0.3s ease,
      box-shadow 0.3s ease,
      background-color 0.3s ease;

    &:hover:not(.tabs__item--active) {
      background-color: v-bind('vars.hoverColor');
    }

    &__icon {
      margin-right: 6px;
    }

    &__extra {
      margin-left: 6px;
      color: v-bind('vars.textColor1');
    }

    &--active {
      background-color: v-bind('primaryColors[0]');
      color: v-bind('primaryColors[5]');
      .tabs__item__extra {
        color: v-bind('primaryColors[5]');
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
  }

  &--chrome-theme {
    padding-top: 4px;

    .tabs__item {
      border-radius: 12px 12px 0 0;

      &::before,
      &::after {
        position: absolute;
        bottom: 0;
        content: '';
        width: 20px;
        height: 20px;
        border-radius: 100%;
        box-shadow: 0 0 0 40px transparent;
        transition: box-shadow 0.3s ease;
      }

      &::before {
        left: -20px;
        clip-path: inset(50% -10px 0 50%);
      }

      &::after {
        right: -20px;
        clip-path: inset(50% 50% 0 -10px);
      }

      &--active {
        z-index: 1;

        &::before,
        &::after {
          box-shadow: 0 30px 0 30px v-bind('primaryColors[0]');
        }
      }
    }
  }

  &--card-theme {
    padding-top: 2px;
    padding-bottom: 2px;

    .tabs__item {
      margin-right: 8px;
      border-radius: v-bind('vars.borderRadius');
      border: 1px solid v-bind('vars.borderColor');

      &--active {
        border-color: v-bind('primaryColors[5]');
      }
    }
  }
}
</style>
