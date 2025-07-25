import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 首页路由名称
 */
const HOME_ROUTE_PATH = '/home'

/**
 * 登录路由名称
 */
const LOGIN_ROUTE_PATH = '/login'

const notFoundRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'FallbackNotFound',
  component: () => import('@/views/not-found/index.vue'),
  meta: {
    title: '404',
  },
}

/**
 * 忽略权限的路由
 */
const ignoreAccessRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: HOME_ROUTE_PATH,
    component: () => import('@/components/layout/index.vue'),
    children: [],
    meta: {
      hideInBreadcrumb: true,
    },
  },
  {
    path: LOGIN_ROUTE_PATH,
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
]

/**
 * 权限路由，前端权限模式下会使用该数据
 */
const accessRoutes: RouteRecordRaw[] = [
  {
    path: HOME_ROUTE_PATH,
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      icon: 'material-symbols:dashboard-outline-rounded',
      keepAlive: true,
      hideInBreadcrumb: false,
    },
    // children: [
    //   {
    //     name: 'User22',
    //     path: 'user',
    //     component: () => import('@/views/system/user/index.vue'),
    //     meta: {
    //       title: '用户管理',
    //       icon: 'ant-design:user-outlined',
    //       keepAlive: true,
    //       hideInBreadcrumb: false,
    //     },
    //   },
    //   {
    //     name: 'Role222222',
    //     path: 'role',
    //     component: () => import('@/views/system/role/index.vue'),
    //     meta: {
    //       title: '角色管理',
    //       icon: 'carbon:user-role',
    //       keepAlive: true,
    //       hideInBreadcrumb: false,
    //     },
    //   },
    //   {
    //     name: 'Menu2222222',
    //     path: 'menu',
    //     component: () => import('@/views/system/menu/index.vue'),
    //     meta: {
    //       title: '菜单管理',
    //       icon: 'ant-design:menu-outlined',
    //       keepAlive: true,
    //       hideInBreadcrumb: false,
    //     },
    //     children: [
    //       {
    //         name: 'User22',
    //         path: 'user',
    //         component: () => import('@/views/system/user/index.vue'),
    //         meta: {
    //           title: '用户管理',
    //           icon: 'ant-design:user-outlined',
    //           keepAlive: true,
    //           hideInBreadcrumb: false,
    //         },
    //       },
    //       {
    //         name: 'Role22',
    //         path: 'role',
    //         component: () => import('@/views/system/role/index.vue'),
    //         meta: {
    //           title: '角色管理',
    //           icon: 'carbon:user-role',
    //           keepAlive: true,
    //           hideInBreadcrumb: false,
    //         },
    //       },
    //       {
    //         name: 'Menu22',
    //         path: 'menu',
    //         component: () => import('@/views/system/menu/index.vue'),
    //         meta: {
    //           title: '菜单管理',
    //           icon: 'ant-design:menu-outlined',
    //           keepAlive: true,
    //           hideInBreadcrumb: false,
    //         },
    //         children: [
    //           {
    //             name: 'User33',
    //             path: 'user',
    //             component: () => import('@/views/system/user/index.vue'),
    //             meta: {
    //               title: '用户管理',
    //               icon: 'ant-design:user-outlined',
    //               keepAlive: true,
    //               hideInBreadcrumb: false,
    //             },
    //           },
    //           {
    //             name: 'Role33',
    //             path: 'role',
    //             component: () => import('@/views/system/role/index.vue'),
    //             meta: {
    //               title: '角色管理',
    //               icon: 'carbon:user-role',
    //               keepAlive: true,
    //               hideInBreadcrumb: false,
    //             },
    //           },
    //           {
    //             name: 'Menu33',
    //             path: 'menu',
    //             component: () => import('@/views/system/menu/index.vue'),
    //             meta: {
    //               title: '菜单管理',
    //               icon: 'ant-design:menu-outlined',
    //               keepAlive: true,
    //               hideInBreadcrumb: false,
    //             },
    //             children: [
    //               {
    //                 name: 'User333',
    //                 path: 'user',
    //                 component: () => import('@/views/system/user/index.vue'),
    //                 meta: {
    //                   title: '用户管理',
    //                   icon: 'ant-design:user-outlined',
    //                   keepAlive: true,
    //                   hideInBreadcrumb: false,
    //                 },
    //               },
    //               {
    //                 name: 'Role333',
    //                 path: 'role',
    //                 component: () => import('@/views/system/role/index.vue'),
    //                 meta: {
    //                   title: '角色管理',
    //                   icon: 'carbon:user-role',
    //                   keepAlive: true,
    //                   hideInBreadcrumb: false,
    //                 },
    //               },
    //               {
    //                 name: 'Menu3333',
    //                 path: 'menu',
    //                 component: () => import('@/views/system/menu/index.vue'),
    //                 meta: {
    //                   title: '菜单管理',
    //                   icon: 'ant-design:menu-outlined',
    //                   keepAlive: true,
    //                   hideInBreadcrumb: false,
    //                 },
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ],
  },
  {
    name: 'System',
    path: '/system',
    meta: {
      title: '系统管理',
      icon: 'ant-design:setting-outlined',
      keepAlive: true,
      hideInBreadcrumb: false,
    },
    children: [
      {
        name: 'User',
        path: 'user',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'ant-design:user-outlined',
          keepAlive: true,
          hideInBreadcrumb: false,
        },
        children: [
          {
            path: 'detail/:id?',
            name: 'UserDetail',
            component: () => import('@/views/system/user/detail.vue'),
            meta: {
              title: '用户详情',
              icon: 'ant-design:user-add-outlined',
              keepAlive: true,
              hideInBreadcrumb: false,
              hideInMenu: true,
            },
          },
        ],
      },
      {
        name: 'Role',
        path: 'role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'carbon:user-role',
          keepAlive: true,
          hideInBreadcrumb: false,
        },
      },
      {
        name: 'Menu',
        path: 'menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'ant-design:menu-outlined',
          keepAlive: true,
          hideInBreadcrumb: false,
        },
        children: [
          {
            name: 'User2',
            path: 'user',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
              title: '用户管理',
              icon: 'ant-design:user-outlined',
              keepAlive: true,
              hideInBreadcrumb: false,
            },
          },
          {
            name: 'Role2',
            path: 'role',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
              title: '角色管理',
              icon: 'carbon:user-role',
              keepAlive: true,
              hideInBreadcrumb: false,
            },
          },
          {
            name: 'Menu2',
            path: 'menu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
              title: '菜单管理',
              icon: 'ant-design:menu-outlined',
              keepAlive: true,
              hideInBreadcrumb: false,
            },
          },
        ],
      },
    ],
  },
  {
    name: 'External',
    path: '/external',
    meta: {
      title: '外部页面',
      icon: 'ant-design:link-outlined',
      keepAlive: false,
      hideInBreadcrumb: true,
    },
    children: [
      {
        name: 'Baidu',
        path: 'baidu',
        component: {},
        meta: {
          title: '百度',
          icon: 'ri:baidu-fill',
          keepAlive: false,
          link: 'https://www.baidu.com',
        },
      },
      {
        name: 'component',
        path: 'menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理(外部打开)',
          icon: 'ant-design:menu-outlined',
          keepAlive: false,
          openInNewWindow: true,
        },
      },
    ],
  },
]

/**
 * 页面组件映射，后端权限模式下会使用该数据
 */
const matchedPageMap = import.meta.glob('@/views/**/*.vue')
const pageMap = Object.entries(matchedPageMap).reduce<Record<string, Component>>((p, [path, value]) => {
  const paths = path.split('/')
  const lastPath = paths[paths.length - 1]
  const finalPath = lastPath.split('.').slice(0, -1).join('.')
  p[finalPath] = value
  return p
}, {})

export {
  accessRoutes,
  HOME_ROUTE_PATH,
  ignoreAccessRoutes,
  LOGIN_ROUTE_PATH,
  notFoundRoute,
  pageMap,
}
