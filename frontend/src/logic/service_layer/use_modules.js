import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import {
  MyCredentials,
} from "../domain/command";
import { MessageBus } from "./message_bus";
import router from "../../router";

const deepObjectCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};


const filterArrayOfObjectsByQuery = (arrOfObjects, queryObject) => {
  return arrOfObjects.filter((obj) => {
    let to_be_taken = true;

    // Перебираем все ключи query
    // Ключ A__B__C__X из нескольких частей, разделенных '__'
    // А - property объекта
    // B, C, D ... - наменование вложенных ключей, если свойство объекта - это объект
    // X - правила сравнения exact | iexact | contains | icontains | gt | gte | lt | lte
    Object.keys(queryObject).forEach((key) => {
      if (!to_be_taken) return;

      //  Что ищем
      const needle = queryObject[key];
      if (!(needle || needle === 0)) return;

      // Разбиваем ключ на части
      let key_names = key.split("__");
      const rule = key_names.length <= 1 ? "exact" : key_names.pop();

      // Получаем значение
      let haystack = obj;
      key_names.forEach((x) => (haystack = haystack[x]));

      // Если значение, по которому нужно искать, отсутствует
      // пропускаем данный объект
      if (!(haystack || haystack === 0)) {
        to_be_taken = false;
        return;
      }

      switch (rule) {
        case "exact":
          to_be_taken = haystack == needle;
          break;

        case "iexact":
          to_be_taken = haystack.toLowerCase() == needle.toLowerCase();
          break;

        case "contains":
          to_be_taken = String.prototype.includes.call(haystack, needle);
          break;

        case "icontains":
          to_be_taken = String.prototype.includes.call(
            haystack.toLowerCase(),
            needle.toLowerCase()
          );
          break;

        case "gt":
          to_be_taken = haystack > needle;
          break;

        case "gte":
          to_be_taken = haystack >= needle;
          break;

        case "lt":
          to_be_taken = haystack < needle;
          break;

        case "lte":
          to_be_taken = haystack <= needle;
          break;

        default:
          console.log("Wrong comparison rule " + rule.toString() + "!");
          to_be_taken = false;
      }
    });

    return to_be_taken;
  });
};

const useBeforeEnterPage = async (
  uow,
) => {

  const route = useRoute();

  const auto_login_action = async (uow) => {
    if (
      !uow.user_repository.is_authenticated() &&
      uow.token_repository.get_access_token()
    ) {
      await MessageBus.handle(new MyCredentials(), uow);
    }
  };

  await auto_login_action(uow);
  if (!uow.user_repository.is_authenticated())
    router.push({
      name: "LoginPage",
      query: { url: encodeURIComponent(route.fullPath) },
    });
};

const convertStringToDate = (value, rule) => {
  const parts = value.split(".");
  let date = NaN;

  try {
    // Для <, <= берем конец дня
    if (rule === null || rule === "lt" || rule === "lte") {
      date = new Date(
        parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10),
        23,
        59,
        59
      );
    }

    // Для >, >= берем начало дня
    if (rule === "gt" || rule === "gte") {
      date = new Date(
        parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10)
      );
    }

    return date;
  } catch (e) {
    return NaN;
  }
};

const useDataEncode = (value, rule = null, converter = null) => {
  if (!converter) return value;

  const converters = {
    date_to_timestamp: convertDateToTimestamp,
    date_to_iso_string: convertDateToIsoString,
    date_to_date_object: convertDateToDateObject,
  };

  const converter_func = Object.prototype.hasOwnProperty.call(
    converters,
    converter
  )
    ? converters[converter]
    : null;

  return converter_func ? converter_func(value, rule) : "";
};

// MIXINS

// init_obj - Объект для инициализации
// repository - Репозиторий, из которого нужно брать объекты
// from_repository_convertion - Функция конвертации из объекта для отображения в объект репозитория
const useCurrentMixin = (init_obj, repository, from_repository_convertion) => {
  const current_id = ref(null);
  const current = ref(convertObject(init_obj, from_repository_convertion));

  const handle_update_attribute = (name, value) =>
    (current.value[name] = value);

  watch(current_id, (newValue) => {
    if (newValue === null) return;
    // console.log(newValue);
    const obj = repository.get(newValue).value;
    // console.log(obj);
    current.value = convertObject(obj.to_dict, from_repository_convertion);
  });

  return {
    current_id,
    current,
    handle_update_attribute,
  };
};

// all_items - Must be Ref
// filtered_items - Must be Ref
const useSelectionMixin = (all_items, items_seen_on_page) => {
  // Объект состояния выделения элементов
  // key: str|int - ID элемента
  // value: bool - true выделен, false не выделен
  const selected_item_ids = ref({});

  // Количество выделенных элементов
  const count_of_selected_items = computed(
    () =>
      Object.values(selected_item_ids.value).filter((x) => x === true).length
  );

  // Метод для выделения элемента по ID
  const handle_select_item = (id) => {
    if (id in selected_item_ids.value)
      selected_item_ids.value[id] = !selected_item_ids.value[id];
    else selected_item_ids.value[id] = true;
  };

  // Метод для снятия выделения
  const reset_selection = () => {
    is_all_selected.value = false;
    selected_item_ids.value = {};
  };

  // При изменении списка элементов, выделение снимается
  watch(
    () => all_items.value,
    () => reset_selection()
  );

  const is_all_selected = ref(false);

  // Метод для выделения или снятия выделения всех элементов
  const handle_select_all_items = () => {
    if (is_all_selected.value === true) {
      reset_selection();
      is_all_selected.value = false;
    } else {
      is_all_selected.value = true;
      items_seen_on_page.value.forEach(
        (item) => (selected_item_ids.value[item.id] = true)
      );
    }
  };

  const selected_items = computed(() =>
    items_seen_on_page.value.filter(
      (item) =>
        item.id in selected_item_ids.value &&
        selected_item_ids.value[item.id] === true
    )
  );

  return {
    selected_item_ids,
    selected_items,
    count_of_selected_items,
    is_all_selected,
    handle_select_all_items,
    handle_select_item,
    reset_selection,
  };
};

// items: array of Object - Массив объектов, от которых нужно взять срез
// variants: array of int - Массив вариантов кол-ва результатов на странице
// count: int - Начальное кол-во результатов на странице. Должно быть равно одному из variants
const usePaginationMixin = (
  items, // Ref
  variants = [20, 100, 500, 1000],
  count = 100
) => {
  const pagination_variants = ref(variants);
  const pagination_count_per_page = ref(count);
  const pagination_current_page = ref(1);

  const pagination_min_index = ref(0);
  const pagination_max_index = ref(100);

  const handle_set_page_range = (min, max) => {
    pagination_min_index.value = min;
    pagination_max_index.value = max;
  };

  const paginated_items = computed(() =>
    items.value.slice(
      pagination_min_index.value,
      pagination_max_index.value + 1
    )
  );

  return {
    pagination_variants,
    pagination_count_per_page,
    pagination_current_page,
    pagination_min_index,
    pagination_max_index,
    paginated_items,
    handle_set_page_range,
  };
};


// FUNCTIONS

const convertObject = (obj, convert_functions, exclude_keys = []) => {
  let result = {};
  // Преобразуем объекты, выбрасывая ненужные ключи
  Object.keys(obj)
    .filter((key) => !exclude_keys.includes(key))
    .forEach(
      (key) =>
        (result[key] = Object.prototype.hasOwnProperty.call(
          convert_functions,
          key
        )
          ? convert_functions[key](obj[key])
          : obj[key])
    );
  // Добавляем ключи, которых не было в исходном объекте
  Object.keys(convert_functions)
    .filter((key) => !Object.prototype.hasOwnProperty.call(obj, key))
    .forEach((key) => (result[key] = convert_functions[key]()));
  return result;
};

const convertDateToDateObject = (value, rule) =>
  convertStringToDate(value, rule);

const convertDateToTimestamp = (value, rule) => {
  const date = convertStringToDate(value, rule);
  return isNaN(date) ? "" : Math.floor(date.getTime() / 1000);
};

const convertDateToIsoString = (value, rule) => {
  const date = convertStringToDate(value, rule);
  return isNaN(date) ? "" : date.toISOString();
};

const convertDateToDateString = (date) => {
  return [
    date.getDate().toString().padStart(2, "0"),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getFullYear().toString(),
  ].join(".");
};

const convertDateToDateTimeString = (date) => {
  return date.toLocaleString("ru-RU", {timeZone: "Europe/Moscow"});
};

const useGetSortFunction = (name) => {
  const sort_default = (a, b) => {
    if (a === b) return 0;
    return a > b ? 1 : -1;
  };

  const sort_numbers = (a, b) => {
    return a - b;
  };

  const sort_strings = (a, b) => {
    return a.localeCompare(b);
  };

  const sort_change_order_number = (a, b) => {
    try {
      const [id_a, year_a] = a.split("-", 2);
      const [id_b, year_b] = b.split("-", 2);

      // console.log(id_a, year_a, "<>", id_b, year_b)

      const compare_years = Number.parseInt(year_a) - Number.parseInt(year_b);
      if (compare_years !== 0) {
        return compare_years;
      }

      const compare_ids = Number.parseInt(id_a) - Number.parseInt(id_b);
      return compare_ids;
    } catch (e) {
      return 0;
    }
  };

  if (name === null || name === undefined) name = "DEFAULT";

  const rules = {
    DEFAULT: sort_default,
    INTEGER: sort_numbers,
    STRING: sort_strings,
    BOOL: sort_default,
    DATE: sort_default,
    CHANGE_ORDER_NUMBER: sort_change_order_number,
  };

  if (!Object.prototype.hasOwnProperty.call(rules, name)) name = "DEFAULT";

  return rules[name];
};

export {
  deepObjectCopy,
  useBeforeEnterPage,
  useDataEncode,
  useGetSortFunction,
  // MIXINS
  useCurrentMixin,
  useSelectionMixin,
  usePaginationMixin,
  // FUNCTIONS
  convertObject,
  convertDateToDateString,
  convertDateToDateTimeString,
  convertDateToDateObject,
  // FILTERS
  filterArrayOfObjectsByQuery,
};
