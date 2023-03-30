<template>
  <div
    class="jsonfiledropzone"
    @drop.prevent="handleDrop($event)"
    @dragover.prevent
    @dragenter.prevent="is_dragging = true"
    @dragleave.prevent="is_dragging = false"
  >
    <slot></slot>
  </div>
</template>

<script>
import XLSX from "xlsx"; // SheetJS
import { watch, ref } from "vue";
import { UploadFileError } from "../../logic/domain/event";
import { VueUnitOfWork } from "../../logic/service_layer/uow";
import { MessageBus } from "../../logic/service_layer/message_bus";

const get_extension = (filename) => filename.split(".").pop();
const get_base_name = (filename) => filename.split(".")[0];

const default_json_parser = async (file) => {
  if (get_extension(file.name) !== "json") return null;
  return JSON.parse(await file.text());
};

const parser_1868_amm_transmittal = async (file) => {
  if (get_extension(file.name) !== "xlsx") return null;

  // Так как надписи внутри EXCEL невозможно прочитать
  // средствами JS, то имя трансмиттала берем из
  // наименования файла.
  const transmittal = get_base_name(file.name).trim();
  const last_modified_unix_timestamp = Math.round(file.lastModified / 1000);

  const workbook = XLSX.read(await file.arrayBuffer());

  let result_json_data = [];

  workbook.SheetNames.forEach((sheet_name) => {
    const ws = workbook.Sheets[sheet_name];
    const ws_json_data = XLSX.utils.sheet_to_json(ws, {
      header: [
        "CODE",
        "REVISION",
        "SHEET_NAME",
        "COUNT",
        "STATUS",
        "RESPONSE_CODE",
      ],
      raw: false,
    });

    console.log(ws_json_data);

    result_json_data = result_json_data.concat(
      ws_json_data
        .map((x) =>
          Object.assign({}, x, {
            TRANSMITTAL: transmittal,
            DATE: last_modified_unix_timestamp,
          })
        )
        .filter(
          (x) => x["CODE"] && !x["CODE"].toLowerCase().includes("документ")
        )
    );
  });

  return result_json_data;
};

const parser_1882_dlenc_transmittal = async (file) => {
  if (get_extension(file.name) !== "xlsx") return null;

  // Конвертируем дату в формате М/Д/ГГГГ в unix timestamp
  const parse_date = (str_date) => {
    console.log(str_date);
    if (!str_date) return 0;

    const parts = str_date.split("/");
    const year = parseInt(parts[2]);
    const month = parseInt(parts[1]) - 1; // Month counted from 0
    const day = parseInt(parts[0]);
    const mydate = new Date(year, month, day);
    return Math.round(mydate / 1000);
  };

  const workbook = XLSX.read(await file.arrayBuffer());
  const ws_trm = workbook.Sheets["transmittal"];
  const ws_list = workbook.Sheets["List"];
  const headers = [
    "ID",
    "CODE",
    "COL_1",
    "SHEET_NAME",
    "COL_2",
    "REVISION",
    "STATUS",
    "LANGUAGE",
  ];

  const ws_trm_json_data = XLSX.utils.sheet_to_json(ws_trm, {
    header: headers,
    raw: false,
  });

  const ws_list_json_data = XLSX.utils.sheet_to_json(ws_list, {
    header: headers,
    raw: false,
  });

  console.log(ws_trm_json_data);
  console.log(ws_list_json_data);

  let TRM = "????";
  let ISSUED_DATE = 0;
  let DUE_DATE = 0;

  // Получаем общие данные для трансмиттала
  const row_1 = ws_trm_json_data[1];
  TRM = row_1["COL_1"];
  ISSUED_DATE = parse_date(row_1["LANGUAGE"].trim());

  const row_2 = ws_trm_json_data[2];
  DUE_DATE = parse_date(row_2["LANGUAGE"].trim());

  console.log("TRM: ", TRM);
  console.log("ISSUED_DATE: ", ISSUED_DATE);
  console.log("DUE_DATE: ", DUE_DATE);

  const transform_row = (x) => {
    if (
      x["CODE"] ||
      x["SHEET_NAME"] ||
      x["REVISION"] ||
      x["STATUS"] ||
      x["LANGUAGE"]
    ) {
      let obj = Object.assign(
        {
          CODE: x["CODE"],
          SHEET_NAME: x["SHEET_NAME"],
          REVISION: x["REVISION"],
          STATUS: x["STATUS"],
          LANGUAGE: x["LANGUAGE"],
          KIND: "",
        },
        {
          TRANSMITTAL: TRM,
          DATE: ISSUED_DATE,
          DUE_DATE: DUE_DATE,
        }
      );

      return obj;
    } else return null;
  };

  // Данные каждой строки
  let result_json_data = [];
  result_json_data = result_json_data
    .concat(
      ws_trm_json_data
        .slice(4, 29)
        .map((x) => transform_row(x))
        .filter((x) => x !== null)
    )
    .concat(
      ws_list_json_data
        .slice(2)
        .map((x) => transform_row(x))
        .filter((x) => x !== null)
    )

  return result_json_data;
};
// const parser_1882_dlenc_transmittal = async (file) => {
//   if (get_extension(file.name) !== "xlsx") return null;

//   // Так как надписи внутри EXCEL невозможно прочитать
//   // средствами JS, то имя трансмиттала берем из
//   // наименования файла.
//   // const transmittal = get_base_name(file.name).trim();
//   // const last_modified_unix_timestamp = Math.round(file.lastModified / 1000);

//   // Конвертируем дату в формате М/Д/ГГ в unix timestamp
//   const parse_date = (str_date) => {
//     if (!str_date) return 0;

//     const parts = str_date.split("/");
//     const year = parseInt(parts[2]) + 2000;
//     const month = parseInt(parts[0]) - 1; // Month counted from 0
//     const day = parseInt(parts[1]);
//     const mydate = new Date(year, month, day);
//     return Math.round(mydate / 1000);
//   };

//   const workbook = XLSX.read(await file.arrayBuffer());
//   const ws = workbook.Sheets["TRM"];

//   let result_json_data = [];
//   const ws_json_data = XLSX.utils.sheet_to_json(ws, {
//     header: [
//       "ID",
//       "CODE",
//       "SHEET_NAME",
//       "CHANGE",
//       "REVISION",
//       "STATUS",
//       "SHEETS",
//       "LANGUAGE",
//       "KIND",
//     ],
//     raw: false,
//   });

//   console.log(ws_json_data);

//   let TRM = "????";
//   let ISSUED_DATE = 0;
//   let DUE_DATE = 0;

//   // Получаем общие данные для трансмиттала
//   ws_json_data.forEach((row) => {
//     if (
//       Object.prototype.hasOwnProperty.call(row, "ID") &&
//       Object.prototype.hasOwnProperty.call(row, "SHEET_NAME") &&
//       row["ID"].includes("TRM number")
//     )
//       TRM = row["SHEET_NAME"].trim();
//     if (
//       Object.prototype.hasOwnProperty.call(row, "ID") &&
//       Object.prototype.hasOwnProperty.call(row, "SHEET_NAME") &&
//       row["ID"].includes("TRM creation date")
//     )
//       ISSUED_DATE = parse_date(row["SHEET_NAME"].trim());
//     if (
//       Object.prototype.hasOwnProperty.call(row, "CHANGE") &&
//       Object.prototype.hasOwnProperty.call(row, "LANGUAGE") &&
//       row["CHANGE"].includes("Due date")
//     )
//       DUE_DATE = parse_date(row["LANGUAGE"].trim());
//   });

//   // Данные каждой строки
//   result_json_data = result_json_data.concat(
//     ws_json_data.slice(14).map((x) => {
//       let obj = Object.assign({}, x, {
//         TRANSMITTAL: TRM,
//         DATE: ISSUED_DATE,
//         DUE_DATE: DUE_DATE,
//       });

//       // if (DUE_DATE) obj['DUE_DATE'] = DUE_DATE

//       if (!Object.prototype.hasOwnProperty.call(obj, "KIND"))
//         obj["KIND"] = "DOC";
//       else if (obj["KIND"].includes("ACRS")) obj["KIND"] = "ACRS";
//       else if (obj["KIND"].includes("CRS")) obj["KIND"] = "CRS";

//       delete obj["ID"];
//       return obj;
//     })
//   );

//   return result_json_data;
// };

export default {
  name: "JsonFileDropZone",
  props: {
    default: {
      required: false,
      default: null,
    },

    // Массив наименование функций, каждая из которых пытается
    // обработать загруженный файл
    // Первой выполняется стандартная функция парсинга JSON файла
    parsers: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  emits: ["update:json", "update:dragging"],

  setup(props, { emit }) {
    const is_dragging = ref(false);
    const uow = new VueUnitOfWork();

    const allowed_parsers = {
      json_default: default_json_parser,
      "1868_amm_transmittal": parser_1868_amm_transmittal,
      "1882_dlenc_transmittal": parser_1882_dlenc_transmittal,
    };

    // Объединяем стандартный JSON парсер с дополнительными
    const drop_parsers = ["json_default"].concat(props.parsers);

    const handleDrop = async (e) => {
      is_dragging.value = false;
      await Array.prototype.forEach.call(e.dataTransfer.files, async (file) => {
        try {
          let result = null;

          for (const parser_name of drop_parsers) {
            if (result !== null) {
              continue;
            }
            if (
              !Object.prototype.hasOwnProperty.call(
                allowed_parsers,
                parser_name
              )
            ) {
              console.log("Отсутствует парсер", parser_name);
              continue;
            }
            const parser = allowed_parsers[parser_name];
            result = await parser(file);
          }

          if (result === null)
            throw "Ни один обработчик не смог обработать загруженный файл";

          emit("update:json", result);
        } catch (e) {
          console.log(e);
          const message = new UploadFileError(file.name);
          MessageBus.handle(message, uow);
          emit("update:json", props.default);
        }
      });
    };

    watch(is_dragging, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        emit("update:dragging", newValue);
      }
    });

    return { handleDrop, is_dragging };
  },
};
</script>
