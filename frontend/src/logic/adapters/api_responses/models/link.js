import { Single as FileSingle } from "./file";

const Single = {

  type: "object",
  properties: {
    file: FileSingle,
    link: {
      type: "string",
    },
  },
  required: [
    "file", "link",
  ],
  additionalProperties: false,
};


export { Single };
