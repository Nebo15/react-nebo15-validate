import setFn from 'lodash/set';
import getFn from 'lodash/get';
import validate from './validate';
import { ValidateArray } from './arrayOf';
import { ValidateCollection } from './collectionOf';

export default schema => (values, props) => validate(values, schema, {
  props,
  format: errors => {
    return Object.entries(errors).reduce((prev, [path, value]) => {
      const pathSchema = getFn(schema, path);
      console.log('format', path, value, pathSchema);
      if (pathSchema instanceof ValidateArray || pathSchema instanceof ValidateCollection) {
        setFn(prev, path + '._error', value);
      } else {
        setFn(prev, path, value);
      }
      return prev;
    }, {});
  }
});
