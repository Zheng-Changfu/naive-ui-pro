<script setup lang="tsx">
import type { ProEditDataTableColumns } from 'pro-naive-ui'
import { NButton, NFlex } from 'naive-ui'
import { computed, ref } from 'vue'
import { $t } from '@/locales/locales'

interface DataSourceType {
  id: string
  title?: string
  now?: number
  rate?: number
}

const editableKeys = ref<string[]>([])
const columns = computed<ProEditDataTableColumns<DataSourceType>>(() => {
  return [
    {
      title: $t('pages.demos.complexForm.dataTable.tableTitle'),
      path: 'title',
      field: 'input',
      width: 200,
      proFieldProps: {
        showFeedback: false,
        labelPlacement: 'left',
      },
    },
    {
      title: $t('pages.demos.complexForm.dataTable.tableTime'),
      path: 'now',
      field: 'date-time',
      width: 200,
      proFieldProps: {
        showFeedback: false,
        labelPlacement: 'left',
      },
    },
    {
      title: $t('pages.demos.complexForm.dataTable.actions'),
      width: 120,
      fixed: 'right',
      render: (row, rowIndex, action) => {
        const { remove, editable } = action
        return (
          <NFlex>
            {editable
              ? (
                  <NButton
                    text={true}
                    type="primary"
                    onClick={() => cancelEditable(row.id)}
                  >
                    {$t('pages.demos.complexForm.dataTable.save')}
                  </NButton>
                )
              : [
                  <NButton
                    text={true}
                    type="primary"
                    onClick={() => editableKeys.value.push(row.id)}
                  >
                    {$t('pages.demos.complexForm.dataTable.edit')}
                  </NButton>,
                  <NButton
                    text={true}
                    type="error"
                    onClick={() => {
                      remove(rowIndex)
                      cancelEditable(row.id)
                    }}
                  >
                    {$t('pages.demos.complexForm.dataTable.delete')}
                  </NButton>,
                ]}
          </NFlex>
        )
      },
    },
  ]
})

function cancelEditable(id: string) {
  editableKeys.value = editableKeys.value.filter(key => key !== id)
}
</script>

<template>
  <pro-card :title="$t('pages.demos.complexForm.dataTable.title')">
    <div class="grid-cols-responsive gap-x-24px">
      <pro-select
        :title="$t('pages.demos.complexForm.dataTable.department')"
        path="department"
        required
        :field-props="{
          options: [
            { label: $t('pages.demos.complexForm.dataTable.departmentTech'), value: 'tech' },
            { label: $t('pages.demos.complexForm.dataTable.departmentMarketing'), value: 'marketing' },
            { label: $t('pages.demos.complexForm.dataTable.departmentSales'), value: 'sales' },
            { label: $t('pages.demos.complexForm.dataTable.departmentFinance'), value: 'finance' },
          ],
        }"
      />
      <pro-select
        :title="$t('pages.demos.complexForm.dataTable.position')"
        path="position"
        required
        :field-props="{
          options: [
            { label: $t('pages.demos.complexForm.dataTable.positionJunior'), value: 'junior' },
            { label: $t('pages.demos.complexForm.dataTable.positionMid'), value: 'mid' },
            { label: $t('pages.demos.complexForm.dataTable.positionSenior'), value: 'senior' },
            { label: $t('pages.demos.complexForm.dataTable.positionExpert'), value: 'expert' },
            { label: $t('pages.demos.complexForm.dataTable.positionManager'), value: 'manager' },
          ],
        }"
      />
      <pro-select
        :title="$t('pages.demos.complexForm.dataTable.level')"
        path="level"
        required
        :field-props="{
          placeholder: $t('pages.demos.complexForm.dataTable.levelPlaceholder'),
          options: [
            { label: 'P1', value: 'p1' },
            { label: 'P2', value: 'p2' },
            { label: 'P3', value: 'p3' },
            { label: 'P4', value: 'p4' },
            { label: 'P5', value: 'p5' },
            { label: 'P6', value: 'p6' },
          ],
        }"
      />
      <pro-edit-data-table
        v-model:editable-keys="editableKeys"
        :title="$t('pages.demos.complexForm.dataTable.personnelManagement')"
        class="col-span-1 md:col-span-2 lg:col-span-3"
        path="list"
        required
        :columns="columns"
        :record-creator-props="{
          record: () => ({ id: `${Date.now()}` }),
        }"
        row-key="id"
      />
    </div>
  </pro-card>
</template>
