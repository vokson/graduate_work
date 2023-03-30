const Single = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string",
    },
    size: {
      type: "number",
    },
  },
  required: ["id", "name", "size"],
  additionalProperties: false,
};

const List = {
  type: "array",
  items: Single,
};

export { Single, List };