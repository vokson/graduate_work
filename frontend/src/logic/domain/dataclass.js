import Ajv from "ajv";
import AjvErrors from "ajv-errors";

class NotImplementedError extends Error {}

class DataClass {
  constructor(obj) {
    this._data = undefined;

    // Если объекта нет, то не валидируем
    if (obj === undefined) return;

    this._validate_using_schema(obj, this.schema);
  }

  get data() {
    if (this._data === undefined) {
      throw new NotImplementedError("DataClass.data has not been assigned");
    }

    return this._data;
  }

  get schema() {
    throw new NotImplementedError("Json schema is not defined");
  }

  _validate_using_schema(obj, schema) {
    this.ajv = new Ajv({ allErrors: true, allowUnionTypes: true});
    AjvErrors(this.ajv);

    const validate = this.ajv.compile(schema); // Ref
    validate(obj);
    // console.log(schema)
    // console.log(obj)

    if (validate.errors !== null) {
      validate.errors.forEach((err) => console.log(err));
      throw new NotImplementedError(
        "Object " + obj.constructor.name + " does not correspond to json schema"
      );
    }

    this._data = obj;
  }

}

export { DataClass };
