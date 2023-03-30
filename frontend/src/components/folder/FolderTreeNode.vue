<template>
  <ul class="foldertreenode">
    <li
      v-for="name in keysWithoutTarget"
      :key="name"
      class="foldertreenode__element"
    >
      <div class="foldertreenode__list">
        <icon-button
          v-if="hasNonTargetKeys(tree[name])"
          class="foldertreenode__listicon"
          icon_on="&#10148;"
          icon_off="&#9660;"
          :is_active="(is_opened[name] || expand_all) ? false : true"
          @click="is_opened[name] = !is_opened[name]"
        />

        <router-link
          v-if="hasTargetKey(tree[name])"
          class="foldertreenode__label"
          :to="{
            name: 'SearchDocumentPage',
            params: {
              folder_id: tree[name]['_target'].id,
              usergroup_id: usergroup_id,
            },
          }"
        >
          {{ name }}
        </router-link>

        <span v-else class="foldertreenode__label">{{ name }}</span>
      </div>

      <folder-tree-node
        v-if="
          hasNonTargetKeys(tree[name]) &&
          name !== '_target' &&
          (is_opened[name] || expand_all)
        "
        :tree="tree[name]"
        :usergroup_id="usergroup_id"
        :expand_all="expand_all"
      />
    </li>
  </ul>
</template>

<script>
import { reactive, computed } from "vue";
import IconButton from "../buttons/IconButton.vue";

export default {
  components: { IconButton },
  name: "FolderTreeNode",
  props: {
    tree: {
      type: Object,
      required: true,
    },
    usergroup_id: {
      type: Number,
      required: true,
    },
    expand_all: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const keysWithoutTarget = computed(() => {
      let arr = Object.keys(props.tree).filter((name) => name !== "_target");
      arr.sort();
      return arr;
    });

    const is_opened = reactive({});

    const hasTargetKey = (obj) =>
      Object.prototype.hasOwnProperty.call(obj, "_target");

    const hasNonTargetKeys = (obj) =>
      Object.keys(obj).filter((name) => name !== "_target").length > 0;

    return { keysWithoutTarget, hasNonTargetKeys, hasTargetKey, is_opened };
  },
};
</script>

<style>
ul.foldertreenode {
  display: flex;
  flex-direction: column;
}

.foldertreenode__element {
  margin-left: 10px;
}

.foldertreenode__list {
  display: flex;
}

.foldertreenode__label {
  padding: 5px;
  font-size: 24px;
  text-decoration: none;
  user-select: none;
}
</style>