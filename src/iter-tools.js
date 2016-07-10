
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

/**
* Zip the elements of the iterables passed
*/
function iterZip(...iters) {
  let arrayIters = [];
  const iterL = iters.length;
  let result = [];
  let smallestIter;

  // convert the iterables to arrays
  for (let i = 0; i < iterL; i++) {
    arrayIters.push([...iters[i]]);
  }

  // get the iterable that have the smallest number of elements
  smallestIter = arrayIters.reduce((a, b) => {
    return a.length < b.length ? a : b;
  });

 return smallestIter.map((item, index) => {
    return arrayIters.map((arr) => {
      return arr[index];
    });
 });
}

/**
* Enumerate the values of an iterbale
*/
function enumerate(iterable) {
  let enumerateArr = [];
  let index = 0;

  for(let element of iterable) {
    let arr = [];
    arr.push(index);
    arr.push(element);
    enumerateArr.push(arr);
    index++;
  }
  return enumerateArr;
}

function throwNotIterableError(message) {
  let defaultMsg = 'The argument passed is not an iterable';
  let msg = message == null ? defaultMsg : message;
  throw new Error(`${msg}, check out 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols' for more info`);
}

/**
* Creates an iterator that yields evenly spaced values(Numbers)
* based on the arguments passed.
*
* @param {number} start - The number to start counting from, default{0}
* @param {number} step - The size of increment to make for each yield *default{1}
* @return {object}
*/
export function* count(start=0, step=1, stop) {
  let index = 1;

  while (true) {
    yield start;
    start += step;
    if (index === stop) return;
    index += 1;
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

  for (let [data, selector] of iterZip(iterable, selectors)) {
    if (selector) {
      yield data;
    }
  }
}

/**
* Creates an iterator that drops values of an iterable as long as
* the callback passed returns true.
*
* @param {object} iterable
* @param {function} callback - the callback is passed values from the iterable
* and should return a boolean
* @return {object}
*/
export function* dropWhile(iterable, callback) {
  let shouldYield = false;

  if (!isIterable(iterable)) {
    throwNotIterableError();
  }

  for (let element of iterable) {
    if (!callback(element)) {
      shouldYield = true;
    }

    if (shouldYield) yield element;
  }
}

/**
* Creates an iterator that filters element from an iterable base on if
* the callback passed returns true.
*
* @param {object} iterable
* @param {function} callback - the callback is passed values from the iterable
* and should return a boolean
* @return {object}
*/
export function* iFilter(iterable, callback) {
  if (!isIterable(iterable)) {
    throwNotIterableError();
  }

  for (let element of iterable) {
    if (!callback(element)) {
      yield element
    }
  }
}

/**
* Opposite of iFilter
*
* @param {object} iterable
* @param {function} callback - the callback is passed values from the iterable
* and should return a boolean
* @return {object}
*/
export function* iFilterFalse(iterable, callback) {
  if (!isIterable(iterable)) {
    throwNotIterableError();
  }

  for (let element of iterable) {
    if (callback(element)) {
      yield element
    }
  }
}

/**
* Create an iterator that returns selected elements from an iterable
*
* @param {object} iterable
* @param {integer} start - the index to start yielding elemnts: default 0
* @param {integer} step - The size of increment to make for each yield
* @param {integer} stop - the index to stop yielding element
* @return {object}
*/
export function* iSlice(iterable, start=0, step=1, stop) {

  if (!isIterable(iterable)) {
    throwNotIterableError();
  }

  let range = count(start, step, stop);
  let value = range.next().value;

  for (let [index, element] of enumerate(iterable)) {
    if (index === value) {
      value = range.next().value
      yield element;
    }
  }
}

/**
* Create an iterator that applies a given function to the elements of
* the iterables passed.
*
* @param {function}
* @param {object} iterable
* @param {object} iterable
* @return {object}
*/
export function* iMap(func, iter1, iter2) {
    if (!isIterable(iter1)) {
      throwNotIterableError(`Argument 1 is not an iterable`);
    } else if (!isIterable(iter2)) {
      throwNotIterableError(`Argument 2 is not an iterable`)
    }

  let zipIterables = iterZip(iter1, iter2);

  for (let elements of zipIterables) {
    yield func.apply(null, elements);
  }
}

