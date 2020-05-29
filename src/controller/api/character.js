import {SERVICE_PATHS} from "./services";

export class CharacterService {
  static getClasses() {
    return fetch(SERVICE_PATHS.character + "v1/classes", {})
      .then((response) => {
        if (!response.ok) {
          throw response.status;
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw "Invalid content-type response from server, expected application/json"; // TODO: Sort out errors to throw
        }
        return response.json().then((json) => {
          json.response = response;
          return json;
        });
      });
  }
}
