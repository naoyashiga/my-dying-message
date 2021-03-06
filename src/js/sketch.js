
// Reference: https://github.com/hardmaru/rnn-tutorial
// https://github.com/hardmaru/rnn-tutorial


// Basic Example of Unconditional Handwriting Generation.
var sketch = function( p ) {
  "use strict";

  // variables we need for this demo
  var dx, dy; // offsets of the pen strokes, in pixels
  var pen, prev_pen; // keep track of whether pen is touching paper
  var x, y; // absolute coordinates on the screen of where the pen is

  var rnn_state; // store the hidden states of rnn's neurons
  var pdf; // store all the parameters of a mixture-density distribution
  var temperature = 0.55; // controls the amount of uncertainty of the model

  var screen_width, screen_height; // stores the browser's dimensions
  var line_color;

  var img;
  var handImageElement;

  var imgOffsetX = 10;
  var imgOffsetY = 10;

  var restart = function() {
    // reinitialize variables before calling p5.js setup.

    // make sure we enforce some minimum size of our demo
    screen_width = Math.max(window.innerWidth, 480);
    screen_height = Math.max(window.innerHeight, 320);

    handImageElement = document.getElementById("img-hand");

    // start drawing from somewhere in middle of the canvas
    x = 50;
    y = p.random(100, screen_height-100);

    // initialize the scale factor for the model. Bigger -> large outputs
    Model.set_scale_factor(15.0);

    // initialize pen's states to zero.
    [dx, dy, prev_pen] = Model.zero_input(); // the pen's states

    // randomize the rnn's initial states
    rnn_state = Model.random_state();

    // define color of line
    line_color = p.color(255, 0, 0);

  };

  p.setup = function() {
    restart(); // initialize variables for this demo
    p.createCanvas(screen_width, screen_height);
    p.frameRate(40);
    p.background(0, 0, 0, 255);
    p.fill(0, 0, 0, 255);
  };

  p.draw = function() {

    // using the previous pen states, and hidden state, get next hidden state
    rnn_state = Model.update([dx, dy, prev_pen], rnn_state);

    // get the parameters of the probability distribution (pdf) from hidden state
    pdf = Model.get_pdf(rnn_state);

    // sample the next pen's states from our probability distribution
    [dx, dy, pen] = Model.sample(pdf, temperature);

    // only draw on the paper if the pen is touching the paper
    if (prev_pen == 0) {
      p.stroke(line_color);
      p.strokeWeight(8.0);
      p.line(x, y, x+dx, y+dy); // draw line connecting prev point to current point.

      handImageElement.style.transform = 'translate3d(' + (x + dx - imgOffsetX) + 'px, ' + (y + dy - imgOffsetY) + 'px, 0)';
    }

    // update the absolute coordinates from the offsets
    x += dx;
    y += dy;

    // update the previous pen's state to the current one we just sampled
    prev_pen = pen;

    // if the rnn starts drawing close to the right side of the canvas, reset demo
    if (x > screen_width - 50) {
      restart();
    }

    if (p.frameCount % 30 == 0) {
      p.background(0, 0, 0, 16); // fade out a bit.
      p.fill(0, 0, 0, 32);
    }

  };

};
var custom_p5 = new p5(sketch, 'sketch');
