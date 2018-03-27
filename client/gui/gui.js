Template.gui.onRendered (() => {
  const segmentsPerLevel = [1,5,3,7,5,4,6,2,9];
  draw(segmentsPerLevel);
});

Template.gui.helpers ({
  segments: () => {
    const level = 1;
    levelSegments = TreeData.find({ parent: null });
    noSegments = levelSegments.count();
  },
  canvasHeight: () => {
    var canvas = document.getElementById('qmsCanvas');
    return window.innerHeight - 30;
  },
  canvasWidth: () => {
    var canvas = document.getElementById('qmsCanvas');
    return window.innerWidth - 30;
  }
});

function draw(segments) {
  const levels = segments.length;
  console.log(levels);
  var canvas = document.getElementById('qmsCanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    const fillCol = ['red', 'yellow', 'green', 'blue', 'orange', 'magenta', 'cyan', 'violet', 'navy'];
    console.log(fillCol);

    const ctrx = canvas.width / 2;
    const ctry = canvas.height / 2;

    for (let i = levels; i >= 1; i = i - 1) {
      for (let j = 0; j < segments[i - 1]; j = j + 1) {
        const outerRadius = i * ctry / (1 + levels);
        const innerRadius = (i - 1) * ctry / (1 + levels);
        const angle = Math.PI * 2 / segments[i - 1];
        const startOuterX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
        const startOuterY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
        const endOuterX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j + angle / 2) * outerRadius;
        const endOuterY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j + angle / 2) * outerRadius;
        const startInnerX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;
        const startInnerY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;
        const endInnerX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j - angle / 2) * innerRadius;
        const endInnerY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j - angle / 2) * innerRadius;
        let start = Math.PI * 3 / 2 + angle * j - angle / 2;
        let end = start + angle;
        if (start >= Math.PI * 2) {
          start = start - Math.PI * 2;
        }
        if (end >= Math.PI * 2) {
          end = end - Math.PI * 2;
        }

        ctx.beginPath();
        ctx.fillStyle = fillCol[Math.floor((Math.random() * 9) + 1)];
        ctx.arc(ctrx, ctry, outerRadius, start, end, false);
        ctx.lineTo(startInnerX, startInnerY);
        ctx.arc(ctrx, ctry, innerRadius, end, start, true);
        ctx.lineTo(startOuterX, startOuterY);
        ctx.fill();


        ctx.fillStyle = fillCol[Math.floor((Math.random() * 9) + 1)];
        ctx.font = "bold 30px Serif";

        let text = "Arc Text";
        var metrics = ctx.measureText(text);

        ctx.fillTextArc(text,
                        ctrx,
                        ctry,
                        (outerRadius + innerRadius) / 2,
                        start,
                        angle,
                        metrics.width / text.length, // average character width
                        metrics.height
        );
      }
    }
  }
};

//    ctx.beginPath();
//    ctx.fillStyle = 'green'
//    ctx.arc(ctrx, ctry, (level - 1) * ctrx / (2* (1 + level)), 0, Math.PI * 2);
//    ctx.fill();

// Debug code commented out

// Obviously this will have to change depending on the size of each glyph and the circle, etc.

CanvasRenderingContext2D.prototype.fillTextArc = function(text, x, y, radius, startRotation, angle, cw, th){
   var numDegreesPerLetter = angle / text.length;
   this.save();
   this.translate(x, y);  // centre of canvas
   this.rotate(startRotation + numDegreesPerLetter / 2);

   for (var i=0; i<text.length; i++){
      this.save();
      this.translate(radius, 0);
//      if (i == 0) {
//          this.fillStyle = 'red';
          this.translate(cw / 2, -th / 2);
//          this.fillRect(0,0,4,4);
          this.rotate(Math.PI / 2);
          this.translate(-cw / 2, th / 2);
//          this.fillStyle = 'black';
//      }

//      this.fillRect(0,0,4,4);
      this.fillText(text[i], 0, 0);
      this.restore();
      this.rotate(numDegreesPerLetter);
   }
   this.restore();
}
