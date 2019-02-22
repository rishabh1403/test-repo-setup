const keyMap = new WeakMap();
let index = 0;

/**
 * Generates unique key for objects
 * @param {Object} obj - The object for which key is to be generated
 * @summary For a given object, it'll use it as a key in a WeakMap
 * to store unique string which is also returned as a key to be used
 * as keys in react
 * @returns {string} key - Unique key for the object
 */
const getUniqueKey = (obj) => {
  let key = keyMap.get(obj);
  if (!key) {
    key = `unique-key-${index}`;
    keyMap.set(obj, key);
    index += 1;
  }
  return key;
};

export default getUniqueKey;
