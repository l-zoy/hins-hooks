import { cachedData, Timer } from './types'

const cache = new Map<string, cachedData>()

const setCache = (key: string, data: any, freshTime: number, cacheTime: number) => {
  const currentCache = cache.get(key)
  if (currentCache && currentCache.timer) {
    clearTimeout(currentCache.timer)
  }

  let timer: Timer

  if (cacheTime > -1) {
    timer = setTimeout(() => {
      cache.delete(key)
    }, cacheTime)
  }

  cache.set(key, {
    data,
    timer,
    freshTime,
    startTime: new Date().getTime()
  })
}

const getCache = (key: string) => {
  return { ...cache.get(key) }
}

export { getCache, setCache }
