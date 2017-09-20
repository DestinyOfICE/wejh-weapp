import API from './api'
import util from './util'

export default function ({ store, fetch }) {
  return {
    getAppList (callback = function () {}, options) {
      fetch({
        url: API('app-list'),
        ...options,
        success(res) {
          let data = res.data.data
          store.setCommonState({
            apps: util.fixAppList(data['app-list']),
            icons: util.fixIcons(data['icons'])
          })
        }
      })
    },
    getTimetable (callback = function () {}, options) {
      fetch({
        url: API('timetable'),
        ...options,
        showError: true,
        success(res) {
          let data = res.data.data
          store.setCommonState({
            timetable: data,
            timetableFixed: util.fixTimetable(data)
          })
          callback(res)
        }
      })
    },
    getScore (callback = function () {}, options) {
      fetch({
        url: API('score'),
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data
          const fixedData = util.fixScore(data)
          const sortedData = Array.from(fixedData.list).sort((a, b) => {
            return b['真实成绩'] - a['真实成绩']
          })
          store.setCommonState({
            score: fixedData,
            sortedScoreList: sortedData,
          })
          callback(res)
        }
      })
    },
    getExam (callback = function () {}, options) {
      fetch({
        url: API('exam'),
        ...options,
        showError: true,
        success(res) {
          const data = res.data.data
          store.setCommonState({
            exam: util.fixExam(data),
          })
          callback(res)
        }
      })
    },
    getFreeroom (callback = function () {}, options) {
      fetch({
        url: API('freeroom'),
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data
          store.setCommonState({
            originalFreeroomData: data,
            freeroom: util.fixFreeroom(data),
          })
          callback(res)
        }
      })
    },
    changeTimetableTerm (targetTerm, callback = function () {}, options) {
      fetch({
        url: API('timetable'),
        method: 'PUT',
        ...options,
        data: {
          term: targetTerm,
        },
        showError: true,
        success(res) {
          callback(res)
        }
      })
    },
    changeScoreTerm (targetTerm, callback = function () {}, options) {
      fetch({
        url: API('score'),
        method: 'PUT',
        ...options,
        data: {
          term: targetTerm,
        },
        showError: true,
        success(res) {
          callback(res)
        }
      })
    },
    changeExamTerm (targetTerm, callback = function () {}, options) {
      fetch({
        url: API('exam'),
        method: 'PUT',
        ...options,
        data: {
          term: targetTerm,
        },
        showError: true,
        success(res) {
          callback(res)
        }
      })
    },
  }
}