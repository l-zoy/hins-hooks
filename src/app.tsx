import { defineComponent, reactive, watch, onMounted, Fragment, ref } from 'vue'
// import { useRequest } from '../hooks/useRequest'
// import { useVisibility } from '../hooks/useVisibility'
import { useSole } from '../hooks/useSole'

export default defineComponent({
  name: 'Tsx',

  setup() {
    const root = ref<HTMLElement>()
    const drownFresh = ref<HTMLElement>()
    const a = reactive({
      list: Array(100)
        .fill(0)
        .map((i, j) => j),
      foo: 2
    })

    // const { data, click, loading, cancel } = useRequest(
    //   [
    //     {
    //       url: 'https://mock.mengxuegu.com/mock/60646da4987c3024c3ba1a39/testget',
    //       params: { kda: 1 },
    //       type: 'get'
    //     }
    //   ],
    //   { pollingInterval: 1000, manual: true }
    // )

    // const visibility = useVisibility(() => {
    //   console.log(123)
    // })
    const sole = useSole('kda')

    watch(sole, () => {
      console.log(sole.value, '111')
    })

    onMounted(() => {
      let offsetY: number
      let MoveOffset: number
      drownFresh.value!.style.marginTop = '-100px'
      let timer: NodeJS.Timeout

      if (root.value) {
        root.value.addEventListener('touchstart', function (e) {
          offsetY = e.touches[0].pageY
        })

        root.value.addEventListener('touchmove', function (e) {
          if (root.value?.scrollTop) {
            return
          }

          MoveOffset = e.touches[0].pageY - offsetY
          if (MoveOffset < 0 || MoveOffset > 180) return
          drownFresh.value!.style.transition = ''
          drownFresh.value!.style.marginTop = `-${100 - MoveOffset}px`
        })

        root.value.addEventListener('touchend', () => {
          if (MoveOffset > 60) {
            clearTimeout(timer)
            timer = setTimeout(() => {
              drownFresh.value!.style.transition = 'all .2s'
              console.log('刷新了')
              drownFresh.value!.style.marginTop = `-${100}px`

              offsetY = 0
              MoveOffset = 0
            }, 800)
          } else {
            //
          }
        })
      }
    })
    // onClick={click}

    return () => {
      return (
        <Fragment>
          <div
            ref={root}
            style={{ height: '100vh', background: 'red', overflow: 'auto' }}
          >
            <div
              ref={drownFresh}
              style={{
                background: 'red',
                width: '100%',
                height: '100px',
                // transition: 'all 0.2s',
                lineHeight: '100px',
                textAlign: 'center'
              }}
            >
              loading
            </div>
            {a.list.map((i) => {
              return (
                <div
                  key={i}
                  style={{
                    width: '100%',
                    height: '30px',
                    background: 'blue',
                    borderBottom: '#fff solid 2px'
                  }}
                >
                  {i}
                </div>
              )
            })}
            {/* </div>

          <div class="hello" onClick={cancel}>
            {a.data}
            {`${loading.value}`}
          </div>
          {data.value.map((item) => {
            return <div key={item}>{JSON.stringify(item)}</div>
          })}

          <div
            id="kda"
            style={{
              height: '200px',
              background: 'red',
              width: '100px',
              overflow: 'auto'
            }}
          >
            <div style={{ height: '300px', width: '100%', background: 'blue' }}></div> */}
          </div>
        </Fragment>
      )
    }
  }
})
