import { createRouter, createWebHistory } from 'vue-router'
import Subscriptions from '../views/Subscriptions/Subscriptions.vue'
import SubscribedChannels from '../views/SubscribedChannels/SubscribedChannels.vue'
import ProfileSettings from '../views/ProfileSettings/ProfileSettings.vue'
import ProfileEdit from '../views/ProfileEdit/ProfileEdit.vue'
import Trending from '../views/Trending/Trending.vue'
import Popular from '../views/Popular/Popular.vue'
import UserPlaylists from '../views/UserPlaylists/UserPlaylists.vue'
import History from '../views/History/History.vue'
import Settings from '../views/Settings/Settings.vue'
import About from '../views/About/About.vue'
import Search from '../views/Search/Search.vue'
import Playlist from '../views/Playlist/Playlist.vue'
import Channel from '../views/Channel/Channel.vue'
import Watch from '../views/Watch/Watch.vue'
import Hashtag from '../views/Hashtag/Hashtag.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      meta: {
        title: 'Subscriptions.Subscriptions'
      },
      component: Subscriptions
    },
    {
      path: '/subscriptions',
      meta: {
        title: 'Subscriptions.Subscriptions'
      },
      component: Subscriptions
    },
    {
      path: '/subscribedchannels',
      meta: {
        title: 'Channels.Title'
      },
      component: SubscribedChannels
    },
    {
      path: '/settings/profile',
      meta: {
        title: 'Profile.Profile Settings'
      },
      component: ProfileSettings
    },
    {
      path: '/settings/profile/new',
      name: 'newProfile',
      meta: {
        title: 'Profile.Create New Profile'
      },
      component: ProfileEdit
    },
    {
      path: '/settings/profile/edit/:id',
      name: 'editProfile',
      meta: {
        title: 'Profile.Edit Profile'
      },
      component: ProfileEdit
    },
    {
      path: '/trending',
      meta: {
        title: 'Trending.Trending'
      },
      component: Trending
    },
    {
      path: '/popular',
      meta: {
        title: 'Most Popular'
      },
      component: Popular
    },
    {
      path: '/userplaylists',
      meta: {
        title: 'User Playlists.Your Playlists'
      },
      component: UserPlaylists
    },
    {
      path: '/history',
      name: 'history',
      meta: {
        title: 'History.History'
      },
      component: History
    },
    {
      path: '/settings',
      meta: {
        title: 'Settings.Settings'
      },
      component: Settings
    },
    {
      path: '/about',
      meta: {
        title: 'About.About'
      },
      component: About
    },
    {
      path: '/search/:query',
      meta: {
        title: 'Search Filters.Search Results'
      },
      component: Search
    },
    {
      path: '/playlist/:id',
      meta: {
        title: 'Playlist.Playlist'
      },
      component: Playlist
    },
    {
      path: '/channel/:id/:currentTab?',
      meta: {
        title: 'Channel'
      },
      component: Channel
    },
    {
      path: '/watch/:id',
      meta: {
        title: 'Watch'
      },
      component: Watch
    },
    {
      path: '/hashtag/:hashtag',
      meta: {
        title: 'Hashtag'
      },
      component: Hashtag
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (savedPosition !== null) {
          resolve(savedPosition)
        } else {
          resolve({ x: 0, y: 0 })
        }
      }, 500)
    })
  }
})

export default router
