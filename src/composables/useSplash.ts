import { ref } from 'vue'

const isSeen = typeof window !== 'undefined' && window.sessionStorage 
  ? window.sessionStorage.getItem('splash_seen') === 'true'
  : false

export const splashDone = ref(isSeen)

export function markSplashDone() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem('splash_seen', 'true')
  }
  splashDone.value = true
}
