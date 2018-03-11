if(window.addEventListener) {
window.addEventListener('load', function () {
  var canvas;
  var context;
  var drawwith;
  var color = 'yellowgreen';
  var plots = [];


  function whitespace (ev) {
    if (ev.layerX || ev.layerX == 0) {
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    }
    // Call the event handler of the drawwith.
    var func = drawwith[ev.type];
    if (func) {
      func(ev);
    var x = e.offsetX || e.layerX - canvas.offsetLeft;
    var y = e.offsetY || e.layerY - canvas.offsetTop;

    plots.push({x: x, y: y});

    drawOnCanvas(plots);
    }

    //accessing API

      pubnub.subscribe({
        channel: channel,
        callback: drawFromStream

        });


  }


  function publish(data) {
  		pubnub.publish({
  			channel: channel,
  			message: data
  		});
    }

  function drawFromStream(message) {
  if(!message || message.plots.length < 1) return;
  drawOnCanvas( message.plots);
  }

  function drawOnCanvas(plots) {
    context.beginPath();
    context.moveTo(plots[0].x, plots[0].y);

    for(var i=1; i<plots.length; i++) {
      context.lineTo(plots[i].x, plots[i].y);
    }
    context.stroke();
  }






 //mouse events
  function drawing () {
    var drawwith = this;
    this.started = false;


    this.mousedown = function (ev) {
    context.beginPath();
    context.moveTo(ev._x, ev._y);
    drawwith.started = true;
    };

    this.mousemove = function (ev) {
      if (drawwith.started) {
        context.lineTo(ev._x, ev._y);
        context.stroke();
      }
    };

    this.mouseup = function (ev) {
      if (drawwith.started) {
        drawwith.mousemove(ev);
        drawwith.started = false;
        publish({
            plots: plots
            });
        plots= [];
      }

    };
  }









  var channel = 'drawwhitespace';

  var pubnub = PUBNUB.init({
    publish_key: 'pub-c-aafabe68-383b-4c77-a1d5-9755f5d4b37f',
    subscribe_key: 'sub-c-8038c29a-24cc-11e8-be22-c2fd0b475b93',
    leave_on_unload : true,
    ssl		: document.location.protocol === "https:"
  });


  function init () {
    canvas = document.getElementById('whiteboard');
    context = canvas.getContext('2d');
    drawwith = new drawing();
    canvas.addEventListener('mousedown', whitespace, false);
    canvas.addEventListener('mousemove', whitespace, false);
    canvas.addEventListener('mouseup',   whitespace, false);
  }



  init();

}, false); }
