<template>
  <div class="formemailaddressinput">
    <div class="formemailaddressinput__container">
      <form-text-field
        class="formemailaddressinput__label"
        :parameters="{ align: 'center' }"
        :value="
          variant_idx == 0
            ? 'Текущее письмо'
            : 'Адресаты из прошлых писем: ' + variant_idx.toString()
        "
      />
      <div class="formemailaddressinput__header">
        <div
          class="
            formemailaddressinput__button formemailaddressinput__button_left
          "
          :class="{
            formemailaddressinput__button_inactive:
              variant_idx === variant_count - 1,
          }"
          @click="goto_next_letter()"
          title="Предыдущее письмо"
        />
        <div
          class="
            formemailaddressinput__button formemailaddressinput__button_right
          "
          :class="{ formemailaddressinput__button_inactive: variant_idx === 0 }"
          title="Следующее письмо"
          @click="goto_previous_letter()"
        />
        <form-text-input
          class="formemailaddressinput__search"
          :parameters="search_field_parameters"
          :value="search_query"
          @update="search_query = $event"
        />
        <div
          class="
            formemailaddressinput__button formemailaddressinput__button_add
          "
          :class="{
            formemailaddressinput__button_inactive:
              validate_email(search_query) === false || variant_idx > 0,
          }"
          @click="add_email(search_query)"
          title="Добавить e-mail"
        />
        <div
          class="
            formemailaddressinput__button formemailaddressinput__button_approve
          "
          :class="{
            formemailaddressinput__button_inactive:
              variant_idx === 0 || search_query != '',
          }"
          @click="use_the_letter_as_current()"
          title="Использовать адресатов из данного письма"
        />
      </div>
      <div class="formemailaddressinput__rowcontainer">
        <div
          class="formemailaddressinput__row"
          :class="{
            formemailaddressinput__row_to: row.designation == 1,
            formemailaddressinput__row_cc: row.designation == 2,
            formemailaddressinput__row_bcc: row.designation == 3,
          }"
          v-for="row in sorted_current_variant"
          :key="row.full_email"
          :title="get_row_title(row.designation)"
          @click="change_designation(row.full_email)"
        >
          <div class="formemailaddressinput__description">
            {{ row.description }}
          </div>
          <div class="formemailaddressinput__email">
            {{ row.email }}
          </div>
          <div class="formemailaddressinput__@">@</div>
          <div class="formemailaddressinput__domain">
            {{ row.domain }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import FormTextInput from "./FormTextInput.vue";
import FormTextField from "./FormTextField.vue";

export default {
  name: "FormEmailToAddressInput",
  components: {
    FormTextInput,
    FormTextField,
  },
  props: {
    parameters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    // REQUIRED CONTEXT EXPLANATION
    // 1. ADDRESS
    //      Array of objects. Each objects has keys TO, CC, BCC with value
    //      as string of email addresses separated by space ' '
    // 2. KNOWN_EMAILS
    //      Objects with addresses as keys, description of user as values
    context: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      type: Object,
      required: false,
    },
  },

  emits: ["update"],

  setup(props, { emit }) {
    const default_value = props.parameters["default"] || {
      TO: "",
      CC: "",
      BCC: "",
    };
    // if (!props.value) emit("update", default_value);
    if (props.value === undefined || props.value === null)
      emit("update", default_value);

    // Computes is used because might be async value
    const addresses = computed(() => props.context["ADDRESS"]);
    const known_emails = computed(() => props.context["KNOWN_EMAILS"]);

    // DECODE

    const address_decode_str = (result, text, designation) => {
      if (!text) return;
      text
        .split(" ")
        .filter((e) => e != "")
        .forEach((e) => (result[e] = designation));
    };

    const address_decode = (obj) => {
      let result = {};

      address_decode_str(result, obj["NA"], 4);
      address_decode_str(result, obj["BCC"], 3);
      address_decode_str(result, obj["CC"], 2);
      address_decode_str(result, obj["TO"], 1);

      return Object.entries(result).map(([a, b]) => {
        return {
          description: known_emails.value ? known_emails.value[a] || "" : "",
          email: a.split("@")[0],
          domain: a.split("@")[1],
          full_email: a,
          designation: b,
        };
      });
    };

    // ENCODE
    const address_encode = (obj) => {
      let result = { 1: [], 2: [], 3: [], 4: [] };
      obj.forEach((row) => result[row.designation].push(row.full_email));
      return {
        TO: result[1].join(" "),
        CC: result[2].join(" "),
        BCC: result[3].join(" "),
      };
    };

    // VARIANTS
    const obj_with_all_NA_addresses = computed(() => {
      let all = [];
      if (props.value)
        all = all.concat(
          props.value["TO"],
          props.value["CC"],
          props.value["BCC"]
        );

      if (addresses.value) {
        addresses.value.forEach(
          (e) =>
            (all = all
              .concat(e["TO"] || [])
              .concat(e["CC"] || [])
              .concat(e["BCC"] || []))
        );
      }

      if (known_emails.value) all = all.concat(Object.keys(known_emails.value));
      return { NA: all.filter((e) => e != "").join(" ") };
    });

    const variants = computed(() => {
      let arr = [
        address_decode(
          Object.assign({}, props.value, obj_with_all_NA_addresses.value)
        ),
      ];
      if (!addresses.value) return arr;

      addresses.value.forEach((e) => arr.push(address_decode(e)));
      return arr;
    });

    const variant_idx = ref(0);
    const variant_count = computed(() => variants.value.length);

    const current_variant = computed(() => {
      return variants.value[variant_idx.value];
    });

    // PAGES
    const goto_previous_letter = () => {
      variant_idx.value = Math.max(0, variant_idx.value - 1);
    };

    const goto_next_letter = () => {
      variant_idx.value = Math.min(
        variant_idx.value + 1,
        variant_count.value - 1
      );
    };

    const use_the_letter_as_current = () => {
      if (variant_idx.value == 0 || search_query.value != "") return;
      emit("update", addresses.value[variant_idx.value - 1]);
      variant_idx.value = 0;
    };

    const get_row_title = (designation) => {
      switch (designation) {
        case 1:
          return "Кому";
        case 2:
          return "Копия";
        case 3:
          return "Скрытая копия";
        default:
          return null;
      }
    };

    // NEW EMAIL
    const validate_email = (text) =>
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        text
      );

    const add_email = (email) => {
      if (validate_email(email) === false || variant_idx.value > 0) return;
      let modified_current_variant = structuredClone(current_variant.value);
      modified_current_variant.push({
        description: "",
        designation: 1,
        domain: "",
        email: "",
        full_email: email.toLowerCase(),
      });
      emit("update", address_encode(modified_current_variant));
      search_query.value = "";
    };

    // CHOOSING
    const next_designation = (x) => (x == 4 ? 1 : x + 1);

    const change_designation = (full_email) => {
      if (variant_idx.value > 0) return;

      let modified_current_variant = structuredClone(current_variant.value);
      modified_current_variant.forEach((e) => {
        if (e.full_email === full_email)
          e.designation = next_designation(e.designation);
      });

      emit("update", address_encode(modified_current_variant));
    };

    // SEARCH
    const search_query = ref("");
    const search_field_parameters = {
      placeholder: "Введите email или имя пользователя..",
      height: 30
    };

    const filtered_current_variant = computed(() => {
      return current_variant.value.filter(
        (e) =>
          e.description
            .toLowerCase()
            .includes(search_query.value.toLowerCase()) ||
          (e.email + "@" + e.domain)
            .toLowerCase()
            .includes(search_query.value.toLowerCase())
      );
    });

    // SORT
    const sorted_current_variant = computed(() => {
      let arr = structuredClone(filtered_current_variant.value);
      arr.sort((a, b) => {
        let cmp = 0;

        if (a.designation == 4 || b.designation == 4)
          cmp = a.designation - b.designation;
        if (cmp != 0) return cmp;

        cmp = a.description.localeCompare(b.description);
        if (cmp != 0) return cmp;

        cmp = a.email.localeCompare(b.email);
        return cmp;
      });
      return arr;
    });

    return {
      variants,
      variant_idx,
      variant_count,
      current_variant,
      sorted_current_variant,
      search_query,
      search_field_parameters,
      obj_with_all_NA_addresses,
      change_designation,

      // PAGES
      get_row_title,
      goto_previous_letter,
      goto_next_letter,
      use_the_letter_as_current,

      // NEW EMAIL
      validate_email,
      add_email,
    };
  },
};
</script>

<style scoped>
.formemailaddressinput {
  display: flex;
  width: 100%;
}

.formemailaddressinput__container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.formemailaddressinput__header,
.formemailaddressinput__row {
  display: flex;
}

.formemailaddressinput__email,
.formemailaddressinput__description,
.formemailaddressinput__domain {
  flex-grow: 1;
  flex-basis: 100px;
}

.formemailaddressinput__email {
  margin-right: 10px;
  text-align: right;
}

.formemailaddressinput__designation {
  width: 50px;
}

.formemailaddressinput__search {
  flex-grow: 1;
}

.formemailaddressinput__button {
  min-width: 30px;
  min-height: 30px;
  padding: 3px;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  color: lightcoral;
}

.formemailaddressinput__button:hover {
  mask-image: linear-gradient(rgba(0, 0, 0, 1), transparent, rgba(0, 0, 0, 1));
}

.formemailaddressinput__button_left {
  background: url("../../../public/left.png") center center/24px 24px
    no-repeat;
}

.formemailaddressinput__button_right {
  background: url("../../../public/right.png") center center/24px 24px
    no-repeat;
}

.formemailaddressinput__button_approve {
  background: url("../../../public/check.png") center center/24px 24px
    no-repeat;
}

.formemailaddressinput__button_add {
  background: url("../../../public/plus.png") center center/24px 24px
    no-repeat;
}

.formemailaddressinput__button_inactive {
  filter: gray;
  -webkit-filter: grayscale(100%);
}

.formemailaddressinput__label {
  padding: 3px;
}

.formemailaddressinput__rowcontainer {
  display: flex;
  flex-direction: column;
  min-height: 300px;
  max-height: 300px;
  overflow-y: scroll;
  padding: 3px;
}
.formemailaddressinput__row {
  margin: 1px;
  padding: 1px 30px;
  cursor: pointer;
  user-select: none;
}

.formemailaddressinput__row_to {
  background-color: rgb(152, 251, 152);
}

.formemailaddressinput__row_cc {
  background-color: rgb(255, 250, 205);
}

.formemailaddressinput__row_bcc {
  background-color: rgb(240, 240, 240);
}
</style>
