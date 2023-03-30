import { VueBaseRepository } from "./base_repository";

const PermissionMixin = {
  add(name) {
    this._set(name, true);
  },

  add_for_folder(folder_id, name) {
    this._set_box(folder_id, name, true);
  },

  remove_for_folder(folder_id, name) {
    this._set_box(folder_id, name, false);
  },

  reset() {
    this._pure_keys().forEach((key) => {
      this._set(key, false);
    });
  },

  reset_for_folder(folder_id) {
    this._pure_keys_box(folder_id).forEach((key) => {
      this._set_box(folder_id, key, false);
    });
  },

  has(name) {
    return this._get(name);
  },

  has_for_folder(folder_id, name) {
    return this._get_box(folder_id, name);
  },
};


class VuePermissionRepository extends VueBaseRepository {
  constructor() {
    super("permissions");
  }
}
Object.assign(
  VuePermissionRepository.prototype,
  PermissionMixin,
);

export { VuePermissionRepository };
