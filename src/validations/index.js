import getFn from 'lodash/get';
import validateCardNumber from './cardNumber';

const PATTERNS_EMAIL = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i; // eslint-disable-line
const PATTERNS_PHONE_NUMBER = /^\+[0-9]{9,16}$/;
const PATTERNS_IPV4 = /^[\d]{3}\.[\d]{1,3}\.[\d]{1,3}\.([\d]{1,3}|\*)$/;
const CARD_TYPES = {
  mastercard: /^5[1-5]|^2[2-7]/,
  visa: /^4/,
};

const defaultValidators = {
  array: value => Array.isArray(value),
  object: value => value !== null && typeof value === 'object',
  integer: value => Number(value) === value && value % 1 === 0,
  float: value => Number(value) === value && value % 1 !== 0,
  numeric: value => !isNaN(Number(value)),
  boolean: value => typeof value === 'boolean',
  string: value => typeof value === 'string',
  oneOf: value => Array.isArray(value) && value.length !== 0,
  minOfArray: (value, params, values, all) => all[params.array]
    .reduce((target, item) => (target + item[params.prop]), 0) >= params.min,

  required: value => !!value,
  ipv4: function ipv4Validation(value) {
    return this.format(value, PATTERNS_IPV4);
  },
  userName: value => (
    (/^[А-яA-z\-\sІіїЇЁёЪъ]+$/).test(value) &&
    value.replace(/[^\s]+/g, '').length <= 1
  ),
  cardType: (value, param) => param.some(name => CARD_TYPES[name.toLowerCase()].test(value)),
  greaterThan: (value, param) => value > param,
  min: (value, param) => value >= param,
  max: (value, param) => value <= param,
  equals: (value, param) => value === param,
  length: (value, param) => String(value).length === param,
  minLength: (value, param) => String(value).length >= param,
  maxLength: (value, param) => String(value).length <= param,
  minDate: (value, param) => value.getTime() >= param.getTime(),
  maxDate: (value, param) => value.getTime() <= param.getTime(),
  format: (value, pattern) => pattern.test(value),
  cast: function castValidation(value, type) {
    if (this.array(type)) return type.each(i => this.cast(value, i));
    switch (type) {
      case 'array': return this.array(value);
      case 'map':
      case 'object':
        return this.object(value);
      case 'integer': return this.integer(value);
      case 'float': return this.float(value);
      case 'boolean': return this.boolean(value);
      case 'string': return this.string(value);
      default: {
        throw new Error(`unknown cast type: ${type}`);
      }
    }
  },
  inclusion: (value, set) => set.indexOf(value) > -1,
  exclusion: (value, set) => set.indexOf(value) === -1,
  uniqueCardName: (value, name, all, a, props) => {
    let names = props.names;

    if (props.initialValues.cardName) {
      names = props.names.filter(name => name !== props.initialValues.cardName);
    }

    return names.indexOf(value) === -1;
  },
  uniqueCardNumber: (value, name, all, a, props) => {
    let cards = props.cards;

    if (props.initialValues.cardNumber) {
      cards = props.cards.filter(num => num !== props.initialValues.cardNumber);
    }

    return cards.indexOf(value) === -1;
  },
  subset: function subsetValidation(valueSet, set) {
    return valueSet.each(i => this.inclusion(i, set));
  },
  number: (value, { min, max }) => value >= min && value <= max,
  confirmation: (value, path, allValues) => value === getFn(allValues, path),
  acceptance: value => value === true,
  email: function emailValidation(value) {
    return this.format(value, PATTERNS_EMAIL);
  },
  phone_number: function phoneNumberValidation(value, pattern) {
    return this.format(value, pattern instanceof RegExp ? pattern : PATTERNS_PHONE_NUMBER);
  },
  card_number: value => validateCardNumber(value),
  unique: value => value.some((i, index) => value.indexOf(i) !== index),
  dependency: function dependencyValidation(value, param, allValues) {
    return this.required(getFn(allValues, param));
  },
  alphanumeric: value => /^[a-zA-Z0-9]+$/.test(value),
  metadata: function metadataValidation(value) {
    if (this.cast(value, 'array')) {
      return value.length <= 25 && value.each(i => String(i).length <= 100);
    }
    const keys = Object.keys(value);
    const values = Object.values(value);
    const pattern = /^[a-zA-Z0-9-_]+$/;
    return keys.length <= 24 &&
      keys.each(i => String(i).length <= 100 && pattern.test(i)) &&
      values.each(i => String(i).length <= 500 && this.cast(i, ['integer, float', 'array', 'boolean']));
  },
  password: function passowrdValidation(value) {
    return this.format(value, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/);
  },
  json: (value) => {
    if (typeof value === 'object') return true;
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  },
};

const userValidations = {};

export const addValidation = (name, fn) => { userValidations[name] = fn; };
export const removeValidation = (name) => { delete userValidations[name]; };

export default Object.assign(defaultValidators, userValidations);
