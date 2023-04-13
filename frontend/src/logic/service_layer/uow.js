import { VueFlatRepository } from "../adapters/flat_repository";
import { VueUserRepository } from "../adapters/user_repository";
import { VueTokenRepository } from "../adapters/token_repository";
import { VueFileFlatRepository } from "../adapters/file_flat_repository";
import { HttpApiProvider } from "../adapters/api_provider";
import { NotyNotificator } from "../adapters/notificator";
import { AbstractTimer } from "../adapters/timer";
import { VueCountableFlatRepository } from "../adapters/countable_flat_repository";

const token_timer = new AbstractTimer(5000);
const get_files_timer = new AbstractTimer(5000);

class AbstractUnitOfWork {
  constructor() {
    this.messages = [];
  }

  collect_new_messages = () => {
    const messages = [...this.messages];
    this.messages = [];

    return messages;
  };

  push_message = (message) => {
    this.messages.push(message);
  };
}

class VueUnitOfWork extends AbstractUnitOfWork {
  constructor() {
    super();
    this.api = new HttpApiProvider().get();
    this.notificator = new NotyNotificator();
    this.token_timer = token_timer
    this.get_files_timer = get_files_timer

    this.user_repository = new VueUserRepository("users");
    this.action_repository = new VueCountableFlatRepository("user_actions");
    this.action_repository.set_count(0)
    this.cdn_server_repository = new VueFlatRepository("cdn_servers");
    this.token_repository = new VueTokenRepository("tokens")
    this.link_repository = new VueFlatRepository("file_share_links")

    this.file_repository = new VueFileFlatRepository("files");
    this.download_progress = new VueFileFlatRepository("download_progress");

    this.api.set_auth_token(this.token_repository.get_access_token());
  }
}

export { VueUnitOfWork };
