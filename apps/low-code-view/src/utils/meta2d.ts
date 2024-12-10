import { parseSvg } from '@meta2d/svg'
import type { Pen } from '@meta2d/core'

export interface CustomPen {
  name: string
  image: string
  data?: Pen
  component?: boolean
  svg?: string
  crossOrigin?: string
}

export async function svgToPens(image: string): Promise<CustomPen> {
  const name = getFileName(image)
  const resData = await fetch(image).then((res) => res.text())
  const data = resData
  return {
    name,
    image,
    svg: resData,
    data: parseSvg(data),
    component: true
  }
}

export function pngToPens(image: string): CustomPen {
  const name = getFileName(image)
  const ext = image.split('.').pop()
  return {
    name,
    image,
    data: {
      name: ext,
      // text: name,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      image,
      imageRatio: true,
      crossOrigin: 'undefined' //默认是'anonymous'
    }
  }
}

export function getFileName(path: string) {
  const start = path.lastIndexOf('/')
  const end = path.lastIndexOf('.')
  return path.substring(start + 1, end)
}

export function fileSvgPath() {
  const fileList = import.meta.glob('/public/source/**/*.{svg,png,gif,jpg}')
  let lists = Object.keys(fileList).map((item) => {
    const nameFiles = item.split('/')[3]
    return nameFiles
  })
  lists = [...new Set(lists)]
  function utilsList(list: any) {
    const objList: any = []
    list.forEach((item: any) => {
      const obj: any = {
        name: item,
        list: []
      }
      Object.keys(fileList).forEach((ele) => {
        const nameFiles = ele.split('/')[3]
        if (nameFiles === item) {
          obj.list.push(ele.replace('/public', ''))
        }
      })
      objList.push(obj)
    })
    return objList
  }
  return utilsList(lists)
}

// 生成UUID
export function generateUUID() {
  let uuid = '',
    ii
  const characters = '0123456789abcdef'

  for (ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 12:
      case 16:
      case 20:
        uuid += '-'
        break
      default:
        uuid += characters[Math.floor(Math.random() * 16)]
    }
  }

  return uuid
}

export const getToken = () => {
  const token = localStorage.getItem('TOKEN')
  return token
}
export const setToken = (token: string) => localStorage.setItem('TOKEN', token);

export const getUserInfo = () => JSON.parse(localStorage.getItem('USERINFO') || '{}');
export const setUserInfo = (data: any) => localStorage.setItem('USERINFO', JSON.stringify(data));

export const clearToken = () => {
  localStorage.removeItem('TOKEN');
  localStorage.removeItem('USERINFO');
};

export function fileJsonPath() {
  const list: any = []
  const fileList = import.meta.glob('/public/module/**/*.json')
  const lists: any = Object.keys(fileList).map((item) => item.replace('/public', ''))
  lists.forEach((item: any) => {
    list.push({
      name: getFileName(item),
      path: item
    })
  })
  return list
};

export const fetchJson = (path: string) => {
  return new Promise<void>((resolve, reject) => {
    fetch(path)
      .then((res) => res.json())
      .then((res) => {
        res.locked = 4 // 视图锁定配置-0：未锁定，1：禁止拖拽/编辑图元；图元可选中、高亮、触发事件等，2：禁止编辑图元、禁止左键移动画布；图元可选中、高亮、触发事件等 ，3：禁止缩放画布，4：禁止左键移动和缩放画布，10-画布不能移动和缩放，图元不能触发任何事件
        resolve(res)
      })
  })
};
