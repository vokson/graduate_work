<template>
  <div class="documentpagesortrow">
    <sized-div
      v-for="block in search_schema"
      :key="block.name"
      class="documentpagesortrow__sizedblock"
      :size="block.size"
      :grow="block.grow"
    >
      <arrow-switch
        class="documentpagesortrow__arrow"
        :is_checked="sort_asc === true"
        :is_selected="sort_by === block.name"
        @click="
          sort_by === block.name
            ? $emit('toggle:direction')
            : $emit(
                'sort:by',
                getSortNameAndFunction(block.name, block.sort_rule)
              )
        "
      />
    </sized-div>
  </div>
</template>

<script>
import SizedDiv from "../SizedDiv.vue";
import ArrowSwitch from "../buttons/ArrowSwitch.vue";

export default {
  name: "DocumentPageSortRow",
  components: { SizedDiv, ArrowSwitch },
  props: {
    search_schema: {
      type: Object,
      required: true,
    },
    sort_asc: {
      type: Boolean,
      required: true,
    },
    sort_by: {
      type: String,
      required: false,
    },
  },
  emits: ["toggle:direction", "sort:by"],
  setup() {
    const getSortNameAndFunction = (block_name, sort_rule_name) => [
      block_name,
      sort_rule_name,
    ];

    return { getSortNameAndFunction };
  },
};
</script>
<style scoped>
.documentpagesortrow {
  display: flex;
}

.documentpagesortrow__sizedblock {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.documentpagesortrow__arrow {
  text-align: center;
}
</style>