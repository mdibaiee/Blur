var $canvas = document.getElementById('c'),
    img = document.images[0],
    c = $canvas.getContext('2d');

// $canvas.width = window.innerWidth;
// $canvas.height = window.innerHeight;

img.onload = function() {
  c.drawImage(img, 0, 0);
}

img.onload();

radius.addEventListener('mousedown', function() {
  radius.isMouseDown = true;
});

radius.addEventListener('mousemove', function() {
  if(radius.isMouseDown) rshow.textContent = radius.value;
})

radius.onchange = function() {
  radius.isMouseDown = false;
  c.drawImage(img, 0, 0);
  for(var i = 0; i < +radius.value/5; i++) {
    blur(5)
  }
  var modulo = +radius.value / 5;
  if(modulo > 0) blur(modulo);
}

function gaussian(x, max) {
  return ( 1 / Math.sqrt(2*Math.PI) ) * Math.pow(Math.E, -x << 1 / 2);
}

function blur(radius) {
  var data = c.getImageData(0, 0, $canvas.width, $canvas.height),
      width = data.width,
      height = data.height,
      pixels = data.data,
      size = width*height*4,
      result = c.createImageData(width, height);

  function fits(n) {
    return n < size && n >= 0;
  }

  for(var i = 0; i < size; i+=4) {
    var n = i / 4;
    var point = [pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]];

    var r = 0,
        g = 0,
        b = 0;

    var pixelsCount = 0;

    for(var j = 0; j < radius; j++) {
      var left = i - j*4,
          right = i + j*4,
          up = i - width*4*(j+1),
          down = i + width*4*(j+1);

      if(fits(left)) {
        r += pixels[left];
        g += pixels[left + 1];
        b += pixels[left + 2];
        pixelsCount++;
      }

      if(fits(right)) {
        r += pixels[right];
        g += pixels[right + 1];
        b += pixels[right + 2];
        pixelsCount++;
      }

      if(fits(up)) {
        r += pixels[up];
        g += pixels[up + 1];
        b += pixels[up + 2];
        pixelsCount++;
      }

      if(fits(up-4)) {
        r += pixels[up - 4];
        g += pixels[up - 3];
        b += pixels[up - 2];
        pixelsCount++;
      }

      if(fits(up+4)) {
        r += pixels[up + 4];
        g += pixels[up + 5];
        b += pixels[up + 6];
        pixelsCount++;
      }

      if(fits(down)) {
        r += pixels[down];
        g += pixels[down + 1];
        b += pixels[down + 2];
        pixelsCount++;
      }

      if(fits(down-4)) {
        r += pixels[down - 4];
        g += pixels[down - 3];
        b += pixels[down - 2];
        pixelsCount++;
      }

      if(fits(down+4)) {
        r += pixels[down + 4];
        g += pixels[down + 5];
        b += pixels[down + 6];
        pixelsCount++;
      }
    }

    result.data[i] = r / pixelsCount;
    result.data[i+1] = g / pixelsCount;
    result.data[i+2] = b / pixelsCount;
    result.data[i+3] = 255;
  }

  c.putImageData(result, 0, 0);
}