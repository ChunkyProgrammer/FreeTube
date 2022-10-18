<template>
  <div
    class="bubblePadding"
    tabindex="0"
    :aria-labelledby="'channelBubble' + sanitizeForHtmlId(channelName)"
    @click="handleClick"
    @keydown.enter.prevent="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <img
      class="bubble"
      :src="channelThumbnail"
      alt=""
    >
    <div
      v-if="selected"
      class="bubble selected"
    >
      <font-awesome-icon
        :icon="['fas', 'check']"
        class="icon"
      />
    </div>
    <div
      :id="'channelBubble' + sanitizeForHtmlId(channelName)"
      class="channelName"
    >
      {{ channelName }}
    </div>
  </div>
</template>

<script src="./ft-channel-bubble.js" />
<style scoped src="./ft-channel-bubble.css" />
