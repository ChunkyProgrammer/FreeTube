import $ from 'jquery'
import fs from 'fs'
import path from 'path'

const state = {
  currentInvidiousInstance: '',
  invidiousInstancesList: null,
  isGetChannelInfoRunning: false
}

const getters = {
  getIsGetChannelInfoRunning(state) {
    return state.isGetChannelInfoRunning
  },

  getCurrentInvidiousInstance(state) {
    return state.currentInvidiousInstance
  },

  getInvidiousInstancesList(state) {
    return state.invidiousInstancesList
  }
}

const actions = {
  async fetchInvidiousInstances({ commit }, payload) {
    const requestUrl = 'https://api.invidious.io/instances.json'
    let instances = []
    try {
      const response = await $.getJSON(requestUrl)
      instances = response.filter((instance) => { // filter onion and i2p domains
        return !instance[0].match(/\.(onion|i2p)/)
      }).map((instance) => {
        return instance[1].uri.replace(/\/$/, '')
      })
    } catch (err) {
      console.error(err)
      // Read instances from static file
      const fileName = 'invidious-instances.json'
      const fileLocation = payload.isDev ? './static/' : path.join(__dirname, 'static')
      try {
        console.log('reading static file for invidious instances')
        const fileData = fs.readFile(`${fileLocation}${fileName}`)
        instances = JSON.parse(fileData).map((entry) => {
          return entry.url
        })
      } catch (err) {
        console.error(err)
      }
    }

    commit('setInvidiousInstancesList', instances)
  },

  setRandomCurrentInvidiousInstance({ commit, state }) {
    const instanceList = state.invidiousInstancesList
    const randomIndex = Math.floor(Math.random() * instanceList.length)
    commit('setCurrentInvidiousInstance', instanceList[randomIndex])
  },

  invidiousAPICall({ state }, payload) {
    return new Promise((resolve, reject) => {
      const requestUrl = `${state.currentInvidiousInstance}/api/v1/${payload.resource}/${payload.id}?${$.param(payload.params)}`

      $.getJSON(requestUrl, (response) => {
        resolve(response)
      }).fail((xhr, textStatus, error) => {
        console.log(xhr)
        console.log(textStatus)
        console.log(requestUrl)
        console.log(error)
        reject(xhr)
      })
    })
  },

  invidiousGetChannelInfo({ commit, dispatch }, channelId) {
    return new Promise((resolve, reject) => {
      commit('toggleIsGetChannelInfoRunning')

      const payload = {
        resource: 'channels',
        id: channelId,
        params: {}
      }

      dispatch('invidiousAPICall', payload).then((response) => {
        resolve(response)
      }).catch((xhr) => {
        console.log('found an error')
        console.log(xhr)
        commit('toggleIsGetChannelInfoRunning')
        reject(xhr)
      })
    })
  },

  invidiousGetPlaylistInfo({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('invidiousAPICall', payload).then((response) => {
        resolve(response)
      }).catch((xhr) => {
        console.log('found an error')
        console.log(xhr)
        commit('toggleIsGetChannelInfoRunning')
        reject(xhr)
      })
    })
  },

  invidiousGetVideoInformation({ dispatch }, videoId) {
    return new Promise((resolve, reject) => {
      const payload = {
        resource: 'videos',
        id: videoId,
        params: {}
      }

      dispatch('invidiousAPICall', payload).then((response) => {
        resolve(response)
      }).catch((xhr) => {
        console.log('found an error')
        console.log(xhr)
        reject(xhr)
      })
    })
  }
}

const mutations = {
  toggleIsGetChannelInfoRunning(state) {
    state.isGetChannelInfoRunning = !state.isGetChannelInfoRunning
  },

  setCurrentInvidiousInstance(state, value) {
    state.currentInvidiousInstance = value
  },

  setInvidiousInstancesList(state, value) {
    state.invidiousInstancesList = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
