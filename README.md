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
import { validate } from 'react-nebo15-validate';

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

### Validators

- required   
