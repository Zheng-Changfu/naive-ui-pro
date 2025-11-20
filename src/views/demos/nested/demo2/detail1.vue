<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { NButton, NCard, NTag } from 'naive-ui'
</script>

<template>
  <div class="size-full flex justify-center items-center">
    <div class="text-center max-w-md">
      <n-card>
        <div class="mb-6">
          <icon
            icon="mdi:account-circle"
            class="text-6xl text-blue-500 mb-4"
          />
          <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            用户详情页
          </h1>
          <n-tag
            type="info"
            size="medium"
            class="mb-4"
          >
            用户管理模块
          </n-tag>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            这是用户详情页面，展示用户的基本信息、权限设置等内容。
          </p>
        </div>

        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <icon icon="mdi:account-outline" />
            <span>用户ID: U001</span>
          </div>
          <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <icon icon="mdi:email-outline" />
            <span>zhangsan@example.com</span>
          </div>
          <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <icon icon="mdi:shield-check-outline" />
            <span>权限状态: 正常</span>
          </div>
        </div>

        <n-button
          type="primary"
          @click="$router.back()"
        >
          {{ $t('pages.demos.nested.backToList') }}
        </n-button>
      </n-card>
    </div>
  </div>
</template>
