<template>
  <div class="message">
    <div class="message__text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "MessagePage",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.message {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 200px;
}

.message__text {
  font-size: 24px;
}
</style>
