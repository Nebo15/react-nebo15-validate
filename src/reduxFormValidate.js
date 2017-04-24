import setFn from 'lodash/set';
import getFn from 'lodash/get';
import validate from './validate';

export default (schema, { includeRequired = false } = {}) => (values, props) => {
  // FIXME: hotfix for redux form validation of Fields Array
  if (Array.isArray(values)) return undefined;
  return validate(values, schema, {
    props,
    format: errors => Object.entries(errors).reduce((prev, [path, errors]) => {
      const pathSchema = getFn(schema, path);
      const value = getFn(values, path);
      if (includeRequired === false && pathSchema.required !== true && (value === '' || typeof value === 'undefined' || value === null)) {
        return prev;
      }
      setFn(prev, path, errors);
      return prev;
    }, {}),
  });
};
