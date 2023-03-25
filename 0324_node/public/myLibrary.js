
function myLibrary(selector) {
  let box = document.querySelector(selector);
  box.move = function move(speed, callback) {
    var box = this;
    box.callback = callback;
    var x = 0;
    var ref = setInterval(function() {
      x += 10;
      if(x >= 400) {
        x = 400;
        clearInterval(ref);
        box.callback();
      }
      box.style.left = x + "px";
    }, speed);
  };
  // 메소드 체인으로 구현
  return box;
}


var $ = myLibrary;