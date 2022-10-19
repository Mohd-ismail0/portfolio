// var i = 0;
// //var txt = "Hello, my name is Mohammed Ismail. I am a generalist with a broad range of skills, including Python, SQL, C#, HTML-CSS-JS, Flutter and UI/UX Design."; /* The text */
// var txt = ["Python", "SQL", "C", "HTML-CSS-JS", "Flutter and UI/UX Design"];
// var speed = 65; /* The speed/duration of the effect in milliseconds */

// function typeWriter() {
//   for (i=0; i<txt.length; i++) {
//     let str=txt[i];
//     let a=str.length;
//     for (let j = 0; j <= a; j++) {
//       if (j < (a-1)) {
//         document.getElementById("demo").innerHTML += str[j];
//         setTimeout(typeWriter, speed);
//       }
//       else if(j == (a-1)) {
//         document.getElementById("demo").innerHTML += str[j];
//         setTimeout(typeWriter, 18000);
//       }
//       else if(j==a){
//         document.getElementById("demo").innerHTML ="";
//         setTimeout(typeWriter, speed);
//       }
//     }
// }
// }

var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
  this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
  this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
  delta = this.period;
  this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
  this.isDeleting = false;
  this.loopNum++;
  delta = 500;
  }

  setTimeout(function() {
  that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('typewrite');
  for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }
};

// function notavl(){
//   alert("The page will be updated sonn with more details");
// }
// var res=document.getElementById("res");
// var con=document.getElementById("con");
// con.addEventListener("click",notavl);
// res.addEventListener("click",notavl);