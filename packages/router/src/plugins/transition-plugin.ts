import type { ComputedRef, MaybeRefOrGetter, RendererElement, TransitionProps } from 'vue'
import type { Router } from 'vue-router'
import type { ProRouterPlugin } from '../plugin'
import { has } from 'lodash-es'
import { computed, toValue } from 'vue'
import { warn } from '../utils/warn'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 当前路由的过渡名称
     * @default 'fade'
     */
    transitionName?: RouteTransitionName
  }
  interface Router {
    /**
     * 当前路由的过渡属性
     */
    currentRouteTransitionProps: ComputedRef<TransitionProps>
  }
}

export type RouteTransitionName
= | 'fade'
  | 'fade-down'
  | 'fade-slide'
  | 'fade-up'
  | 'none'
  | (string & {})

/**
 * 路由过渡插件
 */

interface TransitionPluginOptions {
  /**
   * 过渡名称
   * @default 'fade'
   */
  transitionName?: MaybeRefOrGetter<RouteTransitionName>
}

const builtinTransitionNameToTransitionPropsRecord: Partial<Record<RouteTransitionName, TransitionProps>> = {
  'fade': {
    leaveToClass: 'opacity-0',
    enterFromClass: 'opacity-0',
    enterActiveClass: 'transition-opacity duration-300 ease-in-out',
    leaveActiveClass: 'transition-opacity duration-300 ease-in-out',
  },
  'fade-down': {
    enterFromClass: 'opacity-0 transform -translate-y-4',
    leaveToClass: 'opacity-0 transform -translate-y-4',
    enterActiveClass: 'transition duration-300 ease-in-out',
    leaveActiveClass: 'transition duration-300 ease-in-out',
  },
  'fade-up': {
    enterFromClass: 'opacity-0 transform translate-y-4',
    leaveToClass: 'opacity-0 transform translate-y-4',
    enterActiveClass: 'transition duration-300 ease-in-out',
    leaveActiveClass: 'transition duration-300 ease-in-out',
  },
  'fade-slide': {
    enterFromClass: 'opacity-0 transform translate-x-4',
    leaveToClass: 'opacity-0 transform -translate-x-4',
    enterActiveClass: 'transition duration-300 ease-in-out',
    leaveActiveClass: 'transition duration-300 ease-in-out',
  },
  'none': {},
}

export function transitionPlugin({
  transitionName = 'fade-slide',
}: TransitionPluginOptions = {}): ProRouterPlugin {
  return ({ router, onUnmount }) => {
    if (!router.currentRouteTransitionProps) {
      router.currentRouteTransitionProps = computed(() => {
        const mergedTransitionName = resolveTransitionName(router, transitionName)
        const transitionProps = builtinTransitionNameToTransitionPropsRecord[mergedTransitionName]
        return {
          ...transitionProps,
          appear: true,
          mode: 'out-in',
          onEnter: (el) => {
            lockScroll(el.parentElement)
          },
          onAfterEnter: (el) => {
            unlockScroll(el.parentElement)
          },
        }
      })
    }

    onUnmount(() => {
      delete router.currentRouteTransitionProps
    })
  }
}

function resolveTransitionName(router: Router, transitionName: MaybeRefOrGetter<RouteTransitionName>) {
  transitionName = toValue(transitionName)
  const mergedTransitioName = router.currentRoute.value.meta.transitionName ?? transitionName
  if (!has(builtinTransitionNameToTransitionPropsRecord, mergedTransitioName)) {
    const finalTransitioName = has(builtinTransitionNameToTransitionPropsRecord, transitionName)
      ? transitionName
      : 'fade-slide'
    if (__DEV__) {
      warn(`transition name ${mergedTransitioName} is not found, fallback to default transition name ${finalTransitioName}`)
    }
    return finalTransitioName
  }
  return mergedTransitioName
}

let initialOverflow: CSSStyleDeclaration['overflow'] = ''
function lockScroll(el: RendererElement) {
  initialOverflow = el.style.overflow
  el.style.overflow = 'hidden'
}

function unlockScroll(el: RendererElement) {
  el.style.overflow = initialOverflow
}
