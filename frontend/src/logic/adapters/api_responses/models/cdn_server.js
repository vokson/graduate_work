const Single = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string",
    },
    host: {
      type: "string",
    },
    port: {
      type: "integer",
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
    is_active: {
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
    "host",
    "port",
    "location",
    "zone",
    "latitude",
    "longitude",
    "is_on",
    "is_active",
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
