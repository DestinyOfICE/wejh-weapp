const prefix = {
  dev: 'http://wejh-server.dev/',
  production: 'https://server.wejh.imcr.me/'
}

const systemInfo = wx.getSystemInfoSync()
const isDev = systemInfo.platform === 'devtools'

const api = {
  'app-list': 'api/app-list',
  'login': 'api/login',
  'user': 'api/user',
  'forgot': 'api/forgot',
  'code': 'api/code/weapp',
  'autoLogin': 'api/autoLogin',
  'register': 'api/register',
  'time': 'api/time',
  'timetable': 'api/ycjw/timetable',
  'score': 'api/ycjw/score',
  'teacher': 'api/teacher',
  'exam': 'api/ycjw/exam',
  'card': 'api/card',
  'freeroom': 'api/freeroom',
  'zf/bind': 'api/zf/bind',
  'ycjw/bind': 'api/ycjw/bind',
  'card/bind': 'api/card/bind',
  'library/bind': 'api/library/bind',
}

/**
 * @return {string}
 */
function API(key) {
  const domain = isDev ? prefix['dev'] : prefix['production']
  const url = domain + api[key]
  console.log(url)
  return url
}

export default API