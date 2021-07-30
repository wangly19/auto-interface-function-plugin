import fs from 'fs'
import { watch, FSWatcher } from 'chokidar'
import { defaultOptions, DtsFile, TestSpec, PluginName } from './shard'
import { WatcherAction } from './operations'
import { GeneratorRequestConfig } from './parse'
import { Compiler } from 'webpack'

export { defineRequestConfig } from './parse'

interface PluginOptions {
  dirPath?: string,
  requestPath?: string,
  hbsPath?: string
}

type CacheParseMaps = Record<string, Map<string, GeneratorRequestConfig>>


export class AutoInterfaceService{

  private hasWatcher: boolean

  private watcher: FSWatcher | null

  private cacheMap: CacheParseMaps
  
  private readonly opt: PluginOptions
  
  constructor(readonly options: PluginOptions = defaultOptions){

    /** 初始化传入的配置 */
    this.opt = options
    this.hasWatcher = false
    this.cacheMap = {}

  }

  /**
   * 常见之前的初始化
   * @returns { void }
   */
  beforeCreate (): void {
    if (this.hasWatcher) {
      this.watcher = watch(this.opt.dirPath)
      this.watcher.on('change', () => {})
                  .on('unlink', () => {})
                  .on('add', () => {})
    }
  }

  /**
   * 绑定函数
   * @param complier 解析器
   */
  apply(complier: Compiler) {

    // watchRun钩子事件
    complier.hooks.watchRun.tap(PluginName, () => {
      this.hasWatcher = true
    })

    // 完成事件
    complier.hooks.done.tap(PluginName, () => {
      this.beforeCreate()
    })

    // watchClose钩子事件
    complier.hooks.watchClose.tap(PluginName, () => {
      this.hasWatcher = false
    })
  }

  /**
   * 查找所有的服务目录地址
   * @returns 文件目录
   */
  findAllServiceDirs(): string[] {
    const dirs: string[] = fs.readdirSync(this.opt.dirPath)

    dirs.filter(name => {
      if (DtsFile.test(name)) return
      if (TestSpec.test(name)) return
      this.cacheMap[name] = new Map<string, GeneratorRequestConfig>()
      return name
    })

    return dirs
  }

  /**
   * 文件变化产生的回调
   * @param action 监听文件的动作
   * @param fileName 产生变化的文件名称
   * @returns { void }
   */
  watcherChangeEvent(action: WatcherAction, fileName: string) {}

}
