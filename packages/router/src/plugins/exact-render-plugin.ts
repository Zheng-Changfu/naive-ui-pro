import type { ProRouterPlugin } from '../plugin'
import { computed, defineComponent, h, inject, provide, toValue } from 'vue'
import { RouterView, useRoute, viewDepthKey } from 'vue-router'

export function exactRenderPlugin(): ProRouterPlugin {
  return ({ router }) => {
    const { install } = router
    router.install = (app) => {
      // 先安装路由器内的组件
      install(app)

      // 覆盖默认的 RouterView
      app.component(
        RouterView.name,
        defineComponent({
          name: 'RouterView',
          props: {
            exact: {
              type: Boolean,
              default: false,
            },
          },
          setup(props, { attrs, slots }) {
            const route = useRoute()
            const viewDepth = inject(viewDepthKey, 0)
            provide(viewDepthKey, computed(() => props.exact ? route.matched.length - 1 : toValue(viewDepth)))
            return () => h(RouterView, attrs, slots)
          },
        }),
      )
    }
  }
}

declare module 'vue-router' {
  interface RouterViewProps {
    /**
     * 是否精确渲染当前路由的视图组件
     */
    exact?: boolean
  }
}
