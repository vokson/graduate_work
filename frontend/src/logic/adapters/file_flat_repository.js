import { VueFlatRepository } from "./flat_repository";

const VueFileMixin = {
  reset() {
    this.keys().value.forEach((key) => this.delete(key));
  },

  set_size(file_id, size) {
    const obj = this.get(file_id).value;
    if (obj) obj.set_size(size);
  },

  set_total_size(file_id, size) {
    const obj = this.get(file_id).value;
    if (obj) obj.set_total_size(size);
  },

  set_size_complete(file_id) {
    const obj = this.get(file_id).value;
    if (obj) obj.set_size_complete();
  },

  get_file(file_id) {
    return this.get(file_id).value;
  },

  get_name(file_id) {
    const file = this.get(file_id).value;
    return file.name;
  },

  set_servers(file_id, servers) {
    const obj = this.get(file_id).value;
    if (obj) obj.servers = servers;
  },
};

class VueFileFlatRepository extends VueFlatRepository {}
Object.assign(VueFileFlatRepository.prototype, VueFileMixin);

export { VueFileFlatRepository };
