import { ref } from 'vue'

let eventsBinded = false

export function isDocumentVisible() {
  if (
    typeof document !== 'undefined' &&
    typeof document.visibilityState !== 'undefined'
  ) {
    return document.visibilityState !== 'hidden'
  }
  return true
}

export function useVisibility(onVisible?: (visible: boolean) => void) {
  const visible = ref(isDocumentVisible())
  if (typeof window !== 'undefined' && window.addEventListener && !eventsBinded) {
    window.addEventListener('visibilitychange', () => {
      onVisible && onVisible(isDocumentVisible())
      visible.value = isDocumentVisible()
    })
    // only bind the events once
    eventsBinded = true
  }
  return visible
}
