
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

function throwNotIterableError(message) {
  var defaultMsg = 'The argument passed is not an iterable';
  var message = message == null ? defaultMsg : message;
  throw new Error(`
      ${message}, check out 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols' for more info
  `);
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
  var cache = [];

  if (!isIterable(iterable)) {
    throwNotIterableError();
  }

  for (var i of iterable) {
    yield i;
    cache.push(i);
  }

  while(true) {
    for (var i = 0; i < cache.length; i++) {
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
  var index = 1;

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
* @param {iterable} object
* @return {object}
*/
export function* chain(...iterables) {
  var itersLength = iterables.length;
  for (var i = 0; i < itersLength; i++) {
    if (!isIterable(iterables[i])) {
      throwNotIterableError(`Argument ${i + 1} is not an iterable`);
    }
    for (var element of iterables[i]) {
      yield element;
    }
  }
}
