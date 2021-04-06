import { defineComponent, Fragment } from 'vue'
import { useRequest } from '../hooks/useRequest'
// import { useVisibility } from '../hooks/useVisibility'
// reactive, watch, onMounted,
export default defineComponent({
  name: 'Tsx',

  setup() {
    // const root = ref<HTMLElement>()
    // const drownFresh = ref<HTMLElement>()
    // const a = reactive({
    //   list: Array(100)
    //     .fill(0)
    //     .map((i, j) => j),
    //   foo: 2
    // })

    const { data, loading, cancel } = useRequest([
      {
        url: 'https://mock.mengxuegu.com/mock/60646da4987c3024c3ba1a39/testget',
        params: { kda: 1 },
        type: 'get'
      },
      {
        url: 'https://mock.mengxuegu.com/mock/60646da4987c3024c3ba1a39/testget',
        params: { kda: 1 },
        type: 'get'
      }
    ])

    // const visibility = useVisibility(() => {
    //   console.log(123)
    // })

    // onClick={click}

    return () => {
      data.value.forEach((item) => {
        console.log(item)
      })

      return (
        <Fragment>
          {/* <div ref={root} style={{ height: '100vh', overflow: 'auto' }}> */}
          {/* <div
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
            })} */}
          {/* </div> */}

          <div class="hello" onClick={cancel}>
            {`${loading.value}`}
          </div>
          {data.value.map((item) => {
            return <div key={item}>{JSON.stringify(item.data)}1</div>
          })}

          {/* <div
            id="kda"
            style={{
              height: '200px',
              background: 'red',
              width: '100px',
              overflow: 'auto'
            }}
          >
            <div style={{ height: '300px', width: '100%', background: 'blue' }}></div>
          </div> */}
        </Fragment>
      )
    }
  }
})
