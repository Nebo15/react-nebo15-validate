import setFn from 'lodash/set';
import getFn from 'lodash/get';
import validate from './validate';
import { ValidateArray } from './arrayOf';
import { ValidateCollection } from './collectionOf';


export default (schema, { includeRequired = false } = {}) => (values, props) => {
  // FIXME: hotfix for redux form validation of Fields Array
  if (Array.isArray(values)) return undefined;
  return validate(values, schema, {
    props,
    format: errors => Object.entries(errors).reduce((prev, [path, errorObj]) => {
      const pathSchema = errorObj.schema;
      const value = getFn(values, path);

      if (includeRequired === false && pathSchema.required !== true && (value === '' || typeof value === 'undefined' || value === null)) {
        return prev;
      }
      if (errorObj.isArray) {
        setFn(prev, `${path}._error`, errorObj.error);
      } else {
        setFn(prev, path, errorObj.error);
      }
      return prev;
    }, {})
  });
};
