
export class Services {
  static getServiceUri(service, resource) {
    return `${window.location.protocol}//${service}.api.${window.location.host}/v1/${resource}`;
  }
}
