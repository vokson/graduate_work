import { VueFlatRepository } from "./flat_repository";
import { CountMixin } from "./mixins/count";


class VueCountableFlatRepository extends VueFlatRepository {}
Object.assign(VueFlatRepository.prototype, CountMixin);

export { VueCountableFlatRepository };
