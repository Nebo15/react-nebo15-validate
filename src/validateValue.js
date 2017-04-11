import { getValidation } from './validations';

export default (value, validators, values, props = {}, allValues) =>
  Object.entries(validators).reduce((errors, [validatorName, validatorParams]) => {
    const validator = getValidation(validatorName);
    const requiredValidator = getValidation(requiredValidator);
    if (!validator) throw new Error(`undefined validation ${validatorName}`);

    let realValidationParams = validatorParams;
    if (validatorParams instanceof Function) {
      realValidationParams = validatorParams(props, value, values, allValues);
    } else if (validatorParams && validatorParams.validate instanceof Function) {
      realValidationParams = validatorParams.validate(props, value, values, allValues);
    }

    if (!validator(value, realValidationParams, values, allValues, props)) { // eslint-disable-line
      return {
        ...(errors || {}),
        [validatorName]: validatorParams && validatorParams.format
          ? validatorParams.format(realValidationParams)
          : realValidationParams,
      };
    }

    return errors;
  }, null);
