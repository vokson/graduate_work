// import Ajv from "ajv";
// import AjvErrors from "ajv-errors";

import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import {
  MyCredentials,
  // GetInfo,
  // GetFolders,
  // GetRoles,
  // GetUserFolderSettings,
  // GetUsers,
  // GetUserReplacements,
  // GetOnBehalfUsers,
  // GetUserGroups,
  // GetPermissions,
  // GetUserPermissionsForFolder,
  // GetUserSearchSchema,
  // GetSpareFiles,
  // GetFlowItem,
  // GetFlowItemSteps,
  // GetDocument,
  // ValidateDocument,
  // GetWaitingDocumentApprovals,
  // GetDocumentApprovals,
  // GetDocumentApprovalSpareFiles,
  // GetDocumentApprovalFlow,
  // GetCart,
  // GetServerSettings,
  // GetMailBoxes,
  // GetMailChannels,
  // GetCounters,
  // // CONTEXT
  // GetDocumentAttributesContext,
  // GetDocumentPreviousAttributeContext,
  // GetUserEmailContext,
} from "../domain/command";
// import { AccessPagePermissionCheckFail } from "../domain/event";
import { MessageBus } from "./message_bus";
import router from "../../router";

const deepObjectCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// const filterArrayOfObjects = (
//   arrOfObjects,
//   queryObject,
//   caseSensitive = true
// ) => {
//   return arrOfObjects.filter((obj) => {
//     let to_be_taken = true;

//     Object.keys(queryObject).forEach((key) => {
//       let value = obj[key];

//       if (value === undefined) {
//         to_be_taken = false;
//         return;
//       }

//       // Если значение NULL
//       if (value === null) {
//         // Если запрос пустой, значение попадает в выборку
//         // в противном случае, нет
//         if (queryObject[key]) to_be_taken = false;
//         return;
//       }

//       let needle = queryObject[key];

//       if (!caseSensitive) {
//         value = value.toLowerCase();
//         needle = needle.toLowerCase();
//       }

//       if (!String.prototype.includes.call(value, needle)) to_be_taken = false;
//     });

//     return to_be_taken;
//   });
// };

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
  // required_permissions,
  // folder_id = null,
  // usergroup_id = null
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
  // // Проверяем разрешения
  // if (folder_id !== null && usergroup_id !== null) {
  //   await MessageBus.handle(
  //     new GetUserPermissionsForFolder(folder_id, usergroup_id),
  //     uow
  //   );
  // }
  if (!uow.user_repository.is_authenticated())
    router.push({
      name: "LoginPage",
      query: { url: encodeURIComponent(route.fullPath) },
    });

  // required_permissions.forEach((e) => {
  //   if (
  //     uow.permission_repository.has(e).value !== true &&
  //     uow.permission_repository.has_for_folder(folder_id, e).value !== true
  //   ) {
  //     router.push({
  //       name: "LoginPage",
  //       query: { url: encodeURIComponent(route.fullPath) },
  //     });
  //     // TODO
  //     MessageBus.handle(new AccessPagePermissionCheckFail(), uow);
  //   }
  // });
};

// const useGetInfo = async (uow) => {
//   const message = new GetInfo();
//   await MessageBus.handle(message, uow);
// };

// const useGetFolders = async (uow) => {
//   const message = new GetFolders();
//   await MessageBus.handle(message, uow);
// };

// const useGetPermissions = async (uow) => {
//   const message = new GetPermissions();
//   await MessageBus.handle(message, uow);
// };

// const useGetRoles = async (uow) => {
//   const message = new GetRoles();
//   await MessageBus.handle(message, uow);
// };

// const useGetUserFolderSettings = async (uow) => {
//   const message = new GetUserFolderSettings();
//   await MessageBus.handle(message, uow);
// };

// const useGetUsers = async (uow) => {
//   const message = new GetUsers();
//   await MessageBus.handle(message, uow);
// };

// const useGetUserReplacements = async (uow) => {
//   const message = new GetUserReplacements();
//   await MessageBus.handle(message, uow);
// };

// const useGetOnBehalfUsers = async (uow) => {
//   const message = new GetOnBehalfUsers();
//   await MessageBus.handle(message, uow);
// };

// const useGetUserGroups = async (uow) => {
//   const message = new GetUserGroups();
//   await MessageBus.handle(message, uow);
// };

// const useGetUserSearchSchema = async (uow, folder_id, usergroup_id) => {
//   const message = new GetUserSearchSchema(folder_id, usergroup_id);
//   await MessageBus.handle(message, uow);
// };

// const useGetSpareFiles = async (uow, folder_id, usergroup_id) => {
//   const message = new GetSpareFiles(folder_id, usergroup_id);
//   await MessageBus.handle(message, uow);
// };

// const useGetFlowItem = async (uow, flowitem_id) => {
//   const message = new GetFlowItem(flowitem_id);
//   await MessageBus.handle(message, uow);
// };

// const useGetFlowItemSteps = async (uow, flowitem_id) => {
//   const message = new GetFlowItemSteps(flowitem_id);
//   await MessageBus.handle(message, uow);
// };

// const useGetDocument = async (uow, folder_id, usergroup_id, doc_id) => {
//   const message = new GetDocument(folder_id, usergroup_id, doc_id);
//   await MessageBus.handle(message, uow);
// };

// const useValidateDocument = async (uow, folder_id, usergroup_id, doc_id) => {
//   const message = new ValidateDocument(folder_id, usergroup_id, doc_id);
//   await MessageBus.handle(message, uow);
// };

// const useGetDocumentsWaitingApproval = async (uow) => {
//   await MessageBus.handle(new GetWaitingDocumentApprovals(), uow);
// };

// const useGetDocumentApprovalsWithSpareFiles = async (
//   uow,
//   folder_id,
//   usergroup_id,
//   doc_id
// ) => {
//   await Promise.all([
//     MessageBus.handle(
//       new GetDocumentApprovals(folder_id, usergroup_id, doc_id),
//       uow
//     ),

//     MessageBus.handle(
//       new GetDocumentApprovalSpareFiles(folder_id, usergroup_id, doc_id),
//       uow
//     ),
//   ]);
// };

// const useGetDocumentApprovalFlow = async (
//   uow,
//   folder_id,
//   usergroup_id,
//   doc_id
// ) => {
//   await MessageBus.handle(
//     new GetDocumentApprovalFlow(folder_id, usergroup_id, doc_id),
//     uow
//   );
// };

// const useGetCart = async (uow) => {
//   await MessageBus.handle(new GetCart(), uow);
// };

// const useGetServerSettings = async (uow) => {
//   await MessageBus.handle(new GetServerSettings(), uow);
// };

// const useGetMailBoxes = async (uow) => {
//   await MessageBus.handle(new GetMailBoxes(), uow);
// };

// const useGetMailChannels = async (uow) => {
//   await MessageBus.handle(new GetMailChannels(), uow);
// };

// const useGetCounters = async (uow) => {
//   await MessageBus.handle(new GetCounters(), uow);
// };

// // CONTEXT

// const useGetContext = async (uow, uid, settings, ...props) => {
//   const context_map = {
//     DOCUMENT_ATTRIBUTES: useGetDocumentAttributesContext,
//     PREVIOUS_DOCUMENTS_ATTRIBUTE: useGetDocumentPreviousContext,
//     USERS_EMAILS: useGetUserEmailContext,
//   };

//   uow.context_repository.reset(uid);
//   await Promise.all(
//     settings.map((e) => {
//       const func = context_map[e["type"]];
//       return func(uow, uid, e["name"], e["parameters"] || {}, ...props);
//     })
//   );
// };

// const useGetDocumentAttributesContext = (
//   uow,
//   ctx_id,
//   ctx_name,
//   parameters,
//   folder_id,
//   usergroup_id,
//   document_id
// ) => {
//   MessageBus.handle(
//     new GetDocumentAttributesContext(
//       ctx_id,
//       ctx_name,
//       folder_id,
//       document_id,
//       parameters["is_raw_attribute"]
//     ),
//     uow
//   );
// };

// const useGetDocumentPreviousContext = async (
//   uow,
//   ctx_id,
//   ctx_name,
//   parameters,
//   folder_id,
//   usergroup_id,
//   document_id
// ) => {
//   await MessageBus.handle(
//     new GetDocumentPreviousAttributeContext(
//       ctx_id,
//       ctx_name,
//       folder_id,
//       usergroup_id,
//       document_id,
//       parameters["attribute_name"],
//       parameters["is_raw_attribute"],
//       parameters["count"]
//     ),
//     uow
//   );
// };

// const useGetUserEmailContext = (uow, ctx_id, ctx_name) => {
//   MessageBus.handle(new GetUserEmailContext(ctx_id, ctx_name), uow);
// };

// const use404 = () => {
//   router.push({ name: "PageNotFound" });
// };

// const useValidateIntOr404 = (value) => {
//   const num = Number.parseInt(value, 10);
//   if (isNaN(num)) use404();
//   return num;
// };

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

// // promises: array of Promises - Массив промисов, которые необходимо выполнить
// // chunk_size: int - Кол-во Promise, выполняемых за один раз
// // progress: Ref(int) - Прогресс выполнения
// const usePromiseExecuteMixin = async (
//   promises,
//   chunk_size,
//   progress = null
// ) => {
//   if (progress !== null) progress.value = 0;
//   let promises_executed = 0;

//   let start = 0;

//   while (start < promises.length) {
//     await Promise.all(
//       promises.slice(start, start + chunk_size).map(async (f) => {
//         // console.log("PROMISE", f);
//         await f();
//         promises_executed++;
//         // console.log("EXECUTED:", promises_executed);

//         if (progress !== null)
//           progress.value = Math.round(
//             (promises_executed / promises.length) * 100
//           );
//       })
//     );

//     start += chunk_size;
//   }
// };

// // items: array of Object - Массив объектов, у которых есть свойство actions c действиями,
// //                          которые нужно выполнить
// // simultaneous_process_count: int - Количество одновременно выполняемых действий
// const usePerformActionMixin = (
//   items, // Ref
//   simultaneous_process_count
// ) => {
//   const action_progress = ref(100);

//   const perform_action_on_items = async (action_name) => {
//     const actions = items.value
//       .filter((item) => item.actions[action_name])
//       .map((item) => item.actions[action_name]);

//     await usePromiseExecuteMixin(
//       actions,
//       simultaneous_process_count,
//       action_progress
//     );
//   };

//   return {
//     action_progress,
//     perform_action_on_items,
//   };
// };

// // DECORATORS

// // uow: - Unit of Work
// // cmd: - Команда, которую нужно отправить в шину для выполнения асинхронно
// // in_progress: Ref(bool) - Команда находится в процессе выполнения
// // execution_time: Ref(Number) - Время выполнения команды
// const useExecutionTimeDecorator = async (
//   uow,
//   cmd,
//   execution_time,
//   in_progress = null
// ) => {
//   if (in_progress !== null) in_progress.value = true;

//   const t0 = performance.now();
//   await MessageBus.handle(cmd, uow);
//   execution_time.value = Math.round(performance.now() - t0) / 1000;

//   if (in_progress !== null) in_progress.value = false;
// };

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
  return date.toLocaleString("ru-RU");
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

// const shuffleArray = (array) => {
//   var m = array.length,
//     t,
//     i;

//   while (m) {
//     i = Math.floor(Math.random() * m--);

//     t = array[m];
//     array[m] = array[i];
//     array[i] = t;
//   }

//   return array;
// };

// const generate_states_obj_from_approvals = (approvals) => {
//   if (approvals.length === 0) return {};

//   let approval_by_id = {};
//   approvals.forEach((x) => {
//     approval_by_id[x.id] = x;
//   });

//   let approval_state_by_username = {};

//   // Делаем копию, чтобы сортировка не затрагивала массив,
//   // который был передан в функцию
//   const approvals_copy = approvals.map((x) => x);

//   approvals_copy
//     .sort((a, b) => a.updated_at - b.updated_at)
//     .map((approval) => {
//       const state = approval.state;
//       approval_state_by_username[approval.to_username] = state;

//       //  Заменяем статусы для делегирований без возврата
//       while (approval.delegated_from) {
//         approval = approval_by_id[approval.delegated_from];
//         approval_state_by_username[approval.to_username] = state;
//       }
//     });

//   return approval_state_by_username;
// };

// const validate_json = (text, schema_obj = null) => {
//   let obj = null;
//   try {
//     obj = JSON.parse(text);
//   } catch (e) {
//     return false;
//   }

//   if (schema_obj === null) return true;

//   const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
//   AjvErrors(ajv);

//   const validate = ajv.compile(schema_obj);
//   validate(obj);

//   if (validate.errors !== null) {
//     validate.errors.forEach((err) => console.log(err.message));
//     return false;
//   }

//   return true;
// };

export {
  deepObjectCopy,
  useBeforeEnterPage,
  // useGetInfo,
  // useGetFolders,
  // useGetPermissions,
  // useGetRoles,
  // useGetUserFolderSettings,
  // useGetUsers,
  // useGetUserReplacements,
  // useGetOnBehalfUsers,
  // useGetUserGroups,
  // useGetUserSearchSchema,
  // useGetSpareFiles,
  // useGetFlowItem,
  // useGetFlowItemSteps,
  // useGetDocument,
  // useValidateDocument,
  // useGetDocumentsWaitingApproval,
  // useGetDocumentApprovalsWithSpareFiles,
  // useGetDocumentApprovalFlow,
  // useGetCart,
  // useGetServerSettings,
  // useGetMailBoxes,
  // useGetMailChannels,
  // useGetCounters,
  // use404,
  // useValidateIntOr404,
  useDataEncode,
  useGetSortFunction,
  // // CONTEXT
  // useGetContext,
  // MIXINS
  useCurrentMixin,
  useSelectionMixin,
  usePaginationMixin,
  // usePromiseExecuteMixin,
  // usePerformActionMixin,
  // // DECORATORS
  // useExecutionTimeDecorator,
  // // FUNCTIONS
  convertObject,
  convertDateToDateString,
  convertDateToDateTimeString,
  convertDateToDateObject,
  // shuffleArray,
  // generate_states_obj_from_approvals,
  // // VALIDATION
  // validate_json,
  // FILTERS
  // filterArrayOfObjects,
  filterArrayOfObjectsByQuery,
};
