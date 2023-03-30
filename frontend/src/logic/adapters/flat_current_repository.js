import { VueFlatRepository } from "./flat_repository";
import { CurrentMixin } from "./mixins/current";

class VueFlatCurrentRepository extends VueFlatRepository {}
Object.assign(
  VueFlatCurrentRepository.prototype,
  CurrentMixin,
);

export { VueFlatCurrentRepository };
