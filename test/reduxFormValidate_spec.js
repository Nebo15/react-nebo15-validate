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
        'contacts': {
          '_error': {
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
        contacts: ['1', '1'],
      })).to.deep.equal({
        'contacts': {
          '_error': {
            unique: true,
          },
        },
      });
    });
  });
});

