import { Single as FileSingle } from "./file";

const Single = {

  type: "object",
  properties: {
    id: { type: "string" },
    file: FileSingle,
    is_secured: { type: "boolean" },
    created: {
      type: "string",
    },
    expire_at: {
      type: "string",
    }
  },
  required: [
    "id", "file", "is_secured", "expire_at", "created"
  ],
  additionalProperties: false,
};


export { Single };
