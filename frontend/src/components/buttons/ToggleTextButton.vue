<template>
  <div class="toggletextbutton">
    {{ isActive ? activeTitle : passiveTitle }}
  </div>
</template>

<script>
export default {
  name: "ToggleTextButton",
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    activeTitle: {
      type: String,
      required: true,
    },
    passiveTitle: {
      type: String,
      required: true,
    },
  },
};
</script>
<style>
.toggletextbutton {
  color: #447e9b;
  cursor: pointer;
  padding-left: 5px;
  padding-right: 5px;
}
.toggletextbutton:hover {
  color: #062a3b;
}
</style>