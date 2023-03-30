<template>
  <div class="pdfdocumentrow">
    <sized-div class="pdfdocumentrow__sizedblock" size="w50">
      <form-text-field
        class="pdfdocumentrow__textfield"
        :value="progress_str"
      />
    </sized-div>
    <sized-div class="pdfdocumentrow__sizedblock" size="w50">
      <form-text-field
        class="pdfdocumentrow__textfield"
        :value="order.toString()"
      />
    </sized-div>
    <sized-div class="pdfdocumentrow__sizedblock" size="w100" :grow="true">
      <form-text-field class="pdfdocumentrow__textfield" :value="name" />
    </sized-div>
    <sized-div class="pdfdocumentrow__selectsizedblock" size="w100">
      <form-select-input
        class="pdfdocumentrow__selectinput"
        :parameters="{
          options: page_select_options,
        }"
        :value="page_from.toString()"
        @update="$emit('update:page_from', Number.parseInt($event))"
      />
    </sized-div>
    <sized-div class="pdfdocumentrow__selectsizedblock" size="w100">
      <form-select-input
        class="pdfdocumentrow__selectinput"
        :parameters="{
          options: page_select_options,
        }"
        :value="page_to.toString()"
        @update="$emit('update:page_to', Number.parseInt($event))"
      />
    </sized-div>
    <sized-div class="pdfdocumentrow__selectsizedblock" size="w50">
      <form-select-input
        class="pdfdocumentrow__selectinput"
        :parameters="{
          options: angle_select_options,
        }"
        :value="angle.toString()"
        @update="$emit('update:angle', Number.parseInt($event))"
      />
    </sized-div>
    <sized-div class="pdfdocumentrow__buttonsizedblock" size="w50">
      <text-button
        class="pdfdocumentrow__button pdfdocumentrow__button_arrow"
        title="&#9650;"
        @click="$emit('move:up')"
      />
    </sized-div>
    <sized-div class="pdfdocumentrow__buttonsizedblock" size="w50">
      <text-button
        class="pdfdocumentrow__button pdfdocumentrow__button_arrow"
        title="&#9660;"
        @click="$emit('move:down')"
      />
    </sized-div>
    <sized-div class="pdfdocumentrow__sizedblock" size="w100">
      <form-text-field
        class="pdfdocumentrow__textfield"
        :value="page_count.toString()"
      />
    </sized-div>
    <sized-div class="pdfdocumentrow__sizedblock" size="w100">
      <form-text-field class="pdfdocumentrow__textfield" :value="size" />
    </sized-div>
    <sized-div class="pdfdocumentrow__deleteblock" size="w100">
      <text-button
        v-if="uploaded"
        class="pdfdocumentrow__button"
        title="Удалить"
        @click="$emit('delete')"
      />
    </sized-div>
  </div>
</template>

<script>
import { computed } from "vue";
import SizedDiv from "./SizedDiv.vue";
import FormTextField from "./fields/FormTextField.vue";
import TextButton from "./buttons/TextButton.vue";
import FormSelectInput from "./fields/FormSelectInput.vue";

export default {
  components: { SizedDiv, FormTextField, TextButton, FormSelectInput },
  name: "PdfDocumentRow",
  props: {
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    page_count: {
      type: Number,
      required: true,
    },
    page_from: {
      type: Number,
      required: true,
    },
    page_to: {
      type: Number,
      required: true,
    },
    angle: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    uploaded: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    "delete",
    "move:up",
    "move:down",
    "update:page_from",
    "update:page_to",
    "update:angle",
  ],
  setup(props) {
    const progress_str = computed(() =>
      props.progress < 100 ? `${props.progress}%` : `\u2713`
    );

    const angle_select_options = [
      { name: "0", value: "0" },
      { name: "90", value: "90" },
      { name: "180", value: "180" },
      { name: "270", value: "270" },
    ];

    const page_select_options = computed(() =>
      [...Array(props.page_count).keys()].map((e) => {
        const n = (e + 1).toString();
        return { name: n, value: n };
      })
    );

    return {
      progress_str,
      angle_select_options,
      page_select_options,
    };
  },
};
</script>
<style scoped>
.pdfdocumentrow {
  display: flex;
}

.pdfdocumentrow__textfield {
  flex-grow: 1;
  padding: 3px;
  box-sizing: border-box;
}

.pdfdocumentrow__selectsizedblock {
  margin-right: 10px;
}

.pdfdocumentrow__selectinput {
  flex-grow: 1;
  /* margin-left: 2px;
  margin-right: 2px; */
}

.pdfdocumentrow__deleteblock {
  justify-content: center;
}

.pdfdocumentrow__buttonsizedblock {
  justify-content: center;
}

.pdfdocumentrow__button_arrow {
  color: lightsalmon;
}
</style>