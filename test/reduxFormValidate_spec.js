import reduxFormValidate from '../src/reduxFormValidate';
import collectionOf from '../src/collectionOf';
import arrayOf from '../src/arrayOf';

describe('reduxFormValidate', () => {
  it('should return validation function after 1-st call', () => {
    expect(reduxFormValidate({})).to.be.a('function');
  });

  it('should transform plain object to nested', () => {
    const validateObject = reduxFormValidate({
      'owner.first_name': {
        required: true,
        minLength: 4,
      },
      'owner.last_name': {
        required: true,
        minLength: 4,
      },
    });
    expect(validateObject({
      owner: {
        first_name: 'Ivan',
      }
    })).to.deep.equal({
      owner: {
        last_name: {
          required: true,
          minLength: 4,
        },
      },
    });
  });

  describe('FieldArray validation (_error)', () => {
    it('should return nested error with unique key for ValidateCollection', () => {
      const validate = reduxFormValidate({
        contacts: collectionOf({
          key: {
            required: true,
          },
        }, {
          uniqueKey: 'key',
        }),
      });
      expect(validate({
        contacts: [
          {
            key: 1,
          },
          {
            key: 1,
          }
        ],
      })).to.deep.equal({
        contacts: {
          _error: {
            uniqueKey: 'key',
          },
        },
      });
    });
    it('should return nested error with unique key for ValidateArray', () => {
      const validate = reduxFormValidate({
        contacts: arrayOf({
          required: true,
        }, {
          unique: true,
        }),
      });
      expect(validate({
        contacts: [1, 1],
      })).to.deep.equal({
        contacts: {
          _error: {
            unique: true,
          },
        },
      });
    });
  });

  describe('includeRequired', () => {
    const validate = reduxFormValidate({
      description: {
        minLength: 4,
      },
    });

    it('should not return error if value is empty and not required', () => {
      expect(validate({ description: '' })).to.deep.equal({});
      expect(validate({ description: undefined })).to.deep.equal({});
      expect(validate({ description: null })).to.deep.equal({});
      expect(validate({ description: 'abc' })).to.deep.equal({ description: { minLength: 4 } });
    });

    describe(':true', () => {
      const validate = reduxFormValidate({
        description: {
          minLength: 4,
        },
      }, {
        includeRequired: true,
      });

      it('should return an error', () => {
        expect(validate({ description: '' })).to.deep.equal({ description: { minLength: 4 } });
      });
    });
  });

  describe('function as a param', () => {
    it('should support function as a param', () => {
      const validate = reduxFormValidate({
        description: {
          required: () => true,
        },
      });

      expect(validate({ description: '' })).to.deep.equal({ description: { required: true } });
    });
  });
});
