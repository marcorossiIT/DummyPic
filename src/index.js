const { outlog } = require('./FileLogger');
const express = require('express')
const Canvaser = require('canvas');

const ASSETS_DIR = "assets/"
const STANDARD_RESPONSE_PNG = 'How to use me.jpeg'

const fs = require('fs');

const app = express()

const port = process.env.PORT || 80

app.use('/:width/:height', (req, res, next) => {
  outlog(`---------`, `new pic requested: ${parseInt(req.params.width)}x${parseInt(req.params.height)}, colore standard`)

  if (!parseInt(req.params.width) || !parseInt(req.params.height))
    sendStandardResponse(res);


  const pic = new Pic(parseInt(req.params.width), parseInt(req.params.height));



  res.status(200).send(pic.canvas.toBuffer('image/png'))

})
app.get('/', (req, res, next) => {
  sendStandardResponse(res);
})

app.get('/testhtml', (req, res, next) => {
  const testHtmlPath = 'test.html';
  res.status(200).sendFile(ASSETS_DIR + testHtmlPath, { root: __dirname })

})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})


function saveCanvas(pic, picLocalPath) {
  const picBuffer = pic.canvas.toBuffer('image/png');
  fs.writeFileSync(ASSETS_DIR + picLocalPath, picBuffer)
  outlog('pic saved')
}

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
  #centralTextFillStyle = "#0A0908"
  #centralTextBaseline = "middle"
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
    this.#context.fillStyle = this.#centralTextFillStyle;
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