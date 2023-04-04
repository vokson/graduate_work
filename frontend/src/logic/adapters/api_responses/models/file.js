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
    created: {
      type: "string",
    },
    updated: {
      type: "string",
    }
  },
  required: ["id", "name", "size", "created", "updated"],
  additionalProperties: false,
};

const List = {
  type: "array",
  items: Single,
};

export { Single, List };