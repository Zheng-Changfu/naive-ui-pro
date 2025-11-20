import type { EventHookOn } from '@vueuse/core'
import type { Merge } from 'type-fest'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { createEventHook } from '@vueuse/core'
import { cloneDeep, noop } from 'lodash-es'
import { mapTree } from 'pro-composables'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 当前路由可以被哪些角色访问，如果为空，则表示所有角色都可以访问，只在前端权限控制模式下有效
     */
    roles?: string[]
    /**
     * 是否需要权限控制，如果为 false，则表示不需要权限控制，访问这些路由时不需要登录
     * @default true
     */
    requiresAuth?: boolean
  }
}

type MaybePromise<T> = T | Promise<T>

export type RouteRecordRawWithStringComponent = Merge<RouteRecordRaw, {
  component?: string
  children?: RouteRecordRawWithStringComponent[]
}>

type ResolveComponent = (component: string) => NonNullable<RouteRecordRaw['component']>

export interface BaseServiceReturned {
  /**
   * 首页路径，已登录跳转 login 页面，重定向到 redirect 参数或者 homePath
   * @default '/home'
   */
  homePath?: string
  /**
   * 登录路径，未登录会跳转到此路径
   * @default '/login'
   */
  loginPath?: string
  /**
   * 是否已登录
   */
  logined: boolean
  /**
   * 添加路由时的父级路由名称，设置后使用 router.addRoute(parentNameForAddRoute,routes)，默认使用 router.addRoute(routes)
   */
  parentNameForAddRoute?: string
  /**
   * 路由构建完成后回调
   * @param routes 构建后最终的 vue-router 路由
   */
  onRoutesBuilt?: (routes: RouteRecordRaw[]) => void
}

export interface BackendServiceReturned extends BaseServiceReturned {
  /**
   * 权限模式为后端权限控制
   */
  mode: 'backend'
  /**
   * routes 中的组件名称是字符串，外部需要将字符串解析成组件
   */
  resolveComponent: ResolveComponent
  /**
   * 需要动态生成的路由列表
   */
  fetchRoutes: () => MaybePromise<RouteRecordRawWithStringComponent[]>
}

export interface FrontendServiceReturned extends BaseServiceReturned {
  /**
   * 权限模式为前端权限控制
   */
  mode: 'frontend'
  /**
   * 当前用户角色，如果为空，不过滤路由
   * @default []
   */
  roles: string[]
  /**
   * 需要动态生成的路由列表，会根据角色过滤路由
   */
  routes: RouteRecordRaw[]
}

export interface RbacAccessPluginOptions {
  service: () => MaybePromise<BackendServiceReturned | FrontendServiceReturned>
}

export function rbacAccessPlugin(options: RbacAccessPluginOptions): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    const { on: onCleanup, trigger: cleanup } = createEventHook()

    router.beforeEach(async (to) => {
      const resolvedOptions = await resolveOptions(options)
      const replaceAgain = await resolveRoutes(resolvedOptions, {
        router,
        onCleanup,
      })

      if (replaceAgain) {
        // 新注册的路由需再次访问
        return {
          path: to.path,
          replace: true,
          query: to.query,
        }
      }

      const {
        logined,
        homePath,
        loginPath,
      } = resolvedOptions

      // 已登录跳转 login 页面，重定向到 redirect 参数或者 homePath
      if (logined && to.path === loginPath) {
        const path = to.query.redirect ?? homePath
        return path as string
      }

      // 如果是不需要鉴权的路由则放行
      if (to.meta?.requiresAuth === false) {
        return
      }

      // 未登录重定向到登录页
      if (!logined) {
        return {
          path: loginPath,
          query: {
            redirect: to.fullPath,
          },
        }
      }
    })

    onUnmount(() => {
      cleanup()
    })

    return {
      onCleanup: cleanup,
    }
  }
}

async function resolveOptions(
  options: RbacAccessPluginOptions,
): Promise<Required<BackendServiceReturned | FrontendServiceReturned>> {
  const {
    homePath,
    loginPath,
    onRoutesBuilt,
    parentNameForAddRoute,
    ...rest
  } = await options.service()
  return {
    ...rest,
    homePath: homePath ?? '/home',
    loginPath: loginPath ?? '/login',
    onRoutesBuilt: onRoutesBuilt ?? noop,
    parentNameForAddRoute: parentNameForAddRoute ?? null,
  }
}

let registeredRoutes = false
const removeRouteHandlers: (() => void)[] = []
async function resolveRoutes(
  options: Required<BackendServiceReturned | FrontendServiceReturned>,
  { router, onCleanup }: {
    router: Router
    onCleanup: EventHookOn
  },
) {
  const {
    mode,
    logined,
    parentNameForAddRoute,
  } = options

  if (registeredRoutes || !logined) {
    return
  }

  const finalRoutes = await buildRoutes({
    mode,
    roles: (options as any).roles ?? [],
    routes: (options as any).routes ?? [],
    resolveComponent: (options as any).resolveComponent,
    fetchRoutes: (options as any).fetchRoutes ?? (() => []),
  })

  options.onRoutesBuilt(finalRoutes)

  finalRoutes.forEach((route) => {
    removeRouteHandlers.push(
      parentNameForAddRoute
        ? router.addRoute(parentNameForAddRoute, route)
        : router.addRoute(route),
    )
  })

  registeredRoutes = true

  onCleanup(() => {
    registeredRoutes = false
    removeRouteHandlers.forEach(removeRoute => removeRoute())
    removeRouteHandlers.length = 0
  })

  return registeredRoutes
}

function buildRoutes(options: {
  roles: string[]
  routes: RouteRecordRaw[]
  mode: 'frontend' | 'backend'
  resolveComponent?: ResolveComponent | void
  fetchRoutes: () => MaybePromise<RouteRecordRawWithStringComponent[]>
}) {
  return options.mode === 'frontend'
    ? buildRoutesByFrontend(
        options.routes,
        options.roles,
      )
    : buildRoutesByBackend(
        options.fetchRoutes,
        options.resolveComponent as ResolveComponent,
      )
}

function buildRoutesByFrontend(
  routes: RouteRecordRaw[],
  roles: string[],
): RouteRecordRaw[] {
  routes = cloneDeep(routes)
  const hasAuth = (route: RouteRecordRaw) => {
    const routeRoles = route.meta?.roles ?? []
    if (routeRoles.length <= 0) {
      // 如果没有设置 roles，则表示所有角色都可以访问
      return true
    }
    return roles.some(role => routeRoles.includes(role))
  }
  const filterRoutes = (routes: RouteRecordRaw[]) => {
    return routes.filter((route) => {
      if (hasAuth(route)) {
        if (route.children) {
          route.children = filterRoutes(route.children)
        }
        return true
      }
      return false
    })
  }
  return filterRoutes(routes)
}

async function buildRoutesByBackend(
  fetchRoutes: () => MaybePromise<RouteRecordRawWithStringComponent[]>,
  resolveComponent: ResolveComponent,
) {
  let routes: RouteRecordRawWithStringComponent[] = []
  try {
    routes = await fetchRoutes()
  }
  catch (error) {
    routes = []
    console.error(error)
  }
  return mapTree(routes, (route) => {
    if (!route.component) {
      return route
    }
    return {
      ...route,
      component: resolveComponent(route.component),
    }
  }, 'children') as RouteRecordRaw[]
}
