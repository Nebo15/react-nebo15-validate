import setFn from 'lodash/set';
import validate from './validate';

export default schema => (values, props) => {
  // FIXME: hotfix for redux form validation of Fields Array
  if (Array.isArray(values)) return undefined;
  return validate(values, schema, {
    props,
    format: errors => Object.entries(errors).reduce((prev, [path, value]) => {
      setFn(prev, path, value);
      return prev;
    }, {}),
  });
};
