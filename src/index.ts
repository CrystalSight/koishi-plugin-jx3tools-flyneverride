import { Context, Schema } from 'koishi'
import * as avadaKedavra from './avadaKedavra'

export const name = 'jx3tools-flyneverride'
export const usage = '收录零散小工具。为消除大佬们是否公开接口的影响，所有功能需自行填入接口地址及鉴权。详情见主页'

export interface Config {  //配置界面复杂，不会写接口类型，开摆！
  [x: string]: any;
}

declare module 'koishi' {  //数据库新建表"Configuration"
  interface Tables {
    jx3tools: ScheduleJX3toolsConfig
  }
}

// 这里是新增数据库表的接口类型
export interface ScheduleJX3toolsConfig {  //JX3tools配置
  id: number
  enabledKedavra: number
  kedavraAPI: string
  kedavraToken: string
}

export const Config: Schema<Config> = Schema.intersect([  //配置界面
  //受姐姐的API
  Schema.object({
    enabledKedavra: Schema.boolean().default(false).description('赞美受姐姐')  //是否启用啃大瓜接口
  }).description('阿瓦达啃大瓜'),
  Schema.union([
    Schema.object({
      enabledKedavra: Schema.const(true).required().description('赞美受姐姐'),
      kedavraAPI: Schema.string().required().description('啃大瓜接口地址'),  //啃大瓜API地址
      kedavraToken: Schema.string().required().description('啃大瓜鉴权令牌'),  //啃大瓜API鉴权令牌
    }),
    Schema.object({}),
  ]),
])

export function apply(ctx: Context, config: Config) {  //主程序
  //START 数据库JX3tools配置
  ctx.model.extend('jx3tools', {  // 各字段的类型声明
    id: 'unsigned',  //索引
    enabledKedavra: 'unsigned',  //是否启用啃大瓜接口
    kedavraAPI: 'string',  //啃大瓜API地址
    kedavraToken: 'string',  //啃大瓜API鉴权令牌
  })

  ctx.database.upsert('jx3tools', (row) => [  //将配置录入数据库
    {
      id: 0,  //索引
      enabledKedavra: config.enabledKedavra,  //是否启用啃大瓜接口
      kedavraAPI: config.kedavraAPI,  //啃大瓜API地址
      kedavraToken: config.kedavraToken,  //啃大瓜API鉴权令牌
    }
  ])

  if (config.enabledKedavra) {
    ctx.plugin(avadaKedavra);
  }
}
