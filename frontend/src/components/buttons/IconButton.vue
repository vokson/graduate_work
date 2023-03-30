<template>
  <div class="iconbutton" @click="$emit('toggle')">
    <div class="iconbutton__icon">
      {{ is_active === true ? icon_on : icon_off }}
    </div>
  </div>
</template>

<script>
export default {
  name: "IconButton",
  props: {
    icon_on: {
      type: String,
      required: true,
    },
    icon_off: {
      type: String,
      required: false,
    },
    is_active: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>

<style>
.iconbutton {
  display: flex;
  justify-content: center;
  align-items: center;
}

.iconbutton__icon {
  flex-grow: 1;
  user-select: none;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
}
</style>