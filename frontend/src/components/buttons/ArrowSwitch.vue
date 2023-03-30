<template>
  <div
    class="arrowswitch"
    v-bind:class="{
      arrowswitch_selected: is_selected === true,
      arrowswitch_checked: is_checked === true,
    }"
  >
    {{ is_checked ? "&#x25bc;" : "&#x25b2;" }}
  </div>
</template>

<script>
export default {
  name: "ArrowSwitch",
  props: {
    is_selected: {
      type: Boolean,
      required: true,
    },
    is_checked: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style>
.arrowswitch {
  display: block;
  font-size: 16px;
  cursor: pointer;
  color: lightgrey;
  user-select: none;
}

.arrowswitch_selected {
  color: lightsalmon;
}
</style>