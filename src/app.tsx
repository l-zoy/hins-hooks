import { defineComponent, reactive, watch, onMounted, Fragment, ref } from 'vue'
// import { useRequest } from '../hooks/useRequest'
// import { useVisibility } from '../hooks/useVisibility'
import { useSole } from '../hooks/useSole'

export default defineComponent({
  name: 'Tsx',
  emits: ['hello'],
  setup(_, { emit }) {
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
      let MoveOffset
      // let timer

      if (root.value) {
        root.value.addEventListener('touchstart', function (e) {
          offsetY = e.touches[0].pageY
          // console.log(offsetY)
        })

        root.value.addEventListener('touchmove', function (e) {
          if (root.value?.scrollTop) {
            return
          }
          // console.log(root.value?.scrollTop)

          MoveOffset = e.touches[0].pageY - offsetY
          if (MoveOffset < 0 || MoveOffset > 180) return

          console.log(MoveOffset)

          drownFresh.value!.style.marginTop = `-${MoveOffset}px`

          // if (MoveOffset < 0 || MoveOffset > 180) return
          // console.log(e.touches[0].pageY - offsetY)
          // if (root.value!.scrollTop !== 0) return //	不到顶部不做操作
          // MoveOffset = e.touches[0].pageY - offsetY // 下拉的距离
          // if (MoveOffset < 0 || MoveOffset > 180) return // 避免初始化赋值  || 下拉距离超过180 停止拉伸
          // drownFresh.style.marginTop = `-${drownFresh_hold.offsetHeight - MoveOffset}px`
          // // if(drownFresh_hold.offsetHeight-MoveOffset<0){
          // // 	this.style.transform = `translateY(${MoveOffset}px)` //	动态拉伸距离
          // // 	this.style.transition = '' // 动画清0
          // // }
          // //  下拉距离超过60 箭头转向
          // MoveOffset > 60
          //   ? iconEl.classList.add('active')
          //   : iconEl.classList.remove('active')
        })
      }
    })
    // onClick={click}
    emit('hello', 521)
    return () => {
      return (
        <Fragment>
          <div
            ref={root}
            style={{ height: '100vh', background: 'red', overflow: 'auto' }}
          >
            <div
              ref={drownFresh}
              style={{ background: 'red', width: '100%', height: '100px' }}
            ></div>
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
