import type {
  RbacAccessPluginBaseServiceReturned,
  RbacAccessPluginRouteRecordRawWithStringComponent,
} from '@pro/router'

import type { App } from 'vue'
import type { RouteMeta } from 'vue-router'

import {
  autoRedirectPlugin,
  breadcrumbPlugin,
  createRouter,
  documentTitlePlugin,
  keepAlivePlugin,
  linkPlugin,
  nestedRouteRenderPlugin,
  nMenuPlugin,
  progressPlugin,
  rbacAccessPlugin,
  refreshPlugin,
  transitionPlugin,
  visitedRoutesPlugin,
} from '@pro/router'

import { h } from 'vue'
import { createWebHistory } from 'vue-router'
import IframeContainer from '@/components/iframe/index.vue'
import { $t } from '@/locales/locales'
import { useAppStore } from '@/store/use-app-store'
import { useUserStore } from '@/store/use-user-store'
import http from '@/utils/axios'
import { layoutFalsyPlugin } from './plugins/layout-falsy-plugin'
import { stateCleanupPlugin } from './plugins/state-cleanup-plugin'
import { tabsPlugin } from './plugins/tabs-plugin'

import {
  accessRoutes,
  ignoreAccessRoutes,
  LOGIN_ROUTE_PATH,
  notFoundRoute,
  pageMap,
  ROOT_ROUTE_NAME,
  rootRoute,
} from './routes'

function resolveI18nTitle(route: { meta?: RouteMeta }) {
  const appStore = useAppStore()
  const { title, titleI18nKey } = route.meta ?? {}
  return titleI18nKey
    ? $t(titleI18nKey)
    : title ?? appStore.title
}

export async function setupRouter(app: App) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      rootRoute,
      ...ignoreAccessRoutes,
      notFoundRoute,
    ],
    plugins: [
      /**
       * 路由进度条插件
       */
      progressPlugin(),
      /**
       * 路由标题插件
       */
      documentTitlePlugin({
        resolveTitle: (route) => {
          return resolveI18nTitle(route)
        },
      }),
      /**
       * 面包屑插件
       */
      breadcrumbPlugin({
        resolveBreadcrumb: (item, route) => {
          const finalTitle = resolveI18nTitle(route)
          return {
            ...item,
            title: finalTitle,
          }
        },
      }),
      /**
       * 访问过的路由插件
       */
      visitedRoutesPlugin(),
      /**
       * 外链插件，用于处理外链跳转
       */
      linkPlugin({
        renderIframe: (url) => {
          return h(IframeContainer, { url })
        },
      }),
      /**
       * 路由缓存插件
       */
      keepAlivePlugin(),
      /**
       * 刷新插件
       */
      refreshPlugin(),
      /**
       * 路由过渡插件
       */
      transitionPlugin({
        transitionName: () => {
          return useAppStore().transitionName
        },
      }),
      /**
       * 自动重定向到目标路由插件
       */
      autoRedirectPlugin({
        homePath: () => useUserStore().homePath,
      }),
      /**
       * 权限插件
       */
      rbacAccessPlugin({
        service: async () => {
          const appStore = useAppStore()
          const userStore = useUserStore()
          if (userStore.user.token && userStore.user.roles.length <= 0) {
            // 初始化数据
            await userStore.fetchUpdateUserInfo()
          }
          const baseInfo: RbacAccessPluginBaseServiceReturned = {
            logined: !!userStore.user.token,
            homePath: userStore.homePath,
            loginPath: LOGIN_ROUTE_PATH,
            parentNameForAddRoute: ROOT_ROUTE_NAME,
            onRoutesBuilt: (routes) => {
              userStore.routes = routes
            },
          }
          if (appStore.accessMode === 'frontend') {
            return {
              ...baseInfo,
              mode: 'frontend',
              routes: accessRoutes,
              roles: userStore.user.roles,
            }
          }
          return {
            ...baseInfo,
            mode: 'backend',
            fetchRoutes: async () => {
              const res = await http.get<RbacAccessPluginRouteRecordRawWithStringComponent[]>('/menus/all')
              return res.data
            },
            resolveComponent: (component) => {
              let dynamicComponent = pageMap[component]
              if (!dynamicComponent) {
                dynamicComponent = () => import('@/views/demos/fallback/404.vue')
                if (__DEV__) {
                  console.warn(`[Router] 未找到组件: ${component}，替换成 404 页面`)
                }
              }
              return dynamicComponent
            },
          }
        },
      }),
      /**
       * 菜单插件，将数据转换成 n-menu 菜单数据
       */
      nMenuPlugin({
        service: () => {
          const store = useUserStore()
          return {
            routes: store.routes,
            resolveMenuItem(item, rawItem) {
              const { titleI18nKey } = rawItem.meta ?? {}
              return {
                ...item,
                label: titleI18nKey
                  ? $t(titleI18nKey)
                  : item.label,
              }
            },
          }
        },
      }),
      /**
       * 嵌套路由视图渲染插件
       */
      nestedRouteRenderPlugin(),
      /**
       * 支持不显示布局的插件
       */
      layoutFalsyPlugin(),
      /**
       * 状态清理插件
       */
      stateCleanupPlugin(),
      /**
       * tabs 插件
       */
      tabsPlugin(),
    ],
  })
  app.use(router)
  await router.isReady()
}
