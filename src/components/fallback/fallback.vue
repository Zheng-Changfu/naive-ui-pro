<script setup lang='ts'>
import { computed } from 'vue'
import { $t } from '@/locales/locales'
import { useUserStore } from '@/store/use-user-store'
import Fallback403 from './403.vue'
import Fallback404 from './404.vue'
import Fallback500 from './500.vue'

interface Props {
  title?: string
  description?: string
  type: '403' | '404' | '500'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
})

const userStore = useUserStore()

const title = computed(() => {
  if (props.title) {
    return props.title
  }
  switch (props.type) {
    case '403':
      return $t('common.fallback.403.title')
    case '404':
      return $t('common.fallback.404.title')
    case '500':
      return $t('common.fallback.500.title')
    default:
      return ''
  }
})

const description = computed(() => {
  if (props.description) {
    return props.description
  }
  switch (props.type) {
    case '403':
      return $t('common.fallback.403.description')
    case '404':
      return $t('common.fallback.404.description')
    case '500':
      return $t('common.fallback.500.description')
    default:
      return ''
  }
})
</script>

<template>
  <div class="size-full flex items-center justify-center">
    <div class="flex flex-col items-center text-center space-y-8 max-w-lg w-full">
      <div class="w-72 h-56 sm:w-80 sm:h-60 lg:w-96 lg:h-72 mx-auto">
        <fallback-403 v-if="type === '403'" />
        <fallback-404 v-else-if="type === '404'" />
        <fallback-500 v-else-if="type === '500'" />
      </div>
      <div class="space-y-4">
        <div
          v-if="title"
          class="text-xl font-medium text-text-1"
        >
          {{ title }}
        </div>
        <div
          v-if="description"
          class="text-sm text-text-3 max-w-md"
        >
          {{ description }}
        </div>
      </div>
      <div class="flex flex-wrap gap-3 justify-center pt-4">
        <n-button
          type="primary"
          @click="$router.push(userStore.homePath)"
        >
          {{ $t('common.fallback.backHome') }}
        </n-button>
      </div>
    </div>
  </div>
</template>
