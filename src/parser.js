export default (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data.data, 'application/xml');
};
