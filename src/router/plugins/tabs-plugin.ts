import type { ProRouterPlugin } from '@pro/router'
import type { RouteLocationNormalized } from 'vue-router'
import { getRouteComponentName, isEqualRoute } from '@pro/router'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store/use-layout-store'
import { ROOT_ROUTE_NAME } from '../routes'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 是否隐藏在多页签中
     */
    hideInTabs?: boolean
    /**
     * 是否固定在多页签中
     */
    fixedInTabs?: boolean
  }
}

/**
 * tabs 相关处理插件，这个插件与 admin 强关联，所以不放在 @pro/router 中
 */
export function tabsPlugin(): ProRouterPlugin {
  return ({ router }) => {
    const {
      tabsPersist,
      resetCacheAfterCloseTab,
    } = storeToRefs(useLayoutStore())

    const {
      routes,
      guards,
      activeIndex,
      move,
    } = router.visitedRoutesPlugin

    guards.beforeAdd((route) => {
      // 如果不是 layout 页面中的路由，则跳过添加
      if (route.matched[0].name !== ROOT_ROUTE_NAME) {
        return false
      }
      // 如果路由配置 hideInTabs，则跳过添加
      if (route.meta?.hideInTabs) {
        return false
      }
      return route
    })

    // 如果当前关闭的标签页是已固定的，则阻止关闭
    guards.beforeRemove((index) => {
      if (routes[index]?.meta?.fixedInTabs) {
        return false
      }
      return index
    })

    // 如果新增路由配置 fixedInTabs，则移动到固定区最后一项
    guards.afterAdd(async (route) => {
      if (route?.meta?.fixedInTabs) {
        const fixedCount = routes.filter(r => r.meta?.fixedInTabs).length - 1
        await move(routes.length - 1, Math.max(0, fixedCount))
      }
    })

    // 关闭标签页后重置缓存
    guards.afterRemove(([,removedRoute]) => {
      if (resetCacheAfterCloseTab.value) {
        const name = getRouteComponentName(removedRoute)
        const index = router.cachedComponentNames.value.indexOf(name!)
        if (~index) {
          // 这里要在路由跳转之后在执行删除，因为 keepAlivePlugin 缓存组件的时机是路由跳转之后，提前删除无效，因为 keepAlivePlugin 会重新添加上去
          const cleanup = router.afterEach(() => {
            router.cachedComponentNames.value.splice(index, 1)
            cleanup()
          })
        }
      }
    })

    // 标签页持久化
    if (tabsPersist.value) {
      const off = guards.beforeAdd((route) => {
        const [finalIndex, finalTabs] = resolveActiveIndexAndTabs(route)
        Object.assign(routes, finalTabs)
        activeIndex.value = finalIndex
        off()
        return false
      })
    }
    useEventListener('beforeunload', () => {
      // 需要 map 处理一下，matched 存在循环引用，导致 JSON.stringify 报错
      tabsPersist.value
        ? localStorage.setItem('tabs', JSON.stringify(routes.map(item => ({ ...item, matched: [] }))))
        : localStorage.removeItem('tabs')
    })
  }
}

function getTabsFromStorage(): RouteLocationNormalized[] {
  const tabs = localStorage.getItem('tabs')
  if (tabs) {
    return JSON.parse(tabs)
  }
  return []
}

function resolveActiveIndexAndTabs(route: RouteLocationNormalized): [number, RouteLocationNormalized[]] {
  const cachedTabs = getTabsFromStorage()
  const index = cachedTabs.findIndex(item => isEqualRoute(item, route))
  if (~index) {
    return [
      index,
      cachedTabs,
    ]
  }
  // 如果新增路由配置 fixedInTabs，则插到已有固定项之后，否则插到最末尾
  if (route.meta?.fixedInTabs) {
    const insertIndex = cachedTabs.findIndex(item => !item.meta?.fixedInTabs)
    if (~insertIndex) {
      cachedTabs.splice(insertIndex, 0, route)
      return [insertIndex, cachedTabs]
    }
    return [0, [route, ...cachedTabs]]
  }
  return [cachedTabs.length, [...cachedTabs, route]]
}
