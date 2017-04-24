import reduxFormValidate from '../src/reduxFormValidate';

describe('reduxFormValidate', () => {
  it('should return validation function after 1-st call', () => {
    expect(reduxFormValidate({})).to.be.a('function');
  });

  const validate = reduxFormValidate({
    'owner.first_name': {
      required: true,
      minLength: 4,
    },
    'owner.last_name': {
      required: true,
      minLength: 4,
    },
  });

  it('should transform plain object to nested', () => {
    expect(validate({
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
});
