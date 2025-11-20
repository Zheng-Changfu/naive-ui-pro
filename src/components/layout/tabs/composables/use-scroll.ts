import type { ScrollbarInst } from 'naive-ui'
import { useResizeObserver } from '@vueuse/core'
import { nextTick, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'

export function useScroll() {
  const router = useRouter()
  const { activeIndex } = router.visitedRoutesPlugin
  const scrollbarContainerCls = 'scrollbar-container'
  const tabsRef = useTemplateRef<HTMLElement>('tabsRef')
  const scrollbarRef = useTemplateRef<ScrollbarInst>('scrollbarRef')

  function updateTabsScroll(index: number) {
    nextTick(() => {
      if (!tabsRef.value || !scrollbarRef.value) {
        return
      }
      const tabElement = tabsRef.value.children[index]
      if (tabElement) {
        const tab = tabElement as HTMLElement
        const tabLeft = tab.offsetLeft
        const tabWidth = tab.offsetWidth
        const containerWidth = document.querySelector(`.${scrollbarContainerCls}`)?.clientWidth ?? 0
        const scrollLeft = tabLeft + tabWidth / 2 - containerWidth / 2
        const maxScrollLeft = tabsRef.value.scrollWidth - containerWidth
        const finalScrollLeft = Math.max(0, Math.min(scrollLeft, maxScrollLeft))

        scrollbarRef.value.scrollTo({
          left: finalScrollLeft,
          behavior: 'smooth',
        })
      }
    })
  }

  function handleWheel(event: WheelEvent) {
    if (scrollbarRef.value) {
      // 判断手势决定使用水平滚动量还是纵向滚动量
      scrollbarRef.value.scrollBy({
        left: Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY,
      })
    }
  }

  watch(
    () => router.visitedRoutesPlugin.routes[activeIndex.value]?.path,
    () => {
      updateTabsScroll(activeIndex.value)
    },
  )

  useResizeObserver(
    () => {
      let currentEl = tabsRef.value
      if (!currentEl) {
        return null
      }
      while (!currentEl?.classList.contains(scrollbarContainerCls)) {
        currentEl = currentEl?.parentElement as any
      }
      return currentEl as HTMLElement
    },
    () => {
      updateTabsScroll(activeIndex.value)
    },
  )

  return {
    tabsRef,
    handleWheel,
    scrollbarRef,
    updateTabsScroll,
    scrollbarContainerCls,
  }
}
