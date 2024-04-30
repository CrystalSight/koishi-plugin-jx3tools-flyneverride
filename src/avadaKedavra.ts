import { Context } from 'koishi'
import axios from 'axios';

export const name = 'avadaKedavra'

export async function apply(ctx: Context) {  //主程序
  //START 读取数据库并赋值
  const kedavraAPI_ = await ctx.database.get('jx3tools', [0], ['kedavraAPI'])  //啃大瓜API地址
  const kedavraAPI = kedavraAPI_[0].kedavraAPI
  const kedavraToken_ = await ctx.database.get('jx3tools', [0], ['kedavraToken']) //啃大瓜API鉴权令牌
  const kedavraToken = kedavraToken_[0].kedavraToken
  //END 读取数据库并赋值

  ctx.command('课代表 <num>', '吃瓜内容总结')
    .usage('贴吧吃瓜内容总结，例如：课代表 2220691266')
    .option('num', '帖子id 如 http://tieba.baidu.com/p/2220691266 中数字')
    .action(async ({ }, num) => {
      try {
        const body = {
          "gossip_id": num,
          "only_thread_author": true
        }
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${kedavraToken}`
        };
        const response = await axios.post(kedavraAPI, body, { headers });
        if (response.data) {
          return (response.data.msg)
        } else {
          return ('帖子不存在')
        }
      } catch (error) {
        console.error(error);
        return '发生错误，请稍后再试。';
      }
    })
}
