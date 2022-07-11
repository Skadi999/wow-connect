function selectRandomIndexFromArray(arr) {
  // Returns a random number from 0 to arr.length - 1
  return Math.floor(Math.random() * arr.length);
}

function selectRandomElementFromArray(arr) {
  return arr[selectRandomIndexFromArray(arr)]
}

function isObjEmpty(obj) {
  return Object.keys(obj).length === 0
}