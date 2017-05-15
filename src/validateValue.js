import { getValidation } from './validations';

export default (value, validators, values, props = {}, allValues) =>
  Object.entries(validators).reduce((errors, [validatorName, validatorParams]) => {
    const validator = getValidation(validatorName);
    let newErrors = (errors || {}).errors;
    let newParams = (errors || {}).params;

    if (!validator) throw new Error(`undefined validation ${validatorName}`);

    let realValidationParams = validatorParams;
    if (validatorParams instanceof Function) {
      realValidationParams = validatorParams(props, value, values, allValues);
    } else if (validatorParams && validatorParams.validate instanceof Function) {
      realValidationParams = validatorParams.validate(props, value, values, allValues);
    }

    if (!validator(value, realValidationParams, values, allValues, props)) { // eslint-disable-line
      newErrors = {
        ...(newErrors || {}),
        [validatorName]: validatorParams && validatorParams.format
          ? validatorParams.format(realValidationParams)
          : realValidationParams,
      };
      newParams = {
        ...(newParams || {}),
        [validatorName]: realValidationParams,
      };
    }

    return (newParams || newErrors) ? {
      errors: newErrors || {},
      params: newParams || {},
    } : null;
  }, null);
