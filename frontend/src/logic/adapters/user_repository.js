import { VueFlatRepository } from "./flat_repository";
import { CurrentMixin } from "./mixins/current";

const AuthenticatedMixin = {
  is_authenticated() {
    return this.is_current_settled();
  },
};


class VueUserRepository extends VueFlatRepository {}
Object.assign(
  VueUserRepository.prototype,
  CurrentMixin,
  AuthenticatedMixin,
);

export { VueUserRepository };
