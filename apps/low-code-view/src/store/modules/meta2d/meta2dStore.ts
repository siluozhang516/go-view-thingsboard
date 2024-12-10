import { defineStore } from 'pinia'
import RTOJson from '../../../../public/module/RTO.json'
import LQTJson from '../../../../public/module/LQT.json'
import ZYKTJson from '../../../../public/module/ZYKT.json'
import ZLZJson from '../../../../public/module/ZLZ.json'

export interface Meta2dConfig {
  dataset: string;
  image: string;
  title:string;
  json: any;
}
export interface Meta2dStoreType {
  meta2dList: Meta2dConfig[]
}

export const useMeata2dStore = defineStore({
  id: 'useMeata2dStore',
  state: (): Meta2dStoreType => ({
    meta2dList: [
      {
        dataset:'RTO',
        image:'RTO.png',
        title:'RTO废气处理',
        json:RTOJson
      },
      {
        dataset:'LQT',
        image:'LQT.png',
        title:'冷却塔',
        json:LQTJson
      },
      {
        dataset:'ZYKT',
        image:'ZYKT.png',
        title:'中央空调',
        json:ZYKTJson
      },
      {
        dataset:'ZLZ',
        image:'ZLZ.png',
        title:'制冷站',
        json:ZLZJson
      },
    ]
  }),
  getters: {
    getMeta2dsList(): Meta2dConfig[] {
      return this.meta2dList
    }
  },
  actions: {
    addMeata2d(config: Meta2dConfig) {
      let matchConfig = this.meta2dList.find(item => item.dataset === config.dataset)
      if (matchConfig) {
        matchConfig = config
      } else {
        this.meta2dList.push(config)
      }
    }
  }
})
