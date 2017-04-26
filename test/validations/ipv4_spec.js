import validateValue from '../../src/validateValue';

describe('ipv4', () => {
  it('should return true', () => {
    expect(validateValue('122.222.222.222', { ipv4: true })).to.be.null;
  });
  it('should return false', () => {
    expect(validateValue('...', { ipv4: true })).to.deep.equal({ ipv4: true });
    expect(validateValue('', { ipv4: true })).to.deep.equal({ ipv4: true });
  });
});
