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
            icon="mdi:shopping-outline"
            class="text-6xl text-green-500 mb-4"
          />
          <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            订单详情页
          </h1>
          <n-tag
            type="success"
            size="medium"
            class="mb-4"
          >
            订单管理模块
          </n-tag>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            这是订单详情页面，展示订单的基本信息、商品清单、支付状态等内容。
          </p>
        </div>

        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <icon icon="mdi:receipt-outline" />
            <span>订单号: ORD-2024-001</span>
          </div>
          <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <icon icon="mdi:account-outline" />
            <span>客户: 张三</span>
          </div>
          <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <icon icon="mdi:currency-cny" />
            <span>金额: ¥1,199.00</span>
          </div>
          <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <icon icon="mdi:truck-delivery-outline" />
            <span>状态: 处理中</span>
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
