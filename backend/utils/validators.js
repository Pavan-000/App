export function requireFields(obj, fields = []) {
  for (const f of fields) {
    if (!Object.prototype.hasOwnProperty.call(obj, f) || obj[f] === undefined || obj[f] === null || obj[f] === "") {
      return `Missing field: ${f}`;
    }
  }
  return null;
}
