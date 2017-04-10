
class ValidateArray {
  constructor(schema) {
    this.schema = schema;
  }
}

export { ValidateArray };
export default validations => new ValidateArray(validations);
