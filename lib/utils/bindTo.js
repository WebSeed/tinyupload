export var on = function on(element, names, fn) {
  names.split(' ').forEach(function (name) {
    element.addEventListener(name, fn);
  });
};
export var off = function off(element, names, fn) {
  names.split(' ').forEach(function (name) {
    element.removeEventListener(name, fn);
  });
};