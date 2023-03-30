<template>
  <div class="documentpaginationrow">
    <span>По</span>
    <div
      class="documentpaginationrow__variants"
      v-for="count in variants"
      :key="count"
    >
      <text-button
        class="documentpaginationrow__textbutton"
        :class="{
          documentpaginationrow__textbutton_active: count === count_per_page,
        }"
        :title="count.toString()"
        @click="
          $emit('select:page', 1);
          $emit('set:count_per_page', count);
        "
      />
    </div>
    <span> | Страницы </span>

    <div
      v-if="!is_intermediate_part_shown && has_intermediate_part"
      class="documentpaginationrow__container"
    >
      <div
        class="documentpaginationrow__subcontainer"
        v-for="page in pages_before"
        :key="page.index"
      >
        <text-button
          class="documentpaginationrow__textbutton"
          :class="{
            documentpaginationrow__textbutton_active:
              page.index === current_page,
          }"
          :title="page.index.toString()"
          @click="$emit('select:page', page.index)"
        />
      </div>

      <text-button
        class="documentpaginationrow__textbutton"
        title="..."
        @click="$emit('show:pages')"
      />

      <div
        class="documentpaginationrow__subcontainer"
        v-for="page in pages_after"
        :key="page.index"
      >
        <text-button
          class="documentpaginationrow__textbutton"
          :class="{
            documentpaginationrow__textbutton_active:
              page.index === current_page,
          }"
          :title="page.index.toString()"
          @click="$emit('select:page', page.index)"
        />
      </div>
    </div>

    <div v-else class="documentpaginationrow__container">
      <div
        class="documentpaginationrow__subcontainer"
        v-for="page in pages"
        :key="page.index"
      >
        <text-button
          class="documentpaginationrow__textbutton"
          :class="{
            documentpaginationrow__textbutton_active:
              page.index === current_page,
          }"
          :title="page.index.toString()"
          @click="$emit('select:page', page.index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, onMounted } from "vue";
import TextButton from "../buttons/TextButton.vue";
export default {
  components: { TextButton },
  name: "DocumentPaginationRow",
  props: {
    total_count: {
      type: Number,
      required: true,
    },
    count_per_page: {
      type: Number,
      required: true,
    },
    current_page: {
      type: Number,
      required: true,
    },
    variants: {
      type: Array,
      required: true,
    },
    max_count_of_pages: {
      type: Number,
      required: false,
      default: 0,
    },
    count_before: {
      type: Number,
      required: false,
      default: 10,
    },
    count_after: {
      type: Number,
      required: false,
      default: 5,
    },
    is_intermediate_part_shown: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["select:page", "set:count_per_page", "set:page_range", "show:pages"],

  setup(props, { emit }) {
    const pages = computed(() => {
      return Array.from(
        Array(Math.ceil(props.total_count / props.count_per_page)).keys()
      ).map((num) => {
        const min = num * props.count_per_page;
        const max = (num + 1) * props.count_per_page - 1;
        return {
          index: num + 1,
          min: min,
          max: Math.min(max, props.total_count - 1),
        };
      });
    });

    const has_intermediate_part = computed(
      () => pages.value.length - props.count_before - props.count_after > 0
    );

    const pages_before = computed(() =>
      pages.value.filter((x) => x.index <= props.count_before)
    );

    const pages_after = computed(() =>
      pages.value.filter(
        (x) => x.index >= pages.value.length - props.count_after + 1
      )
    );

    const page = computed(() =>
      pages.value.find((e) => e.index === props.current_page)
    );

    watch(page, (newValue) => emit("set:page_range", newValue));

    onMounted(() => emit("set:page_range", page.value));

    return {
      page,
      pages,
      has_intermediate_part,
      pages_before,
      pages_after,
    };
  },
};
</script>

<style scoped>
.documentpaginationrow,
.documentpaginationrow__container,
.documentpaginationrow__subcontainer {
  display: flex;
  flex-wrap: wrap;
}
.documentpaginationrow__textbutton_active {
  color: red;
}
</style>