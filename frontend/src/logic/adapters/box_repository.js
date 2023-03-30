import { VueBaseRepository } from "./base_repository";

const BoxMixin = {
  reset() {
    this._reset();
  },

  reset_keeping_refs(box_id) {
    this.keys(box_id).value.forEach((key) => this.delete(box_id, key));
  },

  keys(box_id) {
    return this._keys_box(box_id);
  },

  pure_keys(box_id) {
    return this._pure_keys_box(box_id);
  },

  values(box_id) {
    return this._values_box(box_id);
  },

  set(box_id, name, value) {
    this._set_box(box_id, name, value);
  },

  get(box_id, name, empty = null) {
    return this._get_box(box_id, name, empty);
  },

  delete(box_id, name) {
    this._delete_box(box_id, name);
  },
};

class VueBoxRepository extends VueBaseRepository {}
Object.assign(VueBoxRepository.prototype, BoxMixin);

export { VueBoxRepository };
