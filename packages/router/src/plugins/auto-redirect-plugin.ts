import type { MaybeRefOrGetter } from 'vue'
import type { NavigationGuardReturn, RouteLocationNormalizedGeneric } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { toValue } from 'vue'

interface AutoRedirectPluginOptions {
  /**
   * 当访问到根路由时，重定向到首页路由
   */
  homePath?: MaybeRefOrGetter<string>
  /**
   * 当可以被重定向时，重定向到指定路由，默认重定向到第一个子路由
   * @param to 当前路由
   * @returns 重定向后的路由
   */
  redirectTo?: (to: RouteLocationNormalizedGeneric) => NavigationGuardReturn
}

export function autoRedirectPlugin({
  homePath,
  redirectTo,
}: AutoRedirectPluginOptions = {}): ProRouterPlugin {
  return ({ router }) => {
    router.beforeResolve((to) => {
      const currentRoute = to.matched[to.matched.length - 1]
      if (
        homePath
        && !currentRoute.redirect
        && currentRoute.path === '/'
      ) {
        if (redirectTo) {
          return redirectTo(to)
        }
        const resolved = router.resolve(toValue(homePath))
        return {
          ...resolved,
          replace: true,
        }
      }
      if (
        !currentRoute.redirect
        && !currentRoute.components
        && currentRoute.children
        && currentRoute.children.length > 0
      ) {
        if (redirectTo) {
          return redirectTo(to)
        }
        const firstChildRoute = currentRoute.children[0]
        const resolved = router.resolve(firstChildRoute)
        return {
          ...resolved,
          replace: true,
        }
      }
    })
  }
}
