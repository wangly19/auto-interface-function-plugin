export type RequestMethod ='POST' | 
                    'post' | 
                    'GET' | 
                    'get' | 
                    'PUT' | 
                    'put' | 
                    'DELETE' | 
                    'delete' | 
                    'PATCH' | 
                    'patch' | 
                    'OPTIONS' | 
                    'options'

export type RequestPath = `${RequestMethod} /${string}`

export type RequestParseConfig = Record<string, RequestPath>

export interface GeneratorRequestConfig {
  /** @name 转换后函数名称 */
  funName: string
  /** @name 请求的url */
  url: string
  /** @name 请求方法 */
  method: RequestMethod
  /** @name params参数集合 */
  linkParams: string[]
  /** @name 请求参数 */
  paramsType: 'data' | 'params' | 'query'
}

/**
 * 
 * @param name 当前function名称
 * @param text 当前解析配置
 * @returns { null | GeneratorRequestConfig } 解析后的对象
 */
export function parseRequestConfig (
  funName: string,
  text: string
): null | GeneratorRequestConfig {
  if (text) {
    const[method, path] = text.split(' ') as [RequestMethod, string]
    const { url, params } = findCurrentPathParams(path)
    return {
      funName,
      url,
      method,
      linkParams: params,
      paramsType: 'query'
    }
  }
  return null
}

/**
 * 
 * @param path 当前配置的路径
 * @example
 * '/app-message/post/:type/:mode'
 * @returns 
 */
export function findCurrentPathParams (path: string) {
  const [url, ...params] = path.split('/:')
  const stringifyParams = params.map(p => '/${' + p + '}')
  return {
    url: `${url}${stringifyParams.join('')}`,
    params
  }
}

/**
 * 接口检查校验，对传入的配置参数做检查，同时进行返回
 * @param config 接口配置
 * @returns 接口配置
 */
export function defineRequestConfig (config: RequestParseConfig): RequestParseConfig {
  return config
}