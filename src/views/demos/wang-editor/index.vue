<script setup lang="ts">
import type { IDomEditor } from '@wangeditor/editor'
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { createProForm } from 'pro-naive-ui'
import { computed, ref } from 'vue'
import { $t } from '@/locales/locales'

const value = ref('')
const height = ref(400)
const disabled = ref(false)
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const status = ref<'success' | 'error' | 'warning'>()

const form = createProForm({
  onSubmit: console.log,
})

const model = ref({
  wangeditor: '',
})

const rules = computed<FormRules>(() => {
  return {
    wangeditor: [
      {
        required: true,
        message: $t('pages.demos.wangEditor.pleaseEnterContent'),
        trigger: 'input',
      },
    ],
  }
})

const statusOptions = computed(() => {
  return [
    { label: $t('pages.demos.wangEditor.successStatus'), value: 'success' },
    { label: $t('pages.demos.wangEditor.errorStatus'), value: 'error' },
    { label: $t('pages.demos.wangEditor.warningStatus'), value: 'warning' },
  ]
})

function onCreated(editor: IDomEditor) {
  console.log($t('pages.demos.wangEditor.editorCreated'), editor)
}

function onDestroyed(editor: IDomEditor) {
  console.log($t('pages.demos.wangEditor.editorDestroyed'), editor)
}

function handleValidate(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success($t('pages.demos.wangEditor.validateSuccess'))
    }
    else {
      console.log(errors)
      message.error($t('pages.demos.wangEditor.validateFailed'))
    }
  })
}
</script>

<template>
  <div class="size-full justify-center items-center">
    <n-card :title="$t('pages.demos.wangEditor.basicUsage')">
      <div class="grid-cols-responsive-1-3-3 gap-4 mb-4">
        <div>
          <div>{{ $t('pages.demos.wangEditor.editorHeight') }}</div>
          <n-input-number
            v-model:value="height"
          />
        </div>
        <div>
          <div>{{ $t('pages.demos.wangEditor.status') }}</div>
          <n-select
            v-model:value="status"
            :options="statusOptions"
            clearable
          />
        </div>
        <div>
          <div>{{ $t('pages.demos.wangEditor.disabled') }}</div>
          <n-switch v-model:value="disabled" />
        </div>
      </div>
      <wang-editor
        v-model="value"
        :status="status"
        :disabled="disabled"
        :height="`${height}px`"
        @on-created="onCreated"
        @on-destroyed="onDestroyed"
      />
    </n-card>
    <n-card
      :title="$t('pages.demos.wangEditor.usingProForm')"
      class="my-4"
    >
      <pro-form :form="form">
        <pro-wang-editor
          :title="$t('pages.demos.wangEditor.richText')"
          path="wangeditor"
          required
        />
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <n-button
              round
              type="primary"
              attr-type="submit"
            >
              {{ $t('pages.demos.wangEditor.submit') }}
            </n-button>
          </n-col>
        </n-row>
      </pro-form>
    </n-card>
    <n-card
      :title="$t('pages.demos.wangEditor.usingNForm')"
      class="my-4"
    >
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
      >
        <n-form-item
          path="wangeditor"
          :label="$t('pages.demos.wangEditor.richText')"
        >
          <wang-editor v-model="model.wangeditor" />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <n-button
              round
              type="primary"
              @click="handleValidate"
            >
              {{ $t('pages.demos.wangEditor.validate') }}
            </n-button>
          </n-col>
        </n-row>
      </n-form>
    </n-card>
  </div>
</template>
