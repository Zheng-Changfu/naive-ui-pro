import { presetWind3 } from '@unocss/preset-wind3'
import { defineConfig, presetTypography } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(vue|[jt]sx|[jt]s|html)($|\?)/,
      ],
    },
  },
  presets: [
    presetWind3(),
    presetTypography(),
  ],
  shortcuts: [
    {
      'grid-cols-responsive': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    },
    [
      /^grid-cols-responsive-(\d)-(\d)-(\d)$/,
      ([, sm, md, lg]) =>
        `grid grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg}`,
    ],
  ],
})
