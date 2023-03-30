<template>
  <div class="flowitemstep">
    <div class="flowitemstep__row flowitemstep__row_date">
      <div
        class="flowitemstep__state"
        :class="{
          flowitemstep__state_running: state === 'RUNNING',
          flowitemstep__state_waiting: state === 'WAITING',
          flowitemstep__state_finished_fail: state === 'FINISHED_FAIL',
          flowitemstep__state_finished_success: state === 'FINISHED_SUCCESS',
        }"
      />
      <form-text-field
        class="flowitemstep__date"
        :value="formatted_started_at"
      />
      <div class="flowitemstep__freespace" />
      <form-text-field class="flowitemstep__name" :value="name" />
      <form-text-field
        v-if="variable_name"
        class="flowitemstep__name"
        :value="'[' + (variable_name || name) + ']'"
      />
      <div class="flowitemstep__freespace" />
      <form-text-field
        class="flowitemstep__date"
        :value="formatted_finished_at"
      />
    </div>

    <div class="flowitemstep__row">
      <form-text-field class="flowitemstep__action" :value="action" />
      <form-text-field class="flowitemstep__description" :value="description" />
    </div>

    <div class="flowitemstep__row" v-if="Object.keys(attributes).length !== 0">
      <form-text-field
        class="flowitemstep__caption"
        value="Правила формирования входных данных:"
      />
      <div
        class="flowitemstep__arrow"
        v-bind:class="{
          flowitemstep__arrow_selected: is_attributes_shown,
        }"
        v-on:click="is_attributes_shown = !is_attributes_shown"
      >
        {{ is_attributes_shown ? "&#x25bc;" : "&#x25c6;" }}
      </div>
    </div>

    <div
      class="flowitemstep__row"
      v-for="(attr_value, attr_key) in attributes"
      :key="attr_key"
    >
      <form-text-field
        v-if="is_attributes_shown"
        class="flowitemstep__label"
        :value="attr_key"
      />
      <form-text-field
        v-if="is_attributes_shown"
        class="flowitemstep__value"
        :value="attr_value"
      />
    </div>

    <div class="flowitemstep__row" v-if="Object.keys(input).length !== 0">
      <form-text-field class="flowitemstep__caption" value="Входные данные:" />
      <div
        class="flowitemstep__arrow"
        v-bind:class="{
          flowitemstep__arrow_selected: is_input_shown,
        }"
        v-on:click="is_input_shown = !is_input_shown"
      >
        {{ is_input_shown ? "&#x25bc;" : "&#x25c6;" }}
      </div>
    </div>

    <textarea
      v-if="is_input_shown"
      :value="formatted_input"
      rows="10"
      class="flowitemstep__textarea"
    />

    <div class="flowitemstep__row" v-if="Object.keys(output).length !== 0">
      <form-text-field class="flowitemstep__caption" value="Выходные данные:" />
      <div
        class="flowitemstep__arrow"
        v-bind:class="{
          flowitemstep__arrow_selected: is_output_shown,
        }"
        @click="is_output_shown = !is_output_shown"
      >
        {{ is_output_shown ? "&#x25bc;" : "&#x25c6;" }}
      </div>
    </div>

    <textarea
      v-if="is_output_shown"
      :value="formatted_output"
      rows="10"
      class="flowitemstep__textarea"
    />
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import FormTextField from "../fields/FormTextField.vue";
import { convertDateToDateTimeString } from "../../logic/service_layer/use_modules";
export default {
  components: { FormTextField },
  name: "FlowItemStep",
  props: {
    name: {
      type: String,
      required: true,
    },
    variable_name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    attributes: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    input: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    output: {
      type: [Object, String],
      required: false,
      default: () => ({}),
    },
    success: {
      type: Boolean,
      required: true,
    },
    started_at: {
      type: Date,
      required: false,
      default: null,
    },
    finished_at: {
      type: Date,
      required: false,
      default: null,
    },
  },
  events: ["updated"],

  setup(props, { emit }) {
    const formatted_input = computed(() =>
      JSON.stringify(props.input, null, 3)
    );

    const formatted_output = computed(() =>
      JSON.stringify(props.output, null, 3)
    );

    const formatted_started_at = computed(() =>
      props.started_at === null
        ? "Не стартовал"
        : convertDateToDateTimeString(props.started_at)
    );

    const formatted_finished_at = computed(() =>
      props.finished_at === null
        ? "Не финишировал"
        : convertDateToDateTimeString(props.finished_at)
    );

    const state = computed(() => {
      if (props.started_at === null) return "WAITING";
      if (props.finished_at === null) return "RUNNING";
      if (props.success === true) return "FINISHED_SUCCESS";
      return "FINISHED_FAIL";
    });

    const is_input_shown = ref(false);
    const is_output_shown = ref(false);
    const is_attributes_shown = ref(false);

    const emit_updated = () => emit("updated");
    watch(is_input_shown, () => emit_updated());
    watch(is_output_shown, () => emit_updated());
    watch(is_attributes_shown, () => emit_updated());

    return {
      formatted_input,
      formatted_output,
      formatted_started_at,
      formatted_finished_at,
      state,
      is_input_shown,
      is_output_shown,
      is_attributes_shown,
      emit_updated,
    };
  },
};
</script>

<style>
.flowitemstep {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 3px;
}

.flowitemstep__row {
  display: flex;
  width: 100%;
}

.flowitemstep__row_date {
  padding-bottom: 5px;
}

.flowitemstep__action {
  font-weight: 500;
  margin-right: 5px;
  background-color: aquamarine;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
}

.flowitemstep__description {
  flex-grow: 1;
  background-color: lightgoldenrodyellow;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
}

.flowitemstep__label {
  min-width: 150px;
}

.flowitemstep__caption {
  font-weight: 500;
}

.flowitemstep__value {
  flex-grow: 1;
  margin-bottom: 10px;
}

.flowitemstep__textarea {
  width: 100%;
  min-height: 30px;
  resize: vertical;
}

.flowitemstep__arrow {
  margin-left: 5px;
  display: block;
  font-size: 16px;
  cursor: pointer;
  color: green;
  user-select: none;
}

.flowitemstep__arrow_selected {
  color: red;
}

.flowitemstep__freespace {
  flex-grow: 1;
}

.flowitemstep__state {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.flowitemstep__state_running {
  background: url("../../../public/pie-chart.png") top left/20px 20px no-repeat;
}

.flowitemstep__state_waiting {
  background: url("../../../public/question.png") top left/20px 20px no-repeat;
}

.flowitemstep__state_finished_success {
  background: url("../../../public/check.png") top left/20px 20px no-repeat;
}

.flowitemstep__state_finished_fail {
  background: url("../../../public/cancel.png") top left/20px 20px no-repeat;
}
</style>