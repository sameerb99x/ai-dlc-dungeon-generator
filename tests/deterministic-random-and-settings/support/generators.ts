import fc from "fast-check";
export const seedArbitrary = fc.string({ minLength: 0, maxLength: 40 });
export const integerRangeArbitrary = fc.record({ min: fc.integer({ min: -100, max: 100 }), span: fc.integer({ min: 0, max: 100 }) });
export const integerListArbitrary = fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 30 });
