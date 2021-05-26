<template>
  <p
    @timestamp-clicked="catchTimestampClick"
    v-text="detectTimestamps(inputHtml)"
  />
</template>

<script src="./ft-timestamp-catcher.js" />
<style scoped src="./ft-timestamp-catcher.css" />
