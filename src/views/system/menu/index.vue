<script setup lang="tsx">
import type { ProDataTableColumns } from 'pro-naive-ui'
import type { Merge, SetOptional } from 'type-fest'
import type { Menu } from './index.api'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { createProDrawerForm, renderProTags } from 'pro-naive-ui'
import { computed } from 'vue'
import { useProNDataTable } from '@/composables/use-pro-n-data-table'
import { useProRequest } from '@/composables/use-pro-request'
import { $t } from '@/locales/locales'
import { useLayoutStore } from '@/store/use-layout-store'
import { translateOptions } from '@/utils/common'
import DirectoryDrawerForm from './components/driectory-drawer-form.vue'
import MenuDrawerForm from './components/menu-drawer-form.vue'
import { Api } from './index.api'
import {
  menuTypeEnum,
  typeMapping,
  typeOptions,
  typeToColorMapping,
} from './utils/constants'

const {
  mobile,
} = storeToRefs(useLayoutStore())

const {
  loading: insertOrUpdateLoading,
  runAsync: runAsyncInsertOrUpdate,
} = useProRequest(Api.insertOrUpdate, {
  manual: true,
  successTip: true,
})

const {
  table: { tableProps, onChange },
} = useProNDataTable(
  async () => {
    const { data } = await Api.list()
    return { list: data, total: data.length }
  },
)

const drawerForm = createProDrawerForm<Merge<SetOptional<Menu, 'id'>, { parentId: null | string }>>({
  onSubmit: (values) => {
    const data = {
      ...values,
      id: drawerForm.values.value.id,
      parentId: drawerForm.values.value.parentId,
    }
    runAsyncInsertOrUpdate(data).then(() => {
      drawerForm.show.value = false
      onChange({ page: 1 })
    })
  },
})

const { run: runDeleteMenus } = useProRequest(Api.del, {
  manual: true,
  successTip: 'common.often.deleteSuccess',
  onSuccess() {
    onChange({ page: 1 })
  },
})

const tableColumns = computed<ProDataTableColumns<Menu>>(() => {
  return [
    {
      title: $t('pages.system.menu.menuTitle'),
      width: 180,
      render: (row) => {
        return (
          <n-flex
            inline
            align="center"
          >
            {row.meta?.icon && <Icon icon={row.meta.icon}></Icon>}
            <span>{row.meta?.title}</span>
          </n-flex>
        )
      },
    },
    {
      title: $t('pages.system.menu.type'),
      path: 'type',
      width: 100,
      render: (row) => {
        return renderProTags({
          content: $t(typeMapping[row.type]),
          type: typeToColorMapping[row.type],
        })
      },
    },
    {
      title: $t('pages.system.menu.path'),
      path: 'path',
      width: 150,
    },
    {
      title: $t('pages.system.menu.component'),
      path: 'component',
      width: 150,
    },
    {
      title: $t('common.often.operation'),
      width: 150,
      render: (row) => {
        return (
          <n-flex>
            <n-button
              type="primary"
              size="small"
              text={true}
              onClick={() => {
                drawerForm.show.value = true
                drawerForm.values.value.parentId = row.id
                drawerForm.values.value.type = menuTypeEnum.MENU
              }}
            >
              {$t('common.often.add')}
            </n-button>
            <n-button
              type="primary"
              size="small"
              text={true}
              onClick={() => {
                drawerForm.show.value = true
                drawerForm.values.value = {
                  ...row,
                  parentId: null,
                  meta: {
                    layout: true,
                    ...(row.meta ?? {} as any),
                  },
                }
              }}
            >
              {$t('common.often.edit')}
            </n-button>
            <n-popconfirm onPositiveClick={() => runDeleteMenus(row.id)}>
              {{
                default: () => (
                  <span>
                    {$t('common.often.deleteConfirm')}
                    <span class="c-red-500 font-bold">{row.meta?.title}</span>
                    {$t('common.often.deleteQuestion')}
                  </span>
                ),
                trigger: () => {
                  return (
                    <n-button
                      type="error"
                      size="small"
                      text={true}
                    >
                      {$t('common.often.delete')}
                    </n-button>
                  )
                },
              }}
            </n-popconfirm>
          </n-flex>
        )
      },
    },
  ]
})
</script>

<template>
  <n-flex
    class="h-full"
    vertical
    size="large"
  >
    <pro-data-table
      :title="$t('pages.system.menu.title')"
      row-key="id"
      :scroll-x="730"
      :columns="tableColumns"
      v-bind="tableProps"
      :pagination="false"
    >
      <template #toolbar>
        <n-flex>
          <n-button
            type="primary"
            ghost
            @click="drawerForm.show.value = true;drawerForm.values.value.type = menuTypeEnum.MENU"
          >
            <template #icon>
              <n-icon>
                <icon icon="ant-design:plus-outlined" />
              </n-icon>
            </template>
            {{ $t('common.often.add') }}
          </n-button>
        </n-flex>
      </template>
    </pro-data-table>
    <pro-drawer-form
      :form="drawerForm"
      :loading="insertOrUpdateLoading"
      :width="mobile ? '100%' : undefined"
    >
      <pro-drawer-content
        :title="`${drawerForm.values.value.id ? $t('pages.system.menu.editMenu') : $t('pages.system.menu.addMenu')}`"
        :native-scrollbar="false"
      >
        <pro-radio-group
          :title="$t('pages.system.menu.menuType')"
          path="type"
          :field-props="{
            type: 'button',
            options: translateOptions(typeOptions),
          }"
        />
        <div class="grid-cols-responsive-1-2-2 gap-x-0 md:gap-x-4">
          <menu-drawer-form v-if="drawerForm.values.value.type === menuTypeEnum.MENU" />
          <directory-drawer-form v-else-if="drawerForm.values.value.type === menuTypeEnum.DIRECTORY" />
        </div>
      </pro-drawer-content>
    </pro-drawer-form>
  </n-flex>
</template>
