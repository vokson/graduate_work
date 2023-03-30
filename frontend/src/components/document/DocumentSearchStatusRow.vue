<template>
  <div class="documentsearchstatusrow">
    <form-text-field :value="status" />
  </div>
</template>

<script>
import { computed } from "vue";
import FormTextField from "../fields/FormTextField.vue";
export default {
  components: { FormTextField },
  name: "DocumentSearchStatusRow",
  props: {
    time: {
      type: Number,
      required: false,
    },
    count: {
      type: Number,
      required: true,
    },
    min_index: {
      type: Number,
      required: false,
    },
    max_index: {
      type: Number,
      required: false,
    },
    count_of_selected: {
      type: Number,
      required: false,
    },
    is_searching: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const status = computed(() => {
      if (props.is_searching) return ('Поиск...')
      
      let result =
        "Для поиска нажмите ENTER в любом окошке. Найдено " + props.count.toString() + "шт.";
      if (props.time) result += " (" + props.time.toString() + " сек.)";

      if (props.min_index !== undefined && props.max_index !== undefined)
        result +=
          " Показаны " +
          (props.min_index + 1).toString() +
          "-" +
          (props.max_index + 1).toString() +
          ".";

      if (props.count_of_selected !== undefined)
        result += " Выделено " + props.count_of_selected.toString() + "шт.";

      return result;
    });

    return { status };
  },
};
</script>
<style scoped>
.documentsearchstatusrow {
  display: flex;
  justify-content: center;
}
</style>