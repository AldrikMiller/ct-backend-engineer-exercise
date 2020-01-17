/* eslint-disable no-undef */
const sum = (a, b) => a + b;

describe('sum', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('adds (1 + 2) + 3 to equal 6', () => {
    expect(sum(sum(1, 2), 3)).toBe(6);
  });

  it('adds -1 + -1 to equal -2', () => {
    expect(sum(-1, -1)).toBe(-2);
  });

  it('adds 1 + 0 to equal 1', () => {
    expect(sum(1, 0)).toBe(1);
  });
});
