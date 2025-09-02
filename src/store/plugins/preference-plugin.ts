import type { Pinia, PiniaPluginContext, Store } from 'pinia'
import { preferenceConfig } from '@root/preference'
import { useClipboard, useEventListener } from '@vueuse/core'
import { cloneDeep, get, has, set } from 'lodash-es'

declare module 'pinia' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    preference?: {
      /**
       * 从 store 中选择需要处理的 key，第一个参数是 store 的 key 数组，第二个参数是 store 的 key 前缀
       */
      pick: [string[], string]
    }
  }

  export interface PiniaCustomProperties {
    /**
     * 重置所有 store 的偏好
     */
    $resetAllPreference: () => void
    /**
     * 恢复所有 store 的偏好到配置文件默认值
     */
    $restoreAllPreference: () => void
    /**
     * 复制所有 store 的偏好到剪贴板
     */
    $copyAllPreference: () => void
  }
}

const { copy } = useClipboard()
let registedBeforeunloadEvent = false
let userClearedStorage = false // 标记用户是否清除了存储
const storeIdToKeysInitialValueRecord = new Map<string, {
  prefixPath: string
  initialValueMap: Map<string, any>
}>()

export function preferencePlugin({ pinia, options, store, app }: PiniaPluginContext) {
  if (options.preference) {
    const { pick } = options.preference
    const [keys, prefixPath] = pick
    keys.forEach((key) => {
      if (!has(store, key)) {
        return
      }
      if (!storeIdToKeysInitialValueRecord.has(store.$id)) {
        storeIdToKeysInitialValueRecord.set(store.$id, {
          prefixPath,
          initialValueMap: new Map(),
        })
      }
      storeIdToKeysInitialValueRecord
        .get(store.$id)!
        .initialValueMap
        .set(key, cloneDeep(store[key]))
      const finalValue = getPreferenceFromStorage(`${prefixPath}.${key}`, store[key])
      store[key] = finalValue
    })
  }

  store.$resetAllPreference = () => {
    const storeMap = (pinia as any)._s as Map<string, Store>
    storeMap.forEach((s) => {
      if (!storeIdToKeysInitialValueRecord.has(s.$id)) {
        return
      }
      const { initialValueMap } = storeIdToKeysInitialValueRecord.get(s.$id)!
      initialValueMap.forEach((value, key) => {
        (s as any)[key] = value
      })
    })
  }
  store.$restoreAllPreference = () => {
    const storeMap = (pinia as any)._s as Map<string, Store>
    storeMap.forEach((s) => {
      if (!storeIdToKeysInitialValueRecord.has(s.$id)) {
        return
      }
      const { prefixPath, initialValueMap } = storeIdToKeysInitialValueRecord.get(s.$id)!
      initialValueMap.forEach((_, key) => {
        const configValue = get(preferenceConfig, `${prefixPath}.${key}`)
        if (configValue !== undefined) {
          (s as any)[key] = configValue
        }
      })
    })
  }

  store.$copyAllPreference = () => {
    const preferences = getAllPreference(pinia)
    copy(JSON.stringify(preferences, null, 2))
  }

  if (!registedBeforeunloadEvent) {
    registedBeforeunloadEvent = true

    // 监听storage事件，检测用户是否清除了localStorage
    useEventListener('storage', (e) => {
      if (e.key === 'preference' && e.newValue === null) {
        userClearedStorage = true
      }
    })

    // 定期检查localStorage是否被清空（处理同标签页清除的情况）
    const checkStorageInterval = setInterval(() => {
      const currentPreference = localStorage.getItem('preference')
      if (currentPreference === null && !userClearedStorage) {
        userClearedStorage = true
      }
    }, 1000)

    useEventListener('beforeunload', () => {
      clearInterval(checkStorageInterval)

      // 如果用户清除了存储,恢复到默认值
      if (userClearedStorage) {
        store.$restoreAllPreference()
      }

      localStorage.setItem('preference', JSON.stringify(getAllPreference(pinia)))
    })
  }

  app.onUnmount(() => {
    registedBeforeunloadEvent = false
    userClearedStorage = false // 重置标记
    localStorage.removeItem('preference')
    storeIdToKeysInitialValueRecord.clear()
    delete (store as any).$copyAllPreference
    delete (store as any).$resetAllPreference
  })
}

function getAllPreference(pinia: Pinia) {
  const preferences = {} as any
  const storeMap = (pinia as any)._s as Map<string, Store>
  storeMap.forEach((s) => {
    if (!storeIdToKeysInitialValueRecord.has(s.$id)) {
      return
    }
    const {
      prefixPath,
      initialValueMap,
    } = storeIdToKeysInitialValueRecord.get(s.$id)!
    initialValueMap.forEach((_, key) => {
      set(preferences, `${prefixPath}.${key}`, (s as any)[key])
    })
  })
  return preferences
}

function getPreferenceFromStorage(key: string, fallback: any) {
  const preference = localStorage.getItem('preference')
  if (preference) {
    const parsedPreference = JSON.parse(preference)
    return get(parsedPreference, key, fallback)
  }
  return fallback
}
