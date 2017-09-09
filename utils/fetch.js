import toast from './toast'

export default function ($store) {
  return function fetch(object) {
    const commonData = $store.getCommonState()
    const token = commonData.token || ''
    if (token) {
      object.header = Object.assign({}, object.header, {
        Authorization: 'Bearer ' + token
      })
    }

    if(!object.header) {
      object.header = {}
    }

    object.header['content-type'] = object.header['content-type'] || 'application/json'

    if(object.showError) {
      const success = object.success || function () {}
      const fail = object.fail || function () {}
      object.success = (res) => {
        if (typeof res.data !== 'object') {
          toast({
            icon: 'error',
            duration: 2000,
            title: '服务器错误'
          })

          return fail(res)
        }
        const data = res.data
        if(data.errcode < 0) {
          console.error(data)
          toast({
            icon: 'error',
            duration: 2000,
            title: data.errmsg || '请求错误'
          })

          return fail(res)
        }
        success(res)
      }
      object.fail = (err) => {
        console.error(err)
        toast({
          icon: 'error',
          duration: 2000,
          title: '请求错误'
        })
      }
    }

    wx.request(object)
  }
}