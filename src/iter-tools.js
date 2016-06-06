
/**
* Check if an object is an iterable
*/
function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

function zip(..args) {

}

function throwNotIterableError(message) {
  let defaultMsg = 'The argument passed is not an iterable';
  let message = message == null ? defaultMsg : message;
  throw new Error(`${message}, check out 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols' for more info`);
}

/**
* Creates an iterator that yields evenly spaced values(Numbers)
* based on the arguments passed.
*
* @param {number} start - The number to start counting from, default{0}
* @param {number} step - The size of increment to make for each yield *default{1}
* @return {object}
*/
export function* count(start=0, step=1) {
  while (true) {
    yield start;
    start += step;
  }
}

/**
* Creates an iterator that yields an infinite repetition of the
* values contained in the iterable passed as argument.
*
* @param {iterable} iterable - Any value that is iterable
* @return {object}
*/
export function* cycle(iterable) {
  let cache = [];

  if (!isIterable(iterable)) {
    throwNotIterableError();
  }

  for (let i of iterable) {
    yield i;
    cache.push(i);
  }

  while(true) {
    for (let i = 0; i < cache.length; i++) {
      yield cache[i];
    }
  }
}

/**
* Creates an iterator that yields an object over and over again
*
* @param {object} object
* @param {number} times - The number of times to return the object
* @return {object}
*/
export function* repeat(object, times) {
  let index = 1;

  if (object == null) {
    throw new Error('The argument passed is invalid')
  }

  if (times == null) {
    while(true) {
      yield object;
    }
  } else {
    while (index <= times) {
      yield object;
      index++;
    }
  }
}

/**
* Creates an iterator that yields the value of all the iterables passed
* from the first to the last
*
* @param {object} iterables
* @return {object}
*/
export function* chain(...iterables) {
  let itersLength = iterables.length;
  for (let i = 0; i < itersLength; i++) {
    if (!isIterable(iterables[i])) {
      throwNotIterableError(`Argument ${i + 1} is not an iterable`);
    }
    for (let element of iterables[i]) {
      yield element;
    }
  }
}

/**
* Creates an iterator that filters values from the iterable based on if the
* corresponding values of the selectors evalutes to true
*
* @param {object} iterable
* @param {object} selectors - should be an iterable that contains values that * evaluate to true or false
* @return {object}
*/
export function* compress(iterable, selectors) {
  if (!isIterable(iterable) || !isIterable(selectors)) {
    throwNotIterableError();
  }

}
