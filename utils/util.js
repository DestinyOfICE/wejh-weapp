//判断是否为纯粹对象
function isPlainObject(obj) {
  if (!obj || obj.toString() !== "[object Object]" || obj.nodeType || obj.setInterval) {
    return false;
  }
  if (obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  for (let key in obj) { }
  return key === undefined || obj.hasOwnProperty(key);
}

function colorLessons (lessons) {
  const colorArr = ['red', 'yellow', 'purple', 'blue', 'green']
  const colorMap = {}

  function getRandomValue (array) {
    const index = Math.floor((Math.random() * array.length))
    return array[index]
  }

  function getMinColor () {
    let min = 99
    let minColor = 'red'
    let hasMultipleMin = false
    for (let color in colorMap) {
      if (colorMap[color] < min) {
        min = colorMap[color]
        minColor = color
      }
    }
    for (let color in colorMap) {
      if (colorMap[color] === min) {
        hasMultipleMin = true
      }
    }
    if (hasMultipleMin) {
      return getRandomValue(colorArr)
    }
    return minColor
  }

  function getTopLessons (dayLessons, jie) {
    jie--
    while (jie >= 0) {
      if (dayLessons[jie].length > 0) {
        return dayLessons[jie]
      }
      jie--
    }
    return []
  }

  function getColor (usedColors) {
    const colorArray = Array.from(colorArr)

    for (let i = 0; i < colorArray.length; i++) {
      let color = colorArray[i]
      if (usedColors[color] === 1) {
        const colorIndex = colorArray.indexOf(color)
        colorArray.splice(colorIndex, 1)
      }
    }
    if (colorArray.length < 1) {
      return getMinColor()
    } else {
      return getRandomValue(colorArray)
    }
  }

  const lessonMap = {}

  // 每天的课程
  lessons.forEach((dayLessons, weekday) => {
    // 每节的课程们
    dayLessons.forEach((lessonsBlock, jie) => {
      // 每个课程
      lessonsBlock.forEach((item) => {
        if (lessonMap[item['id']]) {
          item['颜色'] = lessonMap[item['id']]
        } else {
          const topLessons = getTopLessons(dayLessons, jie)
          const leftLessons = (lessons[weekday - 1] || [])[jie] || []
          const bottomLessons = dayLessons[jie + 2] || []
          const rightLessons = (lessons[weekday - 1] || [])[jie] || []
          const usedColors = {}
          topLessons.forEach((lesson) => {
            if (lesson['颜色']) {
              usedColors[lesson['颜色']] = 1
            }
          })
          leftLessons.forEach((lesson) => {
            if (lesson['颜色']) {
              usedColors[lesson['颜色']] = 1
            }
          })
          bottomLessons.forEach((lesson) => {
            if (lessonMap[lesson['id']]) {
              usedColors[lessonMap[lesson['id']]] = 1
            }
          })
          rightLessons.forEach((lesson) => {
            if (lessonMap[lesson['id']]) {
              usedColors[lessonMap[lesson['id']]] = 1
            }
          })
          item['颜色'] = getColor(usedColors)
          lessonMap[item['id']] = item['颜色']
          if (colorMap[item['颜色']] !== undefined) {
            colorMap[item['颜色']] = 0
          }
          colorMap[item['颜色']]++
        }
      })
    })
  })

  return lessons
}

module.exports = {
  formatTime(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },
  deepClone(obj) {
    if (!isPlainObject(obj)) { return false; }
    return JSON.parse(JSON.stringify(obj));
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /**
   * 处理课表数据以便DOM渲染
   * @param classResult
   * @returns {Array}
   */
  fixTimetable(classResult) {
    if (!classResult) {
      return []
    }

    const classList = classResult['list'] || []
    const lessons = []
    for (let i = 0; i < 7; i++) {
      lessons[i] = []
      for (let j = 0; j < 12; j++) {
        lessons[i][j] = []
      }
    }

    classList.forEach((item, index) => {
      const infoList = item['信息'] || []
      infoList.forEach((info) => {
        const lesson = [];
        lesson['id'] = index + 1
        lesson['周'] = []
        lesson['地点'] = info['地点']
        lesson['学分修正'] = (+item['学分']).toFixed(1)
        const englishArr = info['地点'].match(/[0-9a-zA-Z:]/g) || []
        lesson['地点长度'] = info['地点'].length * 2 - englishArr.length
        const nameArr = item['课程名称'].match(/[0-9a-zA-Z:]/g) || []
        lesson['课程名称长度'] = item['课程名称'].length - nameArr.length / 1.2
        lesson['节数'] = info['结束节'] - info['开始节'] + 1
        lesson['起止周'] = info['开始周'] + '-' + info['结束周']

        for(let i = 1; i <= 18; i++) {
          lesson['周'][i] = (i >= info['开始周'] && i <= info['结束周'])
        }
        const jie = info['开始节'] - 1
        lessons[parseInt(info['星期']) - 1][jie].push(Object.assign({}, item, lesson))
      })
    })

    return colorLessons(lessons)
  },
  fixAppList (list) {
    return list.map((item) => {
      item.bg = '../../images/app-list/' + item.bg +'.png'
      return item
    })
  },
  fixIcons (icons) {
    for (let key in icons) {
      icons[key].bg = '../../images/app-list/' + icons[key].bg +'.png'
    }
    return icons
  }
}
