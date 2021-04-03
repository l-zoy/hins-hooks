import { AxiosRequestConfig, AxiosInstance } from 'axios'

export type Timer = ReturnType<typeof setTimeout> | undefined

export type cachedData = { data: any; timer: Timer; startTime: number; freshTime: number }

export interface IRequestOptions {
  config?: AxiosRequestConfig
  data?: any
  interceptors?: {
    request: {
      onFulfilled?: <V>(value: V) => V | Promise<V>
      onRejected?: (error: any) => any
    }
    response: {
      onFulfilled?: <V>(value: V) => V | Promise<V>
      onRejected?: (error: any) => any
    }
  }
}

export type IAxiosInstanceMethods = Omit<
  {
    [key in keyof AxiosInstance]: AxiosInstance[key]
  },
  'defaults' | 'interceptors' | 'getUri' | 'request'
>

export type IAxiosInstanceTypes = keyof IAxiosInstanceMethods

export type IUseRequestOptions = {
  url: string
  data?: any
  params?: any
  config?: AxiosRequestConfig
  type: IAxiosInstanceTypes
}

export interface IUseRequest {
  request: Omit<IUseRequestOptions, 'params'>[]
  type: IAxiosInstanceTypes
}
