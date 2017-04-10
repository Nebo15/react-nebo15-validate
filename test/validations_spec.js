import { getValidation, addValidation, removeValidation } from '../src/validations';

describe('validations', () => {
  describe('getValidation', () => {
    it('should return validation by name', () => {
      expect(getValidation('required')).to.be.defined;
    });
  });
  describe('add/remove validation', () => {
    it('should add user validation', () => {
      const fn = () => {};
      addValidation('custom', fn);
      expect(getValidation('custom')).to.equal(fn);
    });
    it('should remove user validation', () => {
      const fn = () => {};
      addValidation('custom', fn);
      expect(getValidation('custom')).to.equal(fn);
      removeValidation('custom');
      expect(getValidation('custom')).to.equal(undefined);
    });
    it('should not remove default validations', () => {
      removeValidation('required');
      expect(getValidation('required')).to.be.defined;
    });
  });
});
