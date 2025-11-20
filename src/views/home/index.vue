<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { $t, Lang } from '@/locales/locales'
import { useAppStore } from '@/store/use-app-store'
import { useUserStore } from '@/store/use-user-store'

const {
  isZhCN,
} = storeToRefs(useAppStore())

const {
  user,
} = storeToRefs(useUserStore())

// 当前日期
const formattedDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString(isZhCN.value ? Lang.ZH_CN : Lang.EN_US, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

// 统计卡片数据
const statCards = computed(() => [
  {
    title: $t('pages.home.totalVisits'),
    value: '12,846',
    icon: 'mdi:eye-outline',
    trend: 'up',
    rate: '16.2%',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: '#1677ff',
  },
  {
    title: $t('pages.home.totalUsers'),
    value: '3,275',
    icon: 'mdi:account-outline',
    trend: 'up',
    rate: '8.1%',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: '#52c41a',
  },
  {
    title: $t('pages.home.totalOrders'),
    value: '1,592',
    icon: 'mdi:cart-outline',
    trend: 'down',
    rate: '3.2%',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: '#fa8c16',
  },
  {
    title: $t('pages.home.totalRevenue'),
    value: '¥25,648',
    icon: 'mdi:credit-card-outline',
    trend: 'up',
    rate: '12.5%',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: '#722ed1',
  },
])

// 最近活动数据
const recentActivities = computed(() => [
  {
    user: 'Zhang San',
    avatar: 'mdi:account-circle',
    action: $t('pages.home.activities.completedTask'),
    target: $t('pages.home.targets.systemArchitectureDesign'),
    time: `10${$t('pages.home.time.minutesAgo')}`,
    color: '#1677ff',
  },
  {
    user: 'Li Si',
    avatar: 'mdi:account-circle',
    action: $t('pages.home.activities.commentedDocument'),
    target: $t('pages.home.targets.productRequirements'),
    time: `30${$t('pages.home.time.minutesAgo')}`,
    color: '#52c41a',
  },
  {
    user: 'Wang Wu',
    avatar: 'mdi:account-circle',
    action: $t('pages.home.activities.uploadedFile'),
    target: $t('pages.home.targets.databaseDesign'),
    time: `1${$t('pages.home.time.hourAgo')}`,
    color: '#722ed1',
  },
  {
    user: 'Zhao Liu',
    avatar: 'mdi:account-circle',
    action: $t('pages.home.activities.createdTask'),
    target: $t('pages.home.targets.frontendDevelopment'),
    time: `2${$t('pages.home.time.hourAgo')}`,
    color: '#fa8c16',
  },
  {
    user: 'Chen Qi',
    avatar: 'mdi:account-circle',
    action: $t('pages.home.activities.updatedStatus'),
    target: $t('pages.home.targets.backendDevelopment'),
    time: `3${$t('pages.home.time.hourAgo')}`,
    color: '#13c2c2',
  },
  {
    user: 'Zhou Ba',
    avatar: 'mdi:account-circle',
    action: $t('pages.home.activities.solvedProblem'),
    target: $t('pages.home.targets.testingAndDeployment'),
    time: `4${$t('pages.home.time.hourAgo')}`,
    color: '#eb2f96',
  },
  {
    user: 'Wu Jiu',
    avatar: 'mdi:account-circle',
    action: $t('pages.home.activities.mergedCode'),
    target: $t('pages.home.targets.documentation'),
    time: $t('pages.home.time.yesterday'),
    color: '#faad14',
  },
  {
    user: 'Zheng Shi',
    avatar: 'mdi:account-circle',
    action: $t('pages.home.activities.closedIssue'),
    target: $t('pages.home.targets.documentation'),
    time: $t('pages.home.time.yesterday'),
    color: '#597ef7',
  },
])

// 项目动态数据
const projectUpdates = computed(() => [
  {
    title: $t('pages.home.updates.newVersionRelease'),
    desc: $t('pages.home.updates.newVersionDesc'),
    time: `${$t('pages.home.time.today')} 10:30`,
    icon: 'mdi:tag-outline',
    color: '#1677ff',
  },
  {
    title: $t('pages.home.updates.systemMaintenanceNotice'),
    desc: $t('pages.home.updates.systemMaintenanceDesc'),
    time: `${$t('pages.home.time.yesterday')} 14:20`,
    icon: 'mdi:tools',
    color: '#fa8c16',
  },
  {
    title: $t('pages.home.updates.featureUpdatePreview'),
    desc: $t('pages.home.updates.featureUpdateDesc'),
    time: `3${$t('pages.home.time.daysAgo')}`,
    icon: 'mdi:lightbulb-outline',
    color: '#52c41a',
  },
  {
    title: $t('pages.home.updates.securityUpdateReminder'),
    desc: $t('pages.home.updates.securityUpdateDesc'),
    time: `4${$t('pages.home.time.daysAgo')}`,
    icon: 'mdi:shield-alert-outline',
    color: '#ff4d4f',
  },
  {
    title: $t('pages.home.updates.userFeedbackImprovement'),
    desc: $t('pages.home.updates.userFeedbackDesc'),
    time: `5${$t('pages.home.time.daysAgo')}`,
    icon: 'mdi:comment-text-outline',
    color: '#13c2c2',
  },
  {
    title: $t('pages.home.updates.newFeatureResearch'),
    desc: $t('pages.home.updates.newFeatureDesc'),
    time: `1${$t('pages.home.time.weekAgo')}`,
    icon: 'mdi:flask-outline',
    color: '#722ed1',
  },
])
</script>

<template>
  <div>
    <!-- 欢迎区域 -->
    <div class="mb-3">
      <n-card class="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div class="flex items-center">
            <div class="w-14 h-14 mr-4 flex items-center justify-center">
              <img
                src="/src/assets/logo.svg"
                alt="Logo"
                class="size-full"
              >
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-medium mb-2">
                {{ $t('pages.home.welcomeBack') }}，{{ user.name }}
              </h1>
              <p class="text-gray-500 dark:text-gray-400">
                {{ $t('pages.home.today') }} {{ formattedDate }}
              </p>
            </div>
          </div>
          <div class="mt-4 md:mt-0 flex items-center">
            <div class="flex items-center">
              <div class="text-center px-4">
                <div class="text-lg font-semibold">
                  18
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('pages.home.completed') }}
                </div>
              </div>
              <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
              <div class="text-center px-4">
                <div class="text-lg font-semibold">
                  6
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('pages.home.inProgress') }}
                </div>
              </div>
              <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
              <div class="text-center px-4">
                <div class="text-lg font-semibold">
                  3
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('pages.home.newMessages') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 数据概览卡片 -->
    <div class="grid-cols-responsive-1-2-4 gap-5 mb-3">
      <n-card
        v-for="(card, index) in statCards"
        :key="index"
        class="hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500 dark:text-gray-400 mb-1 text-sm">
              {{ card.title }}
            </p>
            <h3 class="text-2xl font-semibold">
              {{ card.value }}
            </h3>
            <div class="flex items-center mt-2">
              <span
                class="inline-flex items-center"
                :class="card.trend === 'up' ? 'text-green-500' : 'text-red-500'"
              >
                <icon
                  :icon="card.trend === 'up' ? 'mdi:arrow-up' : 'mdi:arrow-down'"
                  width="16"
                  class="mr-1"
                />
                {{ card.rate }}
              </span>
              <span class="text-gray-500 dark:text-gray-400 ml-1">{{ $t('pages.home.comparedToLastWeek') }}</span>
            </div>
          </div>
          <div
            class="flex items-center justify-center w-12 h-12 rounded-full"
            :class="card.bgColor"
          >
            <icon
              :icon="card.icon"
              :color="card.iconColor"
              width="28"
            />
          </div>
        </div>
      </n-card>
    </div>

    <!-- 活动记录和项目动态 -->
    <div class="grid-cols-responsive-1-1-2 gap-6 mb-3">
      <!-- 活动记录 -->
      <n-card
        :title="$t('pages.home.activityLog')"
        class="h-full shadow-sm border-0"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <icon
              icon="mdi:history"
              color="#1677ff"
              width="20"
              class="mr-2"
            />
            <span class="text-sm font-medium">{{ $t('pages.home.recentUserActivity') }}</span>
          </div>
          <n-button
            text
            size="small"
          >
            <span class="flex items-center text-xs">
              {{ $t('pages.home.viewAll') }}
              <icon
                icon="mdi:chevron-right"
                width="14"
                class="ml-1"
              />
            </span>
          </n-button>
        </div>
        <div class="space-y-1">
          <div
            v-for="(activity, index) in recentActivities.slice(0, 8)"
            :key="index"
            class="flex items-start py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 px-2 rounded transition-colors duration-200 group"
          >
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center mr-2"
              :style="{ backgroundColor: `${activity.color}20` }"
            >
              <icon
                :icon="activity.avatar"
                :color="activity.color"
                width="16"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center text-sm">
                <span class="font-medium mr-1 truncate">{{ activity.user }}</span>
                <span class="text-gray-500 dark:text-gray-400 mr-1 truncate">{{ activity.action }}</span>
                <span class="font-medium text-primary truncate">{{ activity.target }}</span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                <icon
                  icon="mdi:clock-outline"
                  width="12"
                  class="mr-1"
                />
                {{ activity.time }}
              </div>
            </div>
            <div>
              <n-button
                text
                size="small"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <icon
                  icon="mdi:dots-horizontal"
                  width="14"
                />
              </n-button>
            </div>
          </div>
        </div>
      </n-card>

      <!-- 项目动态 -->
      <n-card
        :title="$t('pages.home.projectUpdates')"
        class="h-full shadow-sm border-0"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <icon
              icon="mdi:bell-outline"
              color="#fa8c16"
              width="20"
              class="mr-2"
            />
            <span class="text-sm font-medium">{{ $t('pages.home.systemAnnouncementsAndUpdates') }}</span>
          </div>
          <n-button
            text
            size="small"
          >
            <span class="flex items-center text-xs">
              {{ $t('pages.home.viewAll') }}
              <icon
                icon="mdi:chevron-right"
                width="14"
                class="ml-1"
              />
            </span>
          </n-button>
        </div>
        <div class="space-y-1">
          <div
            v-for="(update, index) in projectUpdates"
            :key="index"
            class="flex items-start py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 px-2 rounded transition-colors duration-200 group"
          >
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center mr-2"
              :style="{ backgroundColor: `${update.color}20` }"
            >
              <icon
                :icon="update.icon"
                :color="update.color"
                width="16"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center text-sm">
                <span class="font-medium text-primary truncate">{{ update.title }}</span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                <icon
                  icon="mdi:clock-outline"
                  width="12"
                  class="mr-1"
                />
                {{ update.time }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {{ update.desc }}
              </div>
            </div>
            <div>
              <n-button
                text
                size="small"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <icon
                  icon="mdi:dots-horizontal"
                  width="14"
                />
              </n-button>
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>
