import getUniqueKey from './unique_key';

describe('Utility function Get Unique key for objects', () => {
  it('should return a key as string', () => {
    expect(getUniqueKey({})).toContain('unique-key');
  });

  it('should return unique key', () => {
    const firstObject = { user: 'abc' };
    const secondObject = { user: 'abc' };
    expect(getUniqueKey(firstObject)).not.toEqual(getUniqueKey(secondObject));
  });

  test('same object should have same key', () => {
    const sampleObject = { id: '5d4c' };
    expect(getUniqueKey(sampleObject)).toEqual(getUniqueKey(sampleObject));
  });
});
