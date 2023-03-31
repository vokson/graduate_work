const Single = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string",
    },
    location: {
      type: "string"
    },
    latitude: {
      type: "number",
    },
    longitude: {
      type: "number",
    },
  },
  required: [
    "id",
    "name",
    "location",
    "latitude",
    "longitude",
  ],
  additionalProperties: false,
};

const List = {
  type: "array",
  items: Single,
};

export { Single, List };
