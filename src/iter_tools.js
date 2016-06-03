
/*
* Check if an object is iterable
*/
function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

function* count(start=0, count=1) {
  while (true) {
    yield start;
    start += count;
  }
}

function* cycle(iterable) {
  var cache = [];

  if (!isIterable(iterable)) {
    throw new Error(`
      The argument passed is not an iterable,
      check out 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols' for more info
    `);
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

function* repeat(object, times) {
  var index = 1;

  if (object == null) {
    throw Error('The argument passed is invalid')
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

export default {
  count,
  cycle,
  repeat
}

