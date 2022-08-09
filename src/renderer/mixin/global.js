import _ from 'lodash'

const GlobalMixins = {
  install (Vue) {
    Vue.mixin({
      methods: {
        $limitString: function (str, len = 0) {
          if (_.isEmpty(str)) {
            return str
          }
          if (len === 0) {
            const device = this.$screen.breakpoint
            console.log(device)
            switch (device) {
              case 'mobile':
                len = 10
                break
              case 'tablet':
                len = 20
                break
              case 'desktop':
                len = 30
                break
              default:
                len = 30
                break
            }
          }
          if (str.length > len) {
            return str.substring(0, len) + '...'
          }
          return str
        },
        $getStudy: function (id) {
          const allStudy = JSON.parse(localStorage.getItem('allStudy', '[]'))
          if (allStudy.length === 0) {
            return null
          }
          const study = allStudy.find(item => {
            return item.id === id
          })
          return study
        },
        $addStudy: function (newStudy) {
          const allStudies = JSON.parse(localStorage.getItem('allStudy', []))
          allStudies.push(newStudy)
          localStorage.setItem('allStudy', JSON.stringify(allStudies))
          return true
        },
        $getAllStudy: function () {
          return JSON.parse(localStorage.getItem('allStudy', []))
        }
      }
    })
  }
}

export default GlobalMixins
