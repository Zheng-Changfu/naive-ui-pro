<script setup lang='tsx'>
import { NTabPane, NTabs } from 'naive-ui'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  {
    name: 'nestedDetail2:detail1',
    title: '用户详情',
  },
  {
    name: 'nestedDetail2:detail2',
    title: '订单详情',
  },
]

const activeTab = computed(() => route.name as string)

function handleTabChange(tabName: string) {
  const tab = tabs.find(t => t.name === tabName)
  if (tab) {
    router.push({ name: tab.name })
  }
}
</script>

<template>
  <n-card class="size-full">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        嵌套详情页演示（2）
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        演示带标签页的嵌套路由功能，支持不同类型的详情页面
      </p>
    </div>

    <!-- 标签页导航 -->
    <n-tabs
      type="card"
      :value="activeTab"
      @update:value="handleTabChange"
    >
      <n-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :tab="tab.title"
      />
    </n-tabs>

    <!-- 内容区域 -->
    <div>
      <router-view />
    </div>
  </n-card>
</template>
