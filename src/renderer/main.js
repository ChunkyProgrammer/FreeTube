// import the styles
import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'
import router from './router/index'
import store from './store/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleDown,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faBars,
  faBookmark,
  faCheck,
  faChevronRight,
  faCircleUser,
  faClone,
  faComment,
  faCommentDots,
  faCopy,
  faDownload,
  faEllipsisH,
  faEllipsisV,
  faEnvelope,
  faExchangeAlt,
  faExclamationCircle,
  faExternalLinkAlt,
  faFileDownload,
  faFileVideo,
  faFilter,
  faFire,
  faGlobe,
  faHeart,
  faHistory,
  faInfoCircle,
  faLanguage,
  faList,
  faNewspaper,
  faPlay,
  faQuestionCircle,
  faRandom,
  faRetweet,
  faRss,
  faSatelliteDish,
  faSearch,
  faShareAlt,
  faSlidersH,
  faSortDown,
  faStar,
  faStepBackward,
  faStepForward,
  faSync,
  faThumbsDown,
  faThumbsUp,
  faThumbtack,
  faTimes,
  faTimesCircle,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import {
  faBitcoin,
  faGithub,
  faMastodon,
  faMonero
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createI18n } from 'vue-i18n'

library.add(
  // solid icons
  faAngleDown,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faBars,
  faBookmark,
  faCheck,
  faChevronRight,
  faCircleUser,
  faClone,
  faComment,
  faCommentDots,
  faCopy,
  faDownload,
  faEllipsisH,
  faEllipsisV,
  faEnvelope,
  faExchangeAlt,
  faExclamationCircle,
  faExternalLinkAlt,
  faFileDownload,
  faFileVideo,
  faFilter,
  faFire,
  faGlobe,
  faHeart,
  faHistory,
  faInfoCircle,
  faLanguage,
  faList,
  faNewspaper,
  faPlay,
  faQuestionCircle,
  faRandom,
  faRetweet,
  faRss,
  faSatelliteDish,
  faSearch,
  faShareAlt,
  faSlidersH,
  faSortDown,
  faStar,
  faStepBackward,
  faStepForward,
  faSync,
  faThumbsDown,
  faThumbsUp,
  faThumbtack,
  faTimes,
  faTimesCircle,
  faUsers,

  // brand icons
  faGithub,
  faBitcoin,
  faMastodon,
  faMonero
)

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    en: {}
  }
})

const emitter = mitt()
window.i18n = i18n

const app = createApp(App)
app.config.performance = process.env.NODE_ENV === 'development'
app.config.globalProperties.emitter = emitter
app.use(i18n)
app.use(router)
app.use(store)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#mount')

// to avoid accessing electron api from web app build
if (process.env.IS_ELECTRON) {
  const { ipcRenderer } = require('electron')

  // handle menu event updates from main script
  ipcRenderer.on('change-view', (event, data) => {
    if (data.route) {
      router.push(data.route)
    }
  })
}
