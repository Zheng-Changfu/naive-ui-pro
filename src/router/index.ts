import type { App } from 'vue'
import {
  autoRedirectToFirstChild,
  breadcrumbPlugin,
  createRouter,
  documentTitlePlugin,
  exactRenderPlugin,
  keepAlivePlugin,
  linkPlugin,
  nMenuPlugin,
  progressPlugin,
  rbacAccessPlugin,
  refreshPlugin,
  transitionPlugin,
} from '@pro/router'

import {
  createWebHistory,
} from 'vue-router'

import { useAppStore } from '@/store/use-app-store'

import {
  useUserStore,
} from '@/store/use-user-store'
import {
  accessRoutes,
  HOME_ROUTE_PATH,
  ignoreAccessRoutes,
  LOGIN_ROUTE_PATH,
  notFoundRoute,
} from './routes'

export async function setupRouter(app: App) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
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
      documentTitlePlugin(),
      /**
       * 面包屑插件
       */
      breadcrumbPlugin(),
      /**
       * 外链插件，用于处理外链跳转
       */
      linkPlugin(),
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
       * 自动重定向到第一个子路由插件
       */
      autoRedirectToFirstChild(),
      /**
       * 权限插件
       */
      rbacAccessPlugin({
        service: async () => {
          const store = useUserStore()
          if (store.user.token && store.user.roles.length <= 0) {
            // 初始化数据
            await store.fetchUpdateUserInfo()
          }
          return {
            mode: 'frontend',
            routes: accessRoutes,
            roles: store.user.roles,
            logined: !!store.user.token,
            homePath: HOME_ROUTE_PATH,
            loginPath: LOGIN_ROUTE_PATH,
            parentNameForAddRoute: 'Root',
            ignoreAccessRouteNames: ignoreAccessRoutes.map(t => t.name as string),
          }
        },
      }),
      /**
       * 菜单插件，将数据转换成 n-menu 菜单数据
       */
      nMenuPlugin({
        service: () => {
          return {
            routes: accessRoutes,
          }
        },
      }),
      /**
       * 路由视图精确渲染插件，将会为 RouterView 扩展 exact 属性，
       * 设置后可以精准渲染与当前路由匹配的视图组件
       */
      exactRenderPlugin(),
    ],
  })
  app.use(router)
  await router.isReady()
}
