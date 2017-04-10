
class ValidateArray {
  constructor(schema) {
    this.schema = schema;
  }
}

export { ValidateArray };
export default schema => new ValidateArray(schema);
