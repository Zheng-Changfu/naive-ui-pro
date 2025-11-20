import type { ProRouterPlugin } from '../plugin'
import NProgress from 'nprogress'
import { nextTick, ref } from 'vue'
import { ROUTE_NAME } from '../symbols'
import { getRouteComponentName } from '../utils/route'
import 'nprogress/nprogress.css'

interface RouteKey {
  key: string
  timestamp?: number
}

interface RouteRefresh {
  /**
   * 刷新当前路由
   */
  (): void
  /**
   * 刷新指定 route.name 路由，需要在路由中定义 name
   */
  (routeName: string): void
  /**
   * 刷新指定 route.path 路由
   */
  (routePath: `/${string}`): void
}

declare module 'vue-router' {
  interface Router {
    /**
     * 获取 router-view 下 component 应该绑定的key
     */
    getRouteKey: () => string
    /**
     * 刷新 router-view 下指定的 component
     */
    refresh: RouteRefresh
  }
}

export function refreshPlugin(): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    const routeKeyMap = ref<Map<string, RouteKey>>(new Map())

    router.getRouteKey = () => {
      const to = router.currentRoute.value
      const name = getRouteComponentName(to) ?? to.meta[ROUTE_NAME].toString()
      if (!routeKeyMap.value.has(name)) {
        return
      }
      const { key, timestamp } = routeKeyMap.value.get(name)!
      return timestamp ? `${key}${timestamp}` : key
    }

    router.refresh = (routeNameOrRoutePath?: string) => {
      if (!routeNameOrRoutePath) {
        // 刷新当前路由
        const name = getRouteComponentName(router.currentRoute.value)
        const info = routeKeyMap.value.get(name)!
        routeKeyMap.value.set(name, { ...info, timestamp: Date.now() })
      }
      else {
        // 根据 name 或者 path 刷新路由
        const route = router.resolve(routeNameOrRoutePath)
        const name = getRouteComponentName(route)
        const info = routeKeyMap.value.get(name)
        if (!info) {
          return
        }
        routeKeyMap.value.set(name, { ...info, timestamp: Date.now() })
      }
      NProgress.start()
      nextTick(() => {
        NProgress.done()
      })
    }

    router.afterEach((to, _, failure) => {
      if (failure) {
        return
      }
      const toName = getRouteComponentName(to) ?? to.meta[ROUTE_NAME].toString()
      if (!toName || routeKeyMap.value.has(toName)) {
        return
      }
      routeKeyMap.value.set(toName, {
        ...(routeKeyMap.value.get(toName) ?? {}),
        key: toName,
      })
    })

    onUnmount(() => {
      delete router.refresh
      delete router.getRouteKey
    })

    return {
      onCleanup: () => {
        routeKeyMap.value.clear()
      },
    }
  }
}
