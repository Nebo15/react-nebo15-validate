# React Nebo15 Validate

[![Build Status](https://travis-ci.org/Nebo15/react-nebo15-validate.svg?branch=master)](https://travis-ci.org/Nebo15/react-nebo15-validate)

Validation module for React JS application.

### Installation

```
npm install react-nebo15-validate --save
```

### Usage

```
import React from 'react';
import validate from 'react-nebo15-validate';

const validationSchema = {
  first_name: {
    required: true,
    minLength: 4,
  },
  last_name: {
    require: true,
    minLength: 4,
  },
  second_name: {
    minLength: 2,
  },
  birthDate: {
    required: true,
    minDate: new Date(1930, 2, 12),
    maxDate: new Date(),
  },
};

const data = {
  first_name: 'John',
  last_name: '',
  birthDate: new Date(1920, 3, 24),
};

const result = validate(data, schema);

```

#### React Components

```
import React from 'react';
import { reduxFormValidate, ErrorMessages, ErrorMessage } from 'react-nebo15-validate';
import { reduxForm, Field } from 'redux-form';

class Input extends React.Component {
  render() {
    const { input, meta, label, ...rest } = this.props;
    return (
      <label>
        <span>{ label }</span>
        <br/>
        <input type="text" {...input} {...rest} />
        <br>
        <span>
          <ErrorMessages error={meta.error}>
            <ErrorMessage when="required">Custom required message</ErrorMessage>
          </ErrorMessages>
        </span>
      </label>
    );
  }
}

@reduxForm({
  form: 'profile',
  validate: reduxValidation({
    first_name: {
      required: true,
      minLength: 4,
    },
    last_name: {
      required: true,
      minLength: 4,
    },
    birth_date: {
      required: true
      maxDate: new Date(),
    },
  });
})
export default class ProfileForm extends React.Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field render={Input} name="first_name" label="First name" />
        <Field render={Input} name="last_name" label="Last name" />
        <Field render={Input} name="birth_date" type="date" label="Birth date" />
        <br/>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

```

### Validators

- array - value is array
- object - value is object
- integer - value is integer
- float - value is float number
- numeric - value is number
- boolean - value is boolean
- string - value is string
- required - value is required
- ipv4 - value is valid IPV4
- cardType - card provider (support visa, mastercard, accept array of types)
- greaterThan -  value > param
- min - value >= param
- max - value <= param
- equals - value === param
- length - value length equals param
- minLength - value length greater or equal than param
- maxLength - value length less or equal than param
- minDate - value is after or the same as param
- maxDate - value is before or the same as param
- format - value should match regular expression in param
- cast - value has type in param (av. array, map, object, integer, float, boolean, string)
- inclusion - value is in array in param
- exclusion - value is not one of value in array in param
- subset - value is an array and it is a subset of array in param
- number - value is a number and it is more than `param.min` and less than `param.max`
- confirmation - value is equal the value by path in param. (eg. `passwordConfirmation: { confirmation: 'password' }`)
- acceptance - value is true
- email - value is a valid email
- phone_number - value is a valid phone number
- card_number - value is a valid card number
- unique - value is an array ant it has only unique values
- dependency - expect existing value by path in param
- alphanumeric - value is an alphanumeric string
- metadata - description http://docs.apimanifest.apiary.io/#introduction/interacting-with-api/errors
- json - value is a valid json object
