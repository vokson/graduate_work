<template>
  <div class="textbutton" :class="{ textbutton_disabled: disabled }">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: "TextButton",
  props: {
    title: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
<style>
.textbutton {
  color: #447e9b;
  cursor: pointer;
  padding-left: 5px;
  padding-right: 5px;
  user-select: none;
}
.textbutton:hover {
  color: #062a3b;
}
.textbutton_disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>