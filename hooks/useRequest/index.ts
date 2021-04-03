import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ref, onUnmounted, watch } from 'vue'
import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'
import merge from 'lodash.merge'

import { getCache, setCache } from './cache'
import { IAxiosInstanceTypes, IUseRequestOptions, IRequestOptions } from './types'

let axiosInstance: AxiosInstance
const cacheTimer = new Map()

export function useRequestGlobal(options: IRequestOptions) {
  const { config, interceptors } = options
  axiosInstance = axios.create(config)

  if (interceptors) {
    if (interceptors.request) {
      axiosInstance.interceptors.request.use(
        interceptors.request.onFulfilled,
        interceptors.request.onRejected
      )
    }

    if (interceptors.response) {
      axiosInstance.interceptors.response.use(
        interceptors.response.onFulfilled,
        interceptors.response.onRejected
      )
    }
  }
}

function requestInstance(
  url: string,
  options: IRequestOptions & { type: IAxiosInstanceTypes }
) {
  const { type, data, config } = options
  const lowerType = type.toLowerCase() as IAxiosInstanceTypes
  const axiosIst = axiosInstance[lowerType]

  switch (type) {
    case 'get':
    case 'delete':
    case 'head':
    case 'options':
      return axiosIst(url, config)
    case 'post':
    case 'put':
    case 'patch':
      return axiosIst(url, data, config)
    default:
      throw new Error(`The wrong type: ${type}`)
  }
}

function useRequestBase(requests: IUseRequestOptions[], useOptions: any) {
  const {
    manual,
    pollingInterval,
    pollingWhenHidden,
    debounceInterval,
    throttleInterval,
    refreshDeps,
    cacheKey,
    freshTime = 0,
    cacheTime = 5 * 60 * 1000,
    loadingDelay
  } = useOptions
  const data = ref<any[]>([])
  const loading = ref(false)

  const request: (() => Promise<AxiosResponse<any>>)[] = []

  const identifie = JSON.stringify(requests)

  requests.forEach((r) => {
    request.push(() => requestInstance(r.url, r))
  })

  let chainRequestCantext = ''
  const onDone = 'resolve(memo);'
  let current = onDone

  for (let index = request.length - 1; index >= 0; index--) {
    const unroll = current !== onDone
    if (unroll) {
      chainRequestCantext += `function next${index}(){ ${current} } \n`
      current = `next${index}();\n`
    }

    const unrollCantext = unroll ? `next${index}()` : onDone
    const content = `
      const promise${index} = request[${index}]()
      promise${index}.then((rest${index})=>{
        memo.push(rest${index})
        ${unrollCantext};
      },(err)=>{
        memo.push({data:{...err}, error:true})
        ${unrollCantext};
      })`
    current = content
  }

  chainRequestCantext += current

  const code = `
  return new Promise((resolve, reject) => {
    const memo = []
    ${chainRequestCantext}
  })`

  const http = new Function('request', code)

  function setLoading() {
    if (loadingDelay) {
      cacheTimer.set(
        identifie,
        setTimeout(() => {
          loading.value = true
          clearTimeout(cacheTimer.get(identifie))
        }, loadingDelay)
      )
    } else {
      loading.value = true
    }
  }

  function runBase() {
    if (cacheKey) {
      const cache = getCache(cacheKey)
      const currentTime = new Date().getTime()
      if (Object.keys(cache) && currentTime - cache.startTime! < cache.freshTime!) {
        data.value = cache.data
        setLoading()
        return
      }
    }

    const httpValue = <Promise<any>>http(request)
    httpValue.then((res) => {
      data.value = res
      setLoading()
      if (cacheKey) {
        setCache(cacheKey, res, freshTime, cacheTime)
      }
    })
  }

  let run = runBase
  let cancel = () => {}
  let click = () => {}

  if (pollingInterval) {
    cancel = () => {
      clearInterval(cacheTimer.get(identifie))
    }
    run = () => {
      cacheTimer.set(identifie, setInterval(runBase, pollingInterval))
    }

    if (pollingWhenHidden !== false) {
      onUnmounted(cancel)
    }
  }

  if (manual) {
    click = run

    if (pollingInterval) {
      click = () => {
        const pollingKey = cacheTimer.get(identifie)

        if (pollingKey) {
          cancel()
        }
        run()
      }
    }

    if (debounceInterval) {
      click = debounce(run, debounceInterval)
    } else if (throttleInterval) {
      click = throttle(run, throttleInterval)
    }
  } else {
    run()
  }

  refreshDeps && watch(refreshDeps, run)

  return { data, click, loading, cancel }
}

export function useRequest(
  request: IUseRequestOptions | IUseRequestOptions[],
  useOptions: any = {}
) {
  if (Array.isArray(request)) {
    request = request.map((item) => {
      item.config = merge({ params: item.params }, item.config)
      return item
    })
  } else {
    request.config = merge({ params: request.params }, request.config)
    request = [request]
  }

  return useRequestBase(request, useOptions)
}
