const User = {
  type: "object",
  properties: {
    username: {
      type: "string",
    },
    email: {
      type: "string"
    },
    first_name: {
      type: "string",
    },
    last_name: {
      type: "string",
    },
    is_superuser: {
      type: "boolean",
    },
    permissions: {
      type: "array",
      items: { type: "string" }
    },
  },
  required: [
    "username",
    "email",
    "first_name",
    "last_name",
    "is_superuser",
    "permissions",
  ],
  additionalProperties: false,
};


export { User };
