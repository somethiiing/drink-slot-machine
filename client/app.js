$(document).ready(function() {

  //Global variables 
  var completed = 0,
      imgHeight = 1374,
      posArr = [
        0,    //coffee
        80,   //espresso
        165,  //tea
        237,  //coffee
        310,  //espresso
        378,  //tea
        454,  //coffee
        539,  //espresso 
        624,  //tea
        696,  //coffee
        769,  //espresso
        837,  //tea
        913,  //coffee
        1000, //espresso
        1085, //tea
        1157, //coffee
        1230, //espresso
        1298  //tea
      ];
    
  var win = [];
  win[0] = win[237] = win[454] = win[696] = win[913] = win[1157] = 1;
  win[80] = win[310] = win[539] = win[769] = win[1000] = win[1230] = 2;
  win[165] = win[378] = win[624] = win[837] = win[1085] = win[1298] = 3;

  //Slot constructer
  var Slot = function (num, el, max, step) {
      this.num = num; //number of slot
      this.speed = 0; //speed of the slot at any point of time
      this.step = step; //speed will increase at this rate
      this.si = null; //holds setInterval object for the given slot
      this.el = el; //dom element of the slot
      this.maxSpeed = max; //max speed this slot can have
      this.pos = null; //final position of the slot    

      $(el).pan({
          fps:30,
          dir:'down'
      });
      $(el).spStop();
  }

  //Start the slot machine
  Slot.prototype.start = function() {
      var that = this;
      $(that.el).addClass('motion' + that.num);
      $(that.el).spStart();
      that.si = window.setInterval(function() {
          if(that.speed < that.maxSpeed) {
              that.speed += that.step;
              $(that.el).spSpeed(that.speed);
          }
      }, 100);
  };

  //Stop the slot machine
  Slot.prototype.stop = function() {
      var that = this,
          limit = 30;
      clearInterval(that.si);
      that.si = window.setInterval(function() {
          if(that.speed > limit) {
              that.speed -= that.step;
              $(that.el).spSpeed(that.speed);
          }
          if(that.speed <= limit) {
              that.finalPos(that.el);
              $(that.el).spSpeed(0);
              $(that.el).spStop();
              clearInterval(that.si);
              $(that.el).removeClass('motion' + that.num);
              that.speed = 0;
          }
      }, 100);
  };

  //Find the final position of the slots
  Slot.prototype.finalPos = function() {
    var el = this.el,
      el_id,
      pos,
      posMin = 2000000000,
      best,
      bgPos;

    el_id = $(el).attr('id');
    pos = document.getElementById(el_id).style.backgroundPosition;
    pos = pos.split(' ')[1];
    pos = parseInt(pos, 10);

    for(var i = 0; i < posArr.length; i++) {
        for(var j = 0;;j++) {
          var k = posArr[i] + (imgHeight * j);
          if(k > pos) {
            if((k - pos) < posMin) {
              posMin = k - pos;
              best = k;
              this.pos = posArr[i]; //update the final position of the slot
            }
            break;
        }
      }
    }

    best += imgHeight + 4;
    bgPos = "0 " + best + "px";
    $(el).animate({
        backgroundPosition:"(" + bgPos + ")"
    }, {
        duration: 200,
        complete: function() {
            completed ++;
        }
    });
  };
  
  //Reset the slot machine
  Slot.prototype.reset = function() {
    var el_id = $(this.el).attr('id');
    $._spritely.instances[el_id].t = 0;
    $(this.el).css('background-position', '0px 4px');
    this.speed = 0;
    completed = 0;
    $('#result').html('');
  };

  var slotDisplay = function (position, slot) {
    if(position === 0 || position === 237 || position === 454 || position === 696 || position === 913 || position === 1157){
      if(slot === 1) {
        return "Coffee Maker"
      }
      if(slot === 2) {
        return "Coffee Filter"
      }
      if(slot === 3) {
        return "Coffee Beans"
      }
    }
    if(position === 80 || position === 310 || position === 539 || position === 769 || position === 1000 || position === 1230){
      if(slot === 1) {
        return "Espresso Machine"
      }
      if(slot === 2) {
        return "Espresso Tamper"
      }
      if(slot === 3) {
        return "Ground Espresso Beans"
      }
    }
    if(position === 165 || position === 378 || position === 624 || position === 837 || position === 1085 || position === 1298){
      if(slot === 1) {
        return "Tea Pot"
      }
      if(slot === 2) {
        return "Tea Strainer"
      }
      if(slot === 3) {
        return "Loose Tea Leaves"
      }
    }
  };

  var enableControl = function () {
    $('#control').attr("disabled", false);
  };

  var disableControl = function () {
    $('#control').attr("disabled", true);
  };

  var printResult = function () {
    var display = 'You rolled ' + slotDisplay(a.pos,1) + ', '+ slotDisplay(b.pos,2) + ', and ' + slotDisplay(c.pos,3) + '.';
    var displayIMG;
    if(win[a.pos] === win[b.pos] && win[a.pos] === win[c.pos]) {
      if(win[a.pos] === 1) {
        display = display + '\n You win a cup of coffee!';
      }
      if(win[a.pos] === 2) {
        display = display + '\n You win a cup of espresso!';
      }
      if(win[a.pos] === 3) {
        display = display + '\n You win a cup of tea!';
      }
    } else {  
      display = display + '\n You did not win. Click Spin to try again.';
    }
    $('#result').html(display);
  };

  //create slot objects
  var a = new Slot(1, '#slot1', 30, 1);
  var b = new Slot(2, '#slot2', 45, 2);
  var c = new Slot(3, '#slot3', 70, 3);

  //Slot machine controller
  $('#control').click(function() {
    var x;
    if(this.innerHTML == "Spin") {
      a.reset();
      b.reset();
      c.reset();
      a.start();
      b.start();
      c.start();
      this.innerHTML = "Stop";
      
      disableControl(); //disable control until the slots reach max speed
      
      //check every 100ms if slots have reached max speed 
      //if so, enable the control
      x = window.setInterval(function() {
        if(a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed) {
          enableControl();
          window.clearInterval(x);
        }
      }, 100);
    } else if(this.innerHTML == "Stop") {
      a.stop();
      b.stop();
      c.stop();
      this.innerHTML = "Spin";

      disableControl(); //disable control until the slots stop
      
      //check every 100ms if slots have stopped
      //if so, enable the control
      x = window.setInterval(function() {
        if(a.speed === 0 && b.speed === 0 && c.speed === 0 && completed === 3) {
          enableControl();
          window.clearInterval(x);
          printResult();
        }
      }, 100);
    }
  });

});
