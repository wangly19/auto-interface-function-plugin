import mustache from 'mustache'

const temp = `a {{ title }}`

/**
 * 
 * @param tmp 渲染模版
 * @param state 渲染状态
 * @returns { string } 渲染后数据
 */
export function render <T = any>(tmp: string, state: T): string {

  const renderString: string = mustache.render(
    tmp,
    state
  )
  return renderString
}

export function createTemplate() {
  
}
