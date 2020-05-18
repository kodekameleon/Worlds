
const namespaceUris = {
  svg: "http://www.w3.org/2000/svg",
  svgns: "http://www.w3.org/2000/svg"
};

export function getNamespaceUri(tag) {
  const colon = tag.indexOf(":");
  if (colon < 0) {
    return {};
  }
  const tagpart = tag.substr(colon + 1);
  const namespace = tag.substr(0, colon);
  const namespaceUri = namespace && namespaceUris[namespace];

  if (!namespaceUri) {
    throw `Invalid namespace tag ${namespace}`;
  }

  return {nsUri: namespaceUri, tag: tagpart};
}
