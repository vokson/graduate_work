import { VueBoxRepository } from "./box_repository";

const VueFileMixin = {
  reset(folder_id) {
    this.keys(folder_id).value.forEach((key) => this.delete(folder_id, key));
  },

  set_size(folder_id, file_id, size) {
    const obj = this._get_box(folder_id, file_id).value;
    if (obj) obj.set_size(size);
  },

  set_total_size(folder_id, file_id, size) {
    const obj = this._get_box(folder_id, file_id).value;
    if (obj) obj.set_total_size(size);
  },

  set_size_complete(folder_id, file_id) {
    const obj = this._get_box(folder_id, file_id).value;
    if (obj) obj.set_size_complete();
  },

  get_file(folder_id, file_id) {
    return this.get(folder_id, file_id).value;
  },

  get_name(folder_id, file_id) {
    const file = this.get(folder_id, file_id).value;
    return file.name;
  },
};

class VueFileBoxRepository extends VueBoxRepository {}
Object.assign(VueFileBoxRepository.prototype, VueFileMixin);

export { VueFileBoxRepository };
