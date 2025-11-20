<script setup lang="ts">
import { $t } from '@/locales/locales'
</script>

<template>
  <pro-card :title="$t('pages.demos.complexForm.basicInfo.title')">
    <div class="grid-cols-responsive gap-x-24px">
      <pro-input
        :title="$t('pages.demos.complexForm.basicInfo.username')"
        path="username"
        required
      />
      <pro-input
        :title="$t('pages.demos.complexForm.basicInfo.email')"
        path="email"
        required
      />
      <pro-input
        :title="$t('pages.demos.complexForm.basicInfo.phone')"
        path="phone"
        required
      />
      <pro-select
        :title="$t('pages.demos.complexForm.basicInfo.gender')"
        :tooltip="$t('pages.demos.complexForm.basicInfo.gender')"
        path="gender"
        required
        :field-props="{
          options: [
            { label: $t('common.status.male'), value: 'male' },
            { label: $t('common.status.female'), value: 'female' },
            { label: $t('common.status.other'), value: 'other' },
          ],
        }"
      />
      <pro-date
        :title="$t('pages.demos.complexForm.basicInfo.birthDate')"
        path="birthDate"
        required
        :field-props="{
          valueFormat: 'yyyy.MM.dd',
        }"
      />
      <pro-radio-group
        :title="$t('pages.demos.complexForm.basicInfo.status')"
        path="status"
        required
        :field-props="{
          options: [
            { label: $t('common.often.enable'), value: 'active' },
            { label: $t('common.often.disable'), value: 'inactive' },
          ],
        }"
      />
    </div>
  </pro-card>
</template>
