import { HttpApi } from "./api_http";

class NotImplementedError extends Error {}

class AbstractApiProvider {
  get = () => {
    throw new NotImplementedError();
  };
}

class HttpApiProvider extends AbstractApiProvider {
  get = () => {
    return new HttpApi(
      process.env.NODE_ENV === "production"
        ? window.location.origin + "/api/v1"
        : "http://10.95.27.163:8000/api/v1"
    );
  };
}

export { HttpApiProvider };
