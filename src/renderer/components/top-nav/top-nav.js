import Vue from 'vue'
import { mapActions } from 'vuex'
import FtInput from '../ft-input/ft-input.vue'
import FtSearchFilters from '../ft-search-filters/ft-search-filters.vue'
import FtProfileSelector from '../ft-profile-selector/ft-profile-selector.vue'
import $ from 'jquery'
import debounce from 'lodash.debounce'
import ytSuggest from 'youtube-suggest'

import { IpcChannels } from '../../../constants'

export default Vue.extend({
  name: 'TopNav',
  components: {
    FtInput,
    FtSearchFilters,
    FtProfileSelector
  },
  data: () => {
    return {
      component: this,
      windowWidth: 0,
      showFilters: false,
      searchFilterValueChanged: false,
      historyIndex: 1,
      isForwardOrBack: false,
      searchSuggestionsDataList: []
    }
  },
  computed: {
    usingElectron: function () {
      return this.$store.getters.getUsingElectron
    },

    hideSearchBar: function () {
      return this.$store.getters.getHideSearchBar
    },

    enableSearchSuggestions: function () {
      return this.$store.getters.getEnableSearchSuggestions
    },

    searchSettings: function () {
      return this.$store.getters.getSearchSettings
    },

    isSideNavOpen: function () {
      return this.$store.getters.getIsSideNavOpen
    },

    barColor: function () {
      return this.$store.getters.getBarColor
    },

    currentInvidiousInstance: function () {
      return this.$store.getters.getCurrentInvidiousInstance
    },

    backendFallback: function () {
      return this.$store.getters.getBackendFallback
    },

    backendPreference: function () {
      return this.$store.getters.getBackendPreference
    },

    forwardText: function () {
      return this.$t('Forward')
    },

    backwardText: function () {
      return this.$t('Backward')
    },

    newWindowText: function () {
      return this.$t('Open New Window')
    }
  },
  mounted: function () {
    const appWidth = $(window).width()

    if (appWidth <= 680) {
      const searchContainer = $('.searchContainer').get(0)
      searchContainer.style.display = 'none'
    }

    if (localStorage.getItem('expandSideBar') === 'true') {
      this.toggleSideNav()
    }

    window.addEventListener('resize', function (event) {
      const width = event.srcElement.innerWidth
      const searchContainer = $('.searchContainer').get(0)

      if (width > 680) {
        searchContainer.style.display = ''
      } else {
        searchContainer.style.display = 'none'
      }
    })

    this.debounceSearchResults = debounce(this.getSearchSuggestions, 200)
  },
  methods: {
    goToSearch: async function (query) {
      const appWidth = $(window).width()

      if (appWidth <= 680) {
        const searchContainer = $('.searchContainer').get(0)
        searchContainer.blur()
        searchContainer.style.display = 'none'
      } else {
        const searchInput = $('.searchInput input').get(0)
        searchInput.blur()
      }

      this.getYoutubeUrlInfo(query).then((result) => {
        switch (result.urlType) {
          case 'video': {
            const { videoId, timestamp, playlistId } = result

            const query = {}
            if (timestamp) {
              query.timestamp = timestamp
            }
            if (playlistId && playlistId.length > 0) {
              query.playlistId = playlistId
            }
            this.$router.push({
              path: `/watch/${videoId}`,
              query: query
            })
            break
          }

          case 'playlist': {
            const { playlistId, query } = result

            this.$router.push({
              path: `/playlist/${playlistId}`,
              query
            })
            break
          }

          case 'search': {
            const { searchQuery, query } = result

            this.$router.push({
              path: `/search/${encodeURIComponent(searchQuery)}`,
              query
            })
            break
          }

          case 'hashtag': {
            // TODO: Implement a hashtag related view
            let message = 'Hashtags have not yet been implemented, try again later'
            if (this.$t(message) && this.$t(message) !== '') {
              message = this.$t(message)
            }

            this.showToast({
              message: message
            })
            break
          }

          case 'channel': {
            const { channelId, subPath } = result

            this.$router.push({
              path: `/channel/${channelId}/${subPath}`
            })
            break
          }

          case 'invalid_url':
          default: {
            this.$router.push({
              path: `/search/${encodeURIComponent(query)}`,
              query: {
                sortBy: this.searchSettings.sortBy,
                time: this.searchSettings.time,
                type: this.searchSettings.type,
                duration: this.searchSettings.duration
              }
            })
          }
        }
      })

      // Close the filter panel
      this.showFilters = false
    },

    getSearchSuggestionsDebounce: function (query) {
      if (this.enableSearchSuggestions) {
        this.debounceSearchResults(query)
      }
    },

    getSearchSuggestions: function (query) {
      switch (this.backendPreference) {
        case 'local':
          this.getSearchSuggestionsLocal(query)
          break
        case 'invidious':
          this.getSearchSuggestionsInvidious(query)
          break
      }
    },

    getSearchSuggestionsLocal: function (query) {
      if (query === '') {
        this.searchSuggestionsDataList = []
        return
      }

      ytSuggest(query).then((results) => {
        this.searchSuggestionsDataList = results
      })
    },

    getSearchSuggestionsInvidious: function (query) {
      if (query === '') {
        this.searchSuggestionsDataList = []
        return
      }

      const searchPayload = {
        resource: 'search/suggestions',
        id: '',
        params: {
          q: query
        }
      }

      this.invidiousAPICall(searchPayload).then((results) => {
        this.searchSuggestionsDataList = results.suggestions
      }).catch((err) => {
        console.log(err)
        if (this.backendFallback) {
          console.log(
            'Error gettings search suggestions.  Falling back to Local API'
          )
          this.getSearchSuggestionsLocal(query)
        }
      })
    },

    toggleSearchContainer: function () {
      const searchContainer = $('.searchContainer').get(0)

      if (searchContainer.style.display === 'none') {
        searchContainer.style.display = ''
      } else {
        searchContainer.style.display = 'none'
      }

      this.showFilters = false
    },

    handleSearchFilterValueChanged: function(filterValueChanged) {
      this.searchFilterValueChanged = filterValueChanged
    },

    navigateHistory: function() {
      if (!this.isForwardOrBack) {
        this.historyIndex = window.history.length
        $('#historyArrowBack').removeClass('fa-arrow-left')
        $('#historyArrowForward').addClass('fa-arrow-right')
      } else {
        this.isForwardOrBack = false
      }
    },

    historyBack: function () {
      this.isForwardOrBack = true
      window.history.back()

      if (this.historyIndex > 1) {
        this.historyIndex--
        $('#historyArrowForward').removeClass('fa-arrow-right')
        if (this.historyIndex === 1) {
          $('#historyArrowBack').addClass('fa-arrow-left')
        }
      }
    },

    historyForward: function () {
      this.isForwardOrBack = true
      window.history.forward()

      if (this.historyIndex < window.history.length) {
        this.historyIndex++
        $('#historyArrowBack').removeClass('fa-arrow-left')

        if (this.historyIndex === window.history.length) {
          $('#historyArrowForward').addClass('fa-arrow-right')
        }
      }
    },

    toggleSideNav: function () {
      this.$store.commit('toggleSideNav')
    },

    createNewWindow: function () {
      if (this.usingElectron) {
        const { ipcRenderer } = require('electron')
        ipcRenderer.send(IpcChannels.CREATE_NEW_WINDOW)
      } else {
        // Web placeholder
      }
    },
    navigate: function (route) {
      this.$router.push('/' + route)
    },
    hideFilters: function () {
      this.showFilters = false
    },
    ...mapActions([
      'showToast',
      'getYoutubeUrlInfo',
      'invidiousAPICall'
    ])
  }
})
