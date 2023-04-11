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
    zone: {
      type: "string"
    },
    latitude: {
      type: "number",
    },
    longitude: {
      type: "number",
    },
    is_on: {
      type: "boolean",
    },
    is_ready: {
      type: "boolean",
    },
    created: {
      type: "string",
    },
    updated: {
      type: "string",
    },
  },
  required: [
    "id",
    "name",
    "location",
    "zone",
    "latitude",
    "longitude",
    "is_on",
    "is_ready",
    "created",
    "updated",
  ],
  additionalProperties: false,
};

const List = {
  type: "array",
  items: Single,
};

export { Single, List };
