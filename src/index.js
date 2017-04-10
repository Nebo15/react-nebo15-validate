
import setFn from 'lodash/set';
import getFn from 'lodash/get';

import validations, { addValidation, removeValidation } from './validations';
import { ValidateArray } from './arrayOf';
import { ValidateCollection } from './collectionOf';

const validateValue = (value, validators, values, props = {}, allValues) =>
  Object.entries(validators).reduce((errors, [validatorName, validatorParams]) => {
    let realValidationParams = validatorParams;

    if (validatorParams instanceof Function) {
      realValidationParams = validatorParams(props, value, values, allValues);
    } else if (validatorParams && validatorParams.validate instanceof Function) {
      realValidationParams = validatorParams.validate(props, value, values, allValues);
    }

    if (!validate.validations[validatorName]) throw new Error(`undefined validation ${validatorName}`);
    if (!validate.validations[validatorName](value, realValidationParams, values, allValues, props)) { // eslint-disable-line
      return {
        ...(errors || {}),
        [validatorName]: validatorParams && validatorParams.format
          ? validatorParams.format(realValidationParams)
          : realValidationParams,
      };
    }

    return errors;
  }, null);

const validateCollection = (value = [], schema, options, allValues) =>
  value.map(item => validate(item, schema, options, allValues));

const validateArray = (value = [], schema, values) =>
  value.map(item => validateValue(item, schema, values));

const validate = (obj, schema, options = {}, allValues) => {
  const values = Object.assign({}, obj);
  let result = Object.entries(schema).reduce((errors, [path, validators]) => {
    const value = getFn(obj, path);
    let newError = errors;

    if (validators instanceof ValidateCollection) {
      const validations = validateCollection(
        value,
        validators.schema,
        options,
        allValues || values
      );

      if (validations && validations.length) {
        newError = Object.assign({}, validations.reduce((error, item, index) =>
            Object.entries(item).reduce((res, [subPath, error]) => ({
              ...res,
              [`${path}[${index}].${subPath}`]: error,
            }), error),
          errors
        ));
      }
    } else if (validators instanceof ValidateArray) {
      const validations = validateArray(value, validators.schema, values);
      if (validations) {
        newError = Object.assign({}, errors, validations.reduce((error, item, index) => ({
          ...error,
          [`${path}[${index}]`]: item,
        }), {}));
      }
    } else {
      const validation = validateValue(value, validators, values, options.props, allValues);
      if (validation) newError = { ...errors, [path]: validation };
    }

    return newError;
  }, {});

  if (typeof options.format === 'function') result = options.format(result);
  return result;
};

validate.validations = validations;

const validateFn = schema => (values, props) => {
  // FIXME: hotfix for redux form validation of Fields Array
  if (Array.isArray(values)) return undefined;
  return validate(values, schema, {
    format: errors => Object.entries(errors).reduce((prev, [path, value]) => {
      setFn(prev, path, value);
      return prev;
    }, {}),
    props,
  });
};

export arrayOf from './arrayOf';
export { validations, addValidation, removeValidation };
export collectionOf from './collectionOf';
export ErrorMessages, { ErrorMessage } from './ErrorMessages';
export default validateFn;
