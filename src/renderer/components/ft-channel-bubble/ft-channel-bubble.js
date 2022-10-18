import Vue from 'vue'
import { sanitizeForHtmlId } from '../../helpers/accessibility'
export default Vue.extend({
  name: 'FtChannelBubble',
  props: {
    channelName: {
      type: String,
      required: true
    },
    channelThumbnail: {
      type: String,
      required: true
    },
    showSelected: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      selected: false
    }
  },
  methods: {
    sanitizeForHtmlId,
    handleClick: function (event) {
      if (event instanceof KeyboardEvent) {
        if (event.target.getAttribute('role') === 'link' && event.key !== 'Enter') {
          return
        }
      }
      if (this.showSelected) {
        this.selected = !this.selected
      }
      this.$emit('click')
    }
  }
})
