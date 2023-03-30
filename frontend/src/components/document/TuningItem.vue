<template>
  <div class="tuningitem">
    <icon-button
      class="tuningitem__button"
      icon_on="-"
      @click="$emit('change:size', prev_size(size))"
    />
    <icon-button
      class="tuningitem__button"
      icon_on="+"
      @click="$emit('change:size', next_size(size))"
    />
    <icon-button
      class="tuningitem__button"
      icon_on="&#8660;"
      icon_off="&#10500;"
      :is_active="grow"
      @click="$emit('change:grow', !grow)"
    />
    <icon-button
      class="tuningitem__button"
      icon_on="X"
      @click="$emit('delete:field')"
    />
  </div>
</template>

<script>
import IconButton from "../buttons/IconButton.vue";
export default {
  components: { IconButton },
  name: "TuningItem",
  props: {
    size: {
      type: String,
      required: false,
      default: "w50",
    },
    grow: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["change:size", "change:grow", "delete:field"],
  setup() {
    const size_variants = [
      "w50",
      "w100",
      "w150",
      "w200",
      "w250",
      "w300",
      "w350",
      "w400",
    ];

    const prev_size = (size) => {
      let idx = size_variants.indexOf(size) - 1;
      idx = Math.max(0, idx);
      return size_variants[idx];
    };

    const next_size = (size) => {
      let idx = size_variants.indexOf(size) + 1;
      idx = Math.min(idx, size_variants.length - 1);
      return size_variants[idx];
    };

    return { prev_size, next_size };
  },
};
</script>

<style>
.tuningitem {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 3px;
}

.tuningitem__button {
  width: 20px;
  height: 20px;
}

.tuningitem__sizecontainer {
  display: flex;
}
</style>