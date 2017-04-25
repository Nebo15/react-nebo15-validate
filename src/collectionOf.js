
class ValidateCollection {
  constructor(schema, options = {}) {
    this.schema = schema;
    this.options = options;
  }
}

export { ValidateCollection };
export default (schema, options) => new ValidateCollection(schema, options);
