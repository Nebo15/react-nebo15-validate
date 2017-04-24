
class ValidateArray {
  constructor(schema, options) {
    this.schema = schema;
    this.options = options;
  }
}

export { ValidateArray };
export default (schema, options) => new ValidateArray(schema, options);
