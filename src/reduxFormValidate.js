import setFn from 'lodash/set';
import getFn from 'lodash/get';
import validate from './validate';


export default (schema, { includeRequired = false } = {}) => (values, props) => {
  // FIXME: hotfix for redux form validation of Fields Array
  if (Array.isArray(values)) return undefined;
  const errors = validate(values, schema, { props });

  return Object.entries(errors).reduce((prev, [path, errorObj]) => {
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
  }, {});
};
