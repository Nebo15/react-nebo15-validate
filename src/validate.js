import getFn from 'lodash/get';
import validateValue from './validateValue';
import { ValidateArray } from './arrayOf';
import { ValidateCollection } from './collectionOf';

const validateCollection = (value = [], schema, options, allValues) =>
  value.map(item => validate(item, schema, options, allValues));

const validateArray = (value = [], schema, values) =>
  value.map(item => validateValue(item, schema, values));

export default function validate(obj, schema, options = {}, allValues) {
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
        newError = Object.assign({}, errors, validations.reduce((error, item, index) => (item ? ({
          ...error,
          [`${path}[${index}]`]: item,
        }) : error), {}));
      }
    } else {
      const validation = validateValue(value, validators, values, options.props, allValues);
      if (validation) newError = { ...errors, [path]: validation };
    }

    return newError;
  }, {});

  if (typeof options.format === 'function') result = options.format(result);
  return result;
}
