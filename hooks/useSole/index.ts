import { ref, onMounted } from 'vue'

export function useSole(
  root: string,
  callback?: (
    isSole: boolean,
    scrollProperty: { scrollHeight: number; scrollTop: number; clientHeight: number }
  ) => void
) {
  const sole = ref(false)

  onMounted(() => {
    const scrollBox = document.getElementById(root)

    if (scrollBox) {
      scrollBox.onscroll = () => {
        const { scrollHeight } = scrollBox
        const { scrollTop } = scrollBox
        const { clientHeight } = scrollBox

        const isSole = scrollHeight - clientHeight === scrollTop
        if (sole.value !== isSole) {
          sole.value = isSole
          callback && callback(isSole, { scrollHeight, scrollTop, clientHeight })
        }
      }
    }
  })

  return sole
}
