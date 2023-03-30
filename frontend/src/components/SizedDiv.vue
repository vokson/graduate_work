<template>
  <div
    class="sizeddiv"
    v-bind:class="{
      sizeddiv_w30: size === 'w30' && grow === false,
      sizeddiv_w35: size === 'w35' && grow === false,
      sizeddiv_w40: size === 'w40' && grow === false,
      sizeddiv_w50: size === 'w50' && grow === false,
      sizeddiv_w100: size === 'w100' && grow === false,
      sizeddiv_w150: size === 'w150' && grow === false,
      sizeddiv_w200: size === 'w200' && grow === false,
      sizeddiv_w250: size === 'w250' && grow === false,
      sizeddiv_w300: size === 'w300' && grow === false,
      sizeddiv_w350: size === 'w350' && grow === false,
      sizeddiv_w400: size === 'w400' && grow === false,
      sizeddiv_growable: grow === true,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "SizedDiv",
  props: {
    size: {
      type: String,
      required: false,
      default: "",
    },
    grow: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style>
.sizeddiv {
  display: flex;
}

.sizeddiv_w30 {
  min-width: 30px;
  max-width: 30px;
}

.sizeddiv_w35 {
  min-width: 35px;
  max-width: 35px;
}

.sizeddiv_w40 {
  min-width: 40px;
  max-width: 40px;
}

.sizeddiv_w50 {
  min-width: 50px;
  max-width: 50px;
}

.sizeddiv_w100 {
  min-width: 100px;
  max-width: 100px;
}

.sizeddiv_w150 {
  min-width: 150px;
  max-width: 150px;
}
.sizeddiv_w200 {
  min-width: 200px;
  max-width: 200px;
}
.sizeddiv_w250 {
  min-width: 250px;
  max-width: 250px;
}
.sizeddiv_w300 {
  min-width: 300px;
  max-width: 300px;
}
.sizeddiv_w350 {
  min-width: 350px;
  max-width: 350px;
}
.sizeddiv_w400 {
  min-width: 400px;
  max-width: 400px;
}

.sizeddiv_growable {
  width: 50px;
  flex-grow: 1;
}
</style>