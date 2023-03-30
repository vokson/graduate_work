<template>
  <p
    class="heading"
    v-bind:class="{
      heading_big: size === 'big',
      heading_middle: size === 'middle',
      heading_small: size === 'small',
    }"
  >
    {{ text }}
  </p>
</template>

<script>
export default {
  name: "HeadingComponent",
  props: {
    text: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.heading {
  display: block;
  font-weight: 500;
}

.heading_big {
  font-size: 48px;
}

.heading_middle {
  font-size: 28px;
}

.heading_small {
  font-size: 20px;
}
</style>