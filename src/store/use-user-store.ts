import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HOME_ROUTE_PATH, LOGIN_ROUTE_PATH } from '@/router/routes'
import http from '@/utils/axios'

export interface UserInfo {
  name: string
  token: string
  roles: string[]
  codes: string[]
}

export interface UserLoginPayload {
  username: string
  password: string
  [x: string]: any
}

export const useUserStore = defineStore('user', () => {
  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const routes = ref<RouteRecordRaw[]>([]) // 当前角色拥有的路由，Admin 中根据此数据生成菜单

  const user = ref<UserInfo>({
    name: '',
    roles: [],
    codes: [],
    token: localStorage.getItem('token') ?? '',
  })

  async function fetchUpdateUserInfo() {
    try {
      const { data } = await Api.queryUserInfo()
      user.value = {
        ...user.value,
        ...data,
      }
      return user.value
    }
    catch (error) {
      console.error(error)
      logout()
      return user.value
    }
  }

  async function login(payload: UserLoginPayload) {
    try {
      loading.value = true
      const res = await Api.login(payload)
      const token = user.value.token = res.data.token
      localStorage.setItem('token', token)
      const redirect = route.query.redirect as string ?? HOME_ROUTE_PATH
      await router.push(redirect)
      return payload.username
    }
    finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = {
      name: '',
      token: '',
      roles: [],
      codes: [],
    }
    localStorage.removeItem('token')
  }

  async function logoutWithQueryRedirect(redirect?: string) {
    logout()
    return router.push({
      path: LOGIN_ROUTE_PATH,
      query: {
        redirect: redirect ?? route.fullPath,
      },
    })
  }

  return {
    login,
    logout,
    routes,
    fetchUpdateUserInfo,
    loginLoading: loading,
    logoutWithQueryRedirect,
    user: computed(() => user.value),
  }
})

class Api {
  static login(payload: UserLoginPayload) {
    return http<{ token: string }>({
      url: '/user/login',
      method: 'post',
      data: payload,
    })
  }

  static queryUserInfo() {
    return http<Omit<UserInfo, 'token'>>({
      url: '/user/info',
      method: 'get',
    })
  }
}
