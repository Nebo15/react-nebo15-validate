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
});
