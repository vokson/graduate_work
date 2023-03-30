import { inject, isRef, ref } from "vue";

class NotImplementedError extends Error {}

class AbstractBaseRepository {
  _deep_copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  _create_name(name) {
    const _name = Array.isArray(name) ? name.join() : name;
    return _name;
  }

  _set() {
    throw new NotImplementedError('"set" method has not been implemented');
  }

  _get() {
    throw new NotImplementedError('"get" method has not been implemented');
  }

  _delete() {
    throw new NotImplementedError('"delete" method has not been implemented');
  }

  _add_key() {
    throw new NotImplementedError('"add_key" method has not been implemented');
  }

  _remove_key() {
    throw new NotImplementedError(
      '"remove_key" method has not been implemented'
    );
  }

  _keys() {
    throw new NotImplementedError('"keys" method has not been implemented');
  }

  _values() {
    throw new NotImplementedError('"values" method has not been implemented');
  }

  _pure_keys() {
    throw new NotImplementedError(
      '"pure keys" method has not been implemented'
    );
  }

  _keys_box() {
    throw new NotImplementedError('"keys box" method has not been implemented');
  }

  _values_box() {
    throw new NotImplementedError(
      '"values box" method has not been implemented'
    );
  }

  _pure_keys_box() {
    throw new NotImplementedError(
      '"pure keys box" method has not been implemented'
    );
  }

  _set_box() {
    throw new NotImplementedError('"set_box" method has not been implemented');
  }

  _get_box() {
    throw new NotImplementedError('"get_box" method has not been implemented');
  }

  _delete_box() {
    throw new NotImplementedError(
      '"delete_box" method has not been implemented'
    );
  }

  _add_box_key() {
    throw new NotImplementedError(
      '"add_box_key" method has not been implemented'
    );
  }

  _remove_box_key() {
    throw new NotImplementedError(
      '"remove_box_key" method has not been implemented'
    );
  }
}

class VueBaseRepository extends AbstractBaseRepository {
  constructor(name) {
    super();
    this._properties = inject(name);
  }

  _reset() {
    Object.keys(this._properties).forEach((key) => {
      delete this._properties[key];
    });
  }

  _set(name, value, add_key = true) {
    const _name = name.toString();
    if (!Object.prototype.hasOwnProperty.call(this._properties, _name)) {
      this._properties[_name] = ref(value);
    } else {
      this._properties[_name].value = value;
    }
    if (add_key) this._add_key(_name);
  }

  _get(name, empty = null) {
    if (!Object.prototype.hasOwnProperty.call(this._properties, name)) {
      this._set(name, this._deep_copy(empty), false);
    }
    return this._properties[name];
  }

  _delete(name) {
    const _name = name.toString();
    this._set(_name, null);
    this._remove_key(_name);
  }

  _add_key(name) {
    if (!Object.prototype.hasOwnProperty.call(this._properties, "__KEYS__")) {
      this._properties["__KEYS__"] = ref([]);
    }

    const keys = this._get("__KEYS__");
    if (keys.value.indexOf(name) === -1) {
      keys.value.push(name);
    }
  }

  _remove_key(name) {
    if (!Object.prototype.hasOwnProperty.call(this._properties, "__KEYS__"))
      return;

    this._properties["__KEYS__"].value = this._properties[
      "__KEYS__"
    ].value.filter((e) => e !== name);
  }

  _keys() {
    return this._get("__KEYS__", []);
  }

  _pure_keys() {
    const keys = this._keys();
    return isRef(keys) ? keys.value : keys;
  }

  _values() {
    return this._keys().value.map((key) => this._get(key));
  }

  _keys_box(box_id) {
    const _name = this._create_name(["BOX", box_id, "__KEYS__"]);
    return this._get(_name, []);
  }

  _pure_keys_box(box_id) {
    const keys = this._keys_box(box_id);
    return isRef(keys) ? keys.value : keys;
  }

  _values_box(box_id) {
    return this._keys_box(box_id).value.map((key) =>
      this._get_box(box_id, key)
    );
  }

  _set_box(box_id, name, value) {
    const _name = this._create_name(["BOX", box_id, name]);
    this._set(_name, value, false);
    this._add_box_key(box_id, name.toString());
  }

  _get_box(box_id, name, empty = null) {
    const _name = this._create_name(["BOX", box_id, name]);
    return this._get(_name, empty);
  }

  _delete_box(box_id, name) {
    const _name = this._create_name(["BOX", box_id, name]);
    this._delete(_name);
    this._remove_box_key(box_id, name.toString());
  }

  _add_box_key(box_id, name) {
    const _keys_name = this._create_name(["BOX", box_id, "__KEYS__"]);
    if (!Object.prototype.hasOwnProperty.call(this._properties, _keys_name)) {
      this._properties[_keys_name] = ref([]);
    }

    const keys = this._get(_keys_name);
    if (keys.value.indexOf(name) === -1) {
      keys.value.push(name);
    }
  }

  _remove_box_key(box_id, name) {
    const _keys_name = this._create_name(["BOX", box_id, "__KEYS__"]);
    if (!Object.prototype.hasOwnProperty.call(this._properties, _keys_name))
      return;

    this._properties[_keys_name].value = this._properties[
      _keys_name
    ].value.filter((e) => e !== name);
  }
}

export { VueBaseRepository };
