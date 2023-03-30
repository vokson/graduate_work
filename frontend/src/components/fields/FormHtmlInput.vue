<template>
  <div class="formhtmlinput">
    <ckeditor
      id="formhtmlinput-editor"
      class="formhtmlinput__editor"
      :style="{ height: height }"
      v-model="body_html"
      :config="editor_config"
      @namespaceloaded="onNamespaceLoaded"
    ></ckeditor>
  </div>
</template>

<script>
import { computed, watch, ref } from "vue";

export default {
  name: "FormHtmlInput",

  props: {
    parameters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      type: String,
      required: false,
    },
  },

  setup(props, { emit }) {
    const height = computed(() => props.parameters["height"] || 500);
    const default_value = computed(() => props.parameters["default"] || "");

    const body_html = ref(props.value || default_value.value);

    const height_in_px = height.value - 30;

    const editor_config = {
      fullPage: true,
      allowedContent: true,
      extraPlugins: ["autogrow", "colorbutton"],
      resize_enabled: false,
      autoGrow_minHeight: height_in_px,
      autoGrow_maxHeight: height_in_px,
      toolbar: [
        { name: "clipboard", items: ["Undo"] },
        { name: "basicstyles", items: ["Bold", "Italic", "RemoveFormat"] },
        { name: "colorbutton", items: ["BGColor", "TextColor"] },
      ],
      colorButton_colors:
        "000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969," +
        "B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080," +
        "F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9," +
        "FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3," +
        "FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF",
      removePlugins: "elementspath",
    };

    const onNamespaceLoaded = (CKEDITOR) => {
      // Plugin расположен в public
      CKEDITOR.plugins.addExternal("colorbutton", "/colorbutton/");
    };

    watch(body_html, (newValue) => emit("update", newValue));

    return { height, body_html, editor_config, onNamespaceLoaded };
  },
};
</script>

<style>
.formhtmlinput {
  display: flex;
  width: 100%;
}

.formhtmlinput__editor {
  flex-grow: 1;
  border: none;
}
</style>