const Single = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    event: {
      type: "string",
    },
    data: {
      type: "object",
    },
    created: {
      type: "string",
    },
  },
  required: ["id", "event", "data", "created"],
  additionalProperties: false,
};

const List = {
  type: "array",
  items: Single,
};

export { Single, List };