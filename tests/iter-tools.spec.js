import { expect } from 'chai';

import {
  count,
  cycle,
  repeat,
  chain,
  compress,
  dropWhile,
  iFilter,
  iFilterFalse,
  iSlice
} from '../dist/distribution';

describe('Iteration tools test', () => {

  describe('count', () => {
    it('should yield evenly spaced values', () => {
      let check = count(5, 1);

      expect(check.next().value).to.equal(5);
      expect(check.next().value).to.equal(6);
      expect(check.next().value).to.equal(7);
      expect(check.next().value).to.equal(8);
    });

    it('should yield evenly spaced values and stop at the specified point', () => {
      let check = count(5, 1, 3);

      expect(check.next().value).to.equal(5);
      expect(check.next().value).to.equal(6);
      expect(check.next().value).to.equal(7);
      expect(check.next().value).to.be.an('undefined');
    });

    it('should yield default values if no value is passed', () => {
      let check = count();

      expect(check.next().value).to.equal(0);
      expect(check.next().value).to.equal(1);
      expect(check.next().value).to.equal(2);
      expect(check.next().value).to.equal(3);
    });
  });

  describe('cycle', () => {
    it('should yield infinite repitition of values in iterable', () => {
      let check = cycle('abc');

      expect(check.next().value).to.equal('a');
      expect(check.next().value).to.equal('b');
      expect(check.next().value).to.equal('c');
      expect(check.next().value).to.equal('a');
      expect(check.next().value).to.equal('b');
      expect(check.next().value).to.equal('c');
      expect(check.next().value).to.equal('a');
    });

    it('should throw error if argument passed is not an iterable', () => {
      let check = cycle(123);

      try {
        check.next().value
      } catch(e) {
        expect(e.message).to.contain('The argument passed is not an iterable')
      }
    });
  });

  describe('repeat', () => {
    it('should repeat the passed argument over and over', () => {
      let check = repeat('abc');

      expect(check.next().value).to.equal('abc');
      expect(check.next().value).to.equal('abc');
      expect(check.next().value).to.equal('abc');
      expect(check.next().value).to.equal('abc');
      expect(check.next().value).to.equal('abc');
      expect(check.next().value).to.equal('abc');
    })

    it('should terminate if the number of times ot repeat is passed', () => {
      let check = repeat('abc', 3);

      expect(check.next().value).to.equal('abc');
      expect(check.next().value).to.equal('abc');
      expect(check.next().value).to.equal('abc');
      expect(check.next().value).to.be.an('undefined');
    })

    it('should throw an error if no argument is passed', () => {
      let check = repeat();

      try {
        check.next().value
      } catch(e) {
        expect(e.message).to.contain('The argument passed is invalid');
      }
    });
  });

  describe('chain', () => {
    it('should yield the values of all iterators passed', () => {
      let check = chain('abc', [1, 2, 3])

      expect(check.next().value).to.equal('a');
      expect(check.next().value).to.equal('b');
      expect(check.next().value).to.equal('c');
      expect(check.next().value).to.equal(1);
      expect(check.next().value).to.equal(2);
      expect(check.next().value).to.equal(3);
      expect(check.next().value).to.be.an('undefined');
    });

    it('should throw an array if an invalid iterator is passed', () => {
      let check = chain('abc', 123);

      try {
        check.next().value
      } catch(e) {
        expect(e.message).to.contain('Argument 2 is not an iterable');
      }
    });
  });

  describe('compress', () => {
    it('should yield data values based on if the selector value is true', () => {
      let check = compress('abcd', [1, 0, 1, 0])

      expect(check.next().value).to.equal('a');
      expect(check.next().value).to.equal('c');
      expect(check.next().value).to.be.an('undefined');
    });
  });

  describe('dropWhile', () => {
    it('should drop values of iterable if callback returns true', () => {
      let check = dropWhile([1,4,6,4,1], (i) => i < 5);

      expect(check.next().value).to.equal(6);
      expect(check.next().value).to.equal(4);
      expect(check.next().value).to.equal(1);
      expect(check.next().value).to.be.an('undefined');
    });

    it('should throw error if argument passed is not an iterable', () => {
      let check = dropWhile(1234, (i) => i < 5);

      try {
        check.next().value
      } catch(e) {
        expect(e.message).to.contain('The argument passed is not an iterable')
      }
    });
  });

  describe('iFilter', () => {
    it('should filter out values of the iterable if callback returns true', () => {
       let check = iFilter([1,2,3,4,5,6], (i) => i % 2 === 0);

      expect(check.next().value).to.equal(1);
      expect(check.next().value).to.equal(3);
      expect(check.next().value).to.equal(5);
      expect(check.next().value).to.be.an('undefined');
    })
  });

  describe('iFilterFalse', () => {
    it('should filter out values of the iterable if callback returns false', () => {
       let check = iFilterFalse([1,2,3,4,5,6], (i) => i % 2 === 0);

      expect(check.next().value).to.equal(2);
      expect(check.next().value).to.equal(4);
      expect(check.next().value).to.equal(6);
      expect(check.next().value).to.be.an('undefined');
    })
  });

  describe('iSlice', () => {
    it('should return selected elements from iterable', () => {
      let check1 = iSlice([1,2,3]);

      expect(check1.next().value).to.equal(1);
      expect(check1.next().value).to.equal(2);
      expect(check1.next().value).to.equal(3);
      expect(check1.next().value).to.be.an('undefined');

      let check2 = iSlice([1,2,3,4,5,6], 3);

      expect(check2.next().value).to.equal(4);
      expect(check2.next().value).to.equal(5);
      expect(check2.next().value).to.equal(6);
      expect(check2.next().value).to.be.an('undefined');
    })
  });
});
