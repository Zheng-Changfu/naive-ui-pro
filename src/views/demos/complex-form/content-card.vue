<script setup lang="ts">
import { $t } from '@/locales/locales'
</script>

<template>
  <pro-card :title="$t('pages.demos.complexForm.contentInfo.title')">
    <div class="grid-cols-responsive gap-x-24px">
      <pro-input
        :title="$t('pages.demos.complexForm.contentInfo.contentTitle')"
        path="contentTitle"
        required
      />
      <pro-select
        :title="$t('pages.demos.complexForm.contentInfo.category')"
        path="category"
        required
        :field-props="{
          options: [
            { label: $t('pages.demos.complexForm.contentInfo.categoryTech'), value: 'tech' },
            { label: $t('pages.demos.complexForm.contentInfo.categoryProduct'), value: 'product' },
            { label: $t('pages.demos.complexForm.contentInfo.categoryGuide'), value: 'guide' },
            { label: $t('pages.demos.complexForm.contentInfo.categoryOther'), value: 'other' },
          ],
        }"
      />
      <pro-select
        :title="$t('pages.demos.complexForm.contentInfo.tags')"
        path="tags"
        required
        :field-props="{
          multiple: true,
          options: [
            { label: $t('pages.demos.complexForm.contentInfo.tagVue'), value: 'vue' },
            { label: $t('pages.demos.complexForm.contentInfo.tagReact'), value: 'react' },
            { label: $t('pages.demos.complexForm.contentInfo.tagJavaScript'), value: 'javascript' },
            { label: $t('pages.demos.complexForm.contentInfo.tagTypeScript'), value: 'typescript' },
            { label: $t('pages.demos.complexForm.contentInfo.tagCSS'), value: 'css' },
            { label: $t('pages.demos.complexForm.contentInfo.tagHTML'), value: 'html' },
          ],
        }"
      />
      <pro-date-time
        :title="$t('pages.demos.complexForm.contentInfo.publishTime')"
        path="publishTime"
        required
        :field-props="{
          valueFormat: 'yyyy.MM.dd HH:mm:ss',
        }"
      />
      <pro-form-list
        :title="$t('pages.demos.complexForm.contentInfo.dynamicList')"
        path="dynamicList"
        required
        class="col-span-1 md:col-span-1 lg:col-span-2"
        only-show-first-item-label
      >
        <pro-input
          :title="$t('pages.demos.complexForm.contentInfo.itemName')"
          path="name"
          required
        />
        <pro-digit
          :title="$t('pages.demos.complexForm.contentInfo.itemValue')"
          path="value"
          required
          :field-props="{
            min: 0,
          }"
        />
      </pro-form-list>
      <pro-wang-editor
        :title="$t('pages.demos.complexForm.contentInfo.content')"
        path="content"
        required
        class="col-span-1 md:col-span-2 lg:col-span-3"
      />
    </div>
  </pro-card>
</template>
