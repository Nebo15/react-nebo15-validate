import validate from '../src/validate';
import arrayOf from '../src/arrayOf';
import collectionOf from '../src/collectionOf';

describe('validate', () => {
  const value = {
    first_name: 'Ivan',
    birth_date: new Date(2017, 2, 23),
  };
  const schema = {
    first_name: {
      required: true,
      minLength: 4,
      string: true,
    },
    last_name: {
      required: true,
      minLength: 4,
      string: true,
    },
    birth_date: {
      required: true,
      maxDate: new Date(2016, 2, 23),
    },
  };

  it('should return validation object', () => {
    expect(validate(value, schema)).to.deep.equal({
      last_name: {
        required: true,
        minLength: 4,
        string: true,
      },
      birth_date: {
        maxDate: schema.birth_date.maxDate,
      },
    });
  });
  it('should return empty object for valid value', () => {
    expect(validate({
      first_name: 'Ivan',
      last_name: 'Ivanov',
      birth_date: new Date(1980, 2, 23),
    }, schema)).to.deep.equal({});
  });

  describe('arrayOf', () => {
    const schema = {
      tags: arrayOf({
        required: true,
        minLength: 4,
      }),
    };

    it('should validate array by schema', () => {
      expect(validate({
        tags: ['new', 'news', 'other']
      }, schema)).to.deep.equal({
        'tags[0]': {
          minLength: 4,
        },
      });
    });
    it('should return empty object on valid value', () => {
      expect(validate({
        tags: ['news', 'news', 'other']
      }, schema)).to.deep.equal({});
    });
    describe('options', () => {
      it('should return and error for the root object', () => {
        const schema = {
          contacts: arrayOf({
            required: true,
          }, {
            minLength: 1,
          }),
        };
        expect(validate({
          contacts: [],
        }, schema)).to.deep.equal({
          'contacts': {
            minLength: 1,
          },
        });
      });
    });
  });

  describe('collectionOf', () => {
    const schema = {
      contacts: collectionOf({
        first_name: {
          required: true,
          minLength: 4,
        },
        last_name: {
          required: true,
          minLength: 4,
        },
        second_name: {
          minLength: 4,
        }
      }),
    };

    it('should validate collection by schema', () => {
      expect(validate({
        contacts: [
          {
            first_name: 'Ivan',
            last_name: 'Ivanov',
          },
          {
            first_name: 'Petr',
            last_name: 'Petro',
            second_name: 'Pe',
          },
        ],
      }, schema)).to.deep.equal({
        'contacts[0].second_name': {
          minLength: 4,
        },
        'contacts[1].second_name': {
          minLength: 4,
        },
      });
    });
    it('should return empty object on valid value', () => {
      expect(validate({
        contacts: [
          {
            first_name: 'Ivan',
            last_name: 'Ivanov',
          },
          {
            first_name: 'Petr',
            last_name: 'Petro',
            second_name: 'Petrovich',
          },
        ],
      }, schema)).to.deep.equal({
        'contacts[0].second_name': {
          minLength: 4,
        },
      });
    });

    describe('options', () => {

      it('should return en error on empty collection if required', () => {
        const schema = {
          contacts: collectionOf({}, {
            required: true,
          }),
        };
        expect(validate({
          contacts: null,
        }, schema)).to.deep.equal({
          'contacts': {
            required: true,
          },
        });
      });
      it('should return also on option error on valid object', () => {
        const schema = {
          contacts: collectionOf({
            first_name: {
              required: true,
              minLength: 4,
            },
          }, {
            minLength: 1,
          }),
        };
        expect(validate({
          contacts: [],
        }, schema)).to.deep.equal({
          'contacts': {
            minLength: 1,
          },
        });
      });
    });
  })
});
