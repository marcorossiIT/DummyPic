const { outlog } = require('./FileLogger');
const express = require('express')
const Canvaser = require('canvas');

const ASSETS_DIR = "assets/"
const STANDARD_RESPONSE_PNG = 'How to use me.jpeg'

const fs = require('fs');

const app = express()

const port = process.env.PORT || 80

app.use(express.urlencoded({ extended: true }), urlEncodedParameterSanificationRoute);

app.get('/testhtml', (req, res) => {
  outlog(`---------`, `test html asked`)

  outlog(req.body)


  const testHtmlPath = 'test.html';
  res.status(200).sendFile(ASSETS_DIR + testHtmlPath, { root: __dirname })

})

app.use('/:width/:height', widthAndHeightRoute)
app.use('/', rootResponseRoute);




app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})



function sendStandardResponse(responseStream) {
  responseStream.sendFile(ASSETS_DIR + STANDARD_RESPONSE_PNG, { root: __dirname });
}

class Pic {
  #width
  #height
  #canvas
  #context
  #centralText = "x"
  #centralTextFont = "bold 30pt Arial"
  #centralTextFontKerning = "none"
  #centralTextAlign = "center"
  #centralTextBaseline = "middle"
  #centralTextFillColor = "#515151"
  #canvasFillColor = "#A0A4A7"



  constructor(width, height, fillColor = null) {
    this.#width = width;
    this.#height = height;
    this.#centralText = `${this.#width}x${this.#height}`;

    this.#canvas = Canvaser.createCanvas(this.#width, this.#height);
    this.#context = this.#canvas.getContext('2d');

    if (fillColor != null) {
      this.#fillCanvas(fillColor);
    }


    this.canvasRedraw();

  }


  /**
   * Redraw canvas and all it's element in order
   */
  canvasRedraw() {
    // 1 - background
    this.#fillCanvas();

    // 2 - text
    this.#textPrint();

  }

  /**
   * Executive modification of the canvas: fill the background color
   */
  #fillCanvas() { //interna. scrittura effettiva
    this.#context.fillStyle = this.#canvasFillColor;

    this.#context.fillRect(0, 0, this.#width, this.#height)
  }

  /**
  * Executive modification of the canvas: print text on the canvas
  */
  #textPrint() { //interna. scrittura effettiva
    this.#context.font = this.#centralTextFont;
    this.#context.fontKerning = this.#centralTextFontKerning
    this.#context.textAlign = this.#centralTextAlign;
    this.#context.fillStyle = this.#centralTextFillColor;
    this.#context.textBaseline = this.#centralTextBaseline;
    this.#context.fillText(this.#centralText, this.#width / 2, this.#height / 2, 170);

  }


  /**
   * Set the central text on canvas.  
   * Recreate canvas.
   * @param {string} text Text to be wrote on the center
   */
  setText(text) {
    this.#centralText = text;
    this.canvasRedraw();
  }



  /**
   * Set the background color of canvas.  
   * Recreate canvas.
   * @param {string} color A CSS-compatible string representing the color to be used to fille the background of canvas
   */
  setBackgroundColor(color) {
    this.#canvasFillColor = color;
    this.canvasRedraw();
  }
  setTextColor(color) {
    this.#centralTextFillColor = color;
    this.canvasRedraw();

  }

  get width() {
    return this.#width
  }
  set width(size) {
    this.#width = size
  }

  get height() {
    return this.#height
  }
  set height(size) {
    this.#height = size
  }

  get canvas() {
    return this.#canvas
  }
  set canvas(canv) {
    this.#canvas = canv
  }



}




function urlEncodedParameterSanificationRoute(req, res, next) {
  /*
  expectations:
  'color' : string, hex color
  */

  const queryparams = req.query;

  for (const key in queryparams) {
    if (Object.hasOwnProperty.call(queryparams, key)) {
      const val = queryparams[key];
      switch (key) {
        case 'color':
          if (typeof val !== 'string' || val.length != 6) {
            sendStandardResponse(res)
          }
          break;

        default:
          sendStandardResponse(res)
          break;
      }

    }
  }

  next();

}

function widthAndHeightRoute(req, res, next) {

  outlog(`---------`, `new pic requested: ${parseInt(req.params.width)}x${parseInt(req.params.height)}`)

  if (!parseInt(req.params.width) || !parseInt(req.params.height))
    sendStandardResponse(res);

  // -- get or make background color
  // if user provided a color in hex



  let colorHex, color_r, color_g, color_b;
  if ('color' in req.query) {
    colorHex = Math.abs(parseInt(req.query['color'], 16)).toString(16); // validation by conversion
  } else {
    // randomize a new color
    color_r = Math.round(Math.random() * 255).toString(16);
    color_g = Math.round(Math.random() * 255).toString(16);
    color_b = Math.round(Math.random() * 255).toString(16);
    colorHex = color_r + color_g + color_b;
  }
  /**
   * Hexadecimal string rapresentation of user's color
   */

  // -- elaborate text color
  // if background is bright the text is darker
  // text is half the brightness

  // get the Value (like in HSV) of the chosen color
  let textColorHex;
  const color_v = avgIn([parseInt(color_r, 16) / 255, parseInt(color_g, 16) / 255, parseInt(color_b, 16) / 255]);
  if (color_v <= 0.4) {
    // cut in half individual primaries
    textColorHex = 'FFFFFF77'
  } else {
    // half the reversed value of each color, than reverse the value
    textColorHex = '00000077'
  }

  // -- initialize a new Pic
  const pic = new Pic(parseInt(req.params.width), parseInt(req.params.height));

  const backgroundFillColorHex = '#' + colorHex;
  pic.setBackgroundColor(backgroundFillColorHex);
  const textFillColorHex = '#' + textColorHex;
  pic.setTextColor(textFillColorHex)


  res.status(200).set('Content-Type', 'image/png').send(pic.canvas.toBuffer('image/png'));
}
function rootResponseRoute(req, res, next) {

  sendStandardResponse(res);

}

function avgIn(numbersArr) {
  if (!Array.isArray(numbersArr) || numbersArr.length == 0) {
    return false
  }
  
  let sum = 0;
  numbersArr.forEach(el => {
    sum += Number(el)
  })

  return sum / numbersArr.length;
}