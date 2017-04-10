
class ValidateCollection {
  constructor(schema, options = {}) {
    this.schema = schema;
    this.options = {
      required: false,
      ...options,
    };
  }
}

export { ValidateCollection };
export default (validations, options) => new ValidateCollection(validations, options);
