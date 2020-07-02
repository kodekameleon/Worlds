import {Services} from "./services";

export class CharacterService {
  static getClasses() {
    return fetch(Services.getServiceUri("character", "classes"), {})
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
