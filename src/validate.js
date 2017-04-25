import getFn from 'lodash/get';
import validateValue from './validateValue';
import { ValidateArray } from './arrayOf';
import { ValidateCollection } from './collectionOf';

const validateCollection = (value, schema, options, allValues) =>
  (value || []).map(item => validate(item, schema, options, allValues));

const validateArray = (value, schema, values) =>
  (value || []).map(item => validateValue(item, schema, values));

export default function validate(obj, schema, options = {}, allValues) {
  const values = Object.assign({}, obj);
  let result = Object.entries(schema).reduce((errors, [path, validators]) => {
    const value = getFn(obj, path);
    let newError = errors;

    if (validators instanceof ValidateCollection) {
      const itemsValidation = validateCollection(
        value,
        validators.schema,
        options,
        allValues || values
      );

      const objectValidation = validateValue(
        value,
        validators.options,
        allValues || values
      );

      if (itemsValidation && itemsValidation.length) {
        newError = Object.assign({}, itemsValidation.reduce((error, item, index) =>
            Object.entries(item).reduce((res, [subPath, error]) => ({
              ...res,
              [`${path}[${index}].${subPath}`]: error,
            }), error),
          errors
        ));
      }

      if (objectValidation && Object.values(objectValidation).length > 0) {
        newError = {
          ...newError,
          [path]: objectValidation,
        };
      }
    } else if (validators instanceof ValidateArray) {
      const itemsValidation = validateArray(value, validators.schema, values);
      const objectValidation = validateValue(
        value,
        validators.options,
        allValues || values
      );
      if (itemsValidation) {
        newError = Object.assign({}, errors, itemsValidation.reduce((error, item, index) =>
          (item ? ({
            ...error,
            [`${path}[${index}]`]: item,
          }) : error), {}));
      }
      if (objectValidation && Object.values(objectValidation).length > 0) {
        newError = {
          ...newError,
          [path]: objectValidation,
        };
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
