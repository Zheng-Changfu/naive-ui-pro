import type { ComputedRef } from 'vue'
import type { ProRouterPlugin } from '../plugin'
import { computed, getCurrentInstance, inject, toValue } from 'vue'
import { useRoute, viewDepthKey } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 是否作为嵌套路由渲染的终点，当设置为 true 时，该路由允许再自定义渲染嵌套的 router-view
     * @default false
     */
    nestedRouteRenderEnd?: boolean
  }

  interface Router {
    /**
     * 解析嵌套路由，传递给 router-view 的 route prop
     *
     * ***注意：该方法必须在 `setup` 钩子中调用！***
     */
    resolveNestedRoute: () => ComputedRef<RouteLocationNormalizedLoadedGeneric>
  }
}

export function nestedRouteRenderPlugin(): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    router.resolveNestedRoute = () => {
      const instance = getCurrentInstance()
      if (!instance) {
        throw new Error('resolveNestedRoute must be called in setup!')
      }

      const injectedViewDepth = inject(viewDepthKey, 0)
      const route = useRoute()

      return computed(() => {
        const viewDepth = toValue(injectedViewDepth)
        let foundRenderEnd = false

        return {
          ...route,
          matched: route.matched.map((item, index, arr) => {
            // 检查当前路由是否标记为渲染终点
            if (item.meta?.nestedRouteRenderEnd) {
              foundRenderEnd = true
            }

            // 如果已经找到渲染终点，则保留所有后续路由的组件
            if (foundRenderEnd) {
              return item
            }

            // 清除深度大于视图深度且不是最后一个的路由组件
            if (index > viewDepth && index !== arr.length - 1) {
              return {
                ...item,
                components: undefined,
              }
            }

            return item
          }),
        }
      })
    }

    onUnmount(() => {
      delete router.resolveNestedRoute
    })
  }
}
