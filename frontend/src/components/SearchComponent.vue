<template>
  <div class="searchcomponent">
    <document-page-search-row
      class="searchcomponent__searchrow"
      :search_schema="schema"
      :should_emit_search_event_on_any_keypress="
        should_emit_search_event_on_any_keypress
      "
      :required_space_for_link="has_link"
      :is_selection_required="is_selection_required"
      :is_all_selected="false"
      @search:docs="$emit('search', $event)"
      @selectall:docs="handle_select_all_items()"
    />
    <document-search-status-row
      class="searchcomponent__searchstatus"
      :count="items.length"
      :time="search_time"
      :min_index="pagination_min_index"
      :max_index="pagination_max_index"
    />
    <document-page-sort-row
      class="searchcomponent__sortrow"
      :search_schema="schema"
      :sort_asc="var_sort_asc"
      :sort_by="var_sort_by"
      @toggle:direction="var_sort_asc = !var_sort_asc"
      @sort:by="[var_sort_by, var_sort_rule] = $event"
    />
    <document-pagination-row
      class="searchcomponent__paginationrow"
      v-if="items.length > 0"
      :total_count="items.length"
      :count_per_page="pagination_count_per_page"
      :current_page="pagination_current_page"
      :variants="pagination_variants"
      @set:page_range="handle_set_page_range($event.min, $event.max)"
      @select:page="pagination_current_page = $event"
      @set:count_per_page="pagination_count_per_page = $event"
    />
    <!-- <div v-if="is_object_list_shown" class="searchcomponent__listcontainer"> -->
    <div
      class="searchcomponent__row"
      v-for="obj in paginated_items"
      :key="obj.id"
      :class="{ searchcomponent__row_selected: current_id === obj.id }"
      @click="$emit('choose', obj.id)"
    >
      <document-attribute-row
        class="searchcomponent__attributerow"
        :id="obj.id"
        :search_schema="schema"
        :has_link="has_link"
        :link_route_obj="obj.link_to_single_page"
        :attributes="obj.attributes"
        :is_selection_required="is_selection_required"
        :is_selected="obj.id in selected_item_ids"
        @select:doc="handle_select_item(obj.id)"
      />
      <document-files-row
        class="searchcomponent__filerow"
        v-if="is_files_shown"
        :files="obj.attachments"
        @download:file="
          $emit('download:file', {
            id: obj.id,
            file: $event[0],
            inline: $event[1],
          })
        "
        @copy_link_to:file="
          $emit('copy_link_to:file', { id: obj.id, file: $event })
        "
      />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import {
  useGetSortFunction,
  usePaginationMixin,
  useSelectionMixin,
} from "../logic/service_layer/use_modules";
import DocumentPageSearchRow from "./document/DocumentPageSearchRow.vue";
import DocumentAttributeRow from "./document/DocumentAttributeRow.vue";
import DocumentPageSortRow from "./document/DocumentPageSortRow.vue";
import DocumentPaginationRow from "./document/DocumentPaginationRow.vue";
import DocumentSearchStatusRow from "./document/DocumentSearchStatusRow.vue";
import DocumentFilesRow from "./document/DocumentFilesRow.vue";

export default {
  components: {
    DocumentPageSearchRow,
    DocumentAttributeRow,
    DocumentPageSortRow,
    DocumentPaginationRow,
    DocumentSearchStatusRow,
    DocumentFilesRow,
  },
  name: "SearchComponent",

  props: {
    model_objects: {
      type: Array,
      required: true,
    },
    // total_count_of_model_objects: {
    //   type: Number,
    //   required: false,
    //   default: 0
    // },
    schema: {
      type: Object,
      required: true,
    },
    sort_by: {
      type: String,
      required: true,
    },
    sort_asc: { type: Boolean, required: false, default: false },
    sort_rule: {
      type: String,
      required: false,
      default: "DEFAULT",
    },
    convert_obj_to_item: {
      type: Function,
      required: true,
    },
    current_id: {
      type: [Number, String],
      required: false,
      default: 0,
    },
    search_time: {
      type: Number,
      required: false,
      default: 0,
    },
    is_searching: {
      type: Boolean,
      required: false,
      default: false,
    },
    should_emit_search_event_on_any_keypress: {
      type: Boolean,
      required: false,
      default: false,
    },
    // should_sort: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    is_selection_required: {
      type: Boolean,
      required: false,
      default: false,
    },
    has_link: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_files_shown: {
      type: Boolean,
      required: false,
      default: false,
    },
    // is_search_row_shown: {
    //   type: Boolean,
    //   required: false,
    //   default: true,
    // },
    // is_search_status_shown: {
    //   type: Boolean,
    //   required: false,
    //   default: true,
    // },
    // is_sorting_shown: {
    //   type: Boolean,
    //   required: false,
    //   default: true,
    // },
    // is_pagination_shown: {
    //   type: Boolean,
    //   required: false,
    //   default: true,
    // },
    // is_object_list_shown: {
    //   type: Boolean,
    //   required: false,
    //   default: true,
    // },
  },

  emits: [
    "choose",
    "search",
    "download:file",
    "copy_link_to:file",
    "select",
    // "select:sort_by",
    // "select:sort_asc",
    // "select:page",
    // "select:count_per_page",
  ],

  setup(props, { emit }) {
    // SEARCH
    const var_sort_by = ref(props.sort_by);
    const var_sort_asc = ref(props.sort_asc);
    const var_sort_rule = ref(props.sort_rule);
    const var_sort_func = ref(useGetSortFunction(var_sort_rule.value));

    // watch(
    //   var_sort_by,
    //   () => emit('select:sort_by', var_sort_by.value)
    // );

    // watch(
    //   var_sort_asc,
    //   () => emit('select:sort_asc', var_sort_asc.value)
    // );

    watch(
      var_sort_rule,
      (newValue) => (var_sort_func.value = useGetSortFunction(newValue))
    );

    // ITEMS
    const items = computed(() => {
      let arr = props.model_objects;

      arr.sort(
        (a, b) =>
          (var_sort_asc.value === true ? 1 : -1) *
          var_sort_func.value(a[var_sort_by.value], b[var_sort_by.value])
      );
      return arr.map((obj) => props.convert_obj_to_item(obj));
    });

    // PAGINATION
    const {
      pagination_variants,
      pagination_count_per_page,
      pagination_current_page,
      pagination_min_index,
      pagination_max_index,
      paginated_items,
      handle_set_page_range,
    } = usePaginationMixin(items);
    // } = usePaginationMixin(items, props.total_count_of_model_objects);

    // watch(
    //   pagination_current_page,
    //   () => emit('select:page', pagination_current_page.value)
    // );

    // watch(
    //   pagination_count_per_page,
    //   () => emit('select:count_per_page', pagination_count_per_page.value)
    // );

    // SELECTION
    const {
      selected_item_ids,
      selected_items,
      count_of_selected_items,
      handle_select_all_items,
      handle_select_item,
      reset_selection,
    } = useSelectionMixin(items, paginated_items);

    watch(selected_items, (newValue) => emit("select", newValue));

    return {
      items,

      // SEARCH
      var_sort_by,
      var_sort_asc,
      var_sort_rule,

      // PAGINATION
      paginated_items,
      handle_set_page_range,
      pagination_variants,
      pagination_count_per_page,
      pagination_current_page,
      pagination_min_index,
      pagination_max_index,

      // SELECTION
      selected_item_ids,
      selected_items,
      count_of_selected_items,
      handle_select_all_items,
      handle_select_item,
      reset_selection,
    };
  },
};
</script>
<style scoped>
.searchcomponent {
  display: flex;
  flex-direction: column;
}

.searchcomponent__searchstatus {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.searchcomponent__searchrow {
  display: flex;
}

.searchcomponent__row {
  cursor: pointer;
}

.searchcomponent__row:nth-child(even) {
  background-color: rgb(215, 242, 255);
}

.searchcomponent__row_selected {
  background-color: lightyellow !important;
}
</style>
