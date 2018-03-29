Template.gui.onRendered (() => {
  const levelText = TreeData.find({ parent: null }).map((item) => {
//    return item.name;
    return { name: item.name, id: item._id, flag: false };
  });
  console.log('levelText typeof: ' + typeof levelText);
  console.log('levelText: ' + levelText);
  const segmentsPerLevel = [[{ name: "Optimus QMS ", id: '1234567890', flag: true }], levelText];
  console.log('segmentsPerLevel typeof: ' + typeof segmentsPerLevel);
  console.log('segmentsPerLevel: ' + segmentsPerLevel);
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
  },
  levels: () => {
    const clickedId = Session.get('clickedSegment');
    // find which level the clicked segment is in

    // redefine the segmentsPerLevel variable down to that level

    // add children of the clicked variable in next level down
    const levelText = TreeData.find({ parent: null }).map((item) => {
      return item.name;
    });
  }
});

function draw(segments) {
  console.log('segments: ' + segments);
  const levels = segments.length;
  console.log('levels: ' + levels);
  var canvas = document.getElementById('qmsCanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    // clear the current canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fillCol = ['red', 'yellow', 'green', 'blue', 'orange', 'magenta', 'cyan', 'violet', 'navy'];
    console.log(fillCol);

    const ctrx = canvas.width / 2;
    const ctry = canvas.height / 2;

    for (let i = levels; i >= 1; i = i - 1) {
      for (let j = 0; j < segments[i-1].length; j = j + 1) {
        const outerRadius = i * ctry / (1 + levels);
        const innerRadius = (i - 1) * ctry / (1 + levels);
        const angle = Math.PI * 2 / segments[i - 1].length;
        const startOuterX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
        const startOuterY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
        const endOuterX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j + angle / 2) * outerRadius;
        const endOuterY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j + angle / 2) * outerRadius;
        const startInnerX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;
        const startInnerY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;
        const endInnerX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j - angle / 2) * innerRadius;
        const endInnerY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j - angle / 2) * innerRadius;
        const textRadius = (outerRadius - innerRadius) / 3 + innerRadius;
        const arcLength = textRadius * angle;

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
        ctx.addHitRegion({ id: segments[i - 1][j].id });

        ctx.textAlign = "center";
        ctx.fillStyle = fillCol[Math.floor((Math.random() * 9) + 1)];
        ctx.font = "bold 30px Serif";  // arbitrary font size;

//        let text = " " + segments[i - 1][j] + " ";
        let text = " " + segments[i - 1][j].name + " ";
        var metrics = ctx.measureText(text);  // get information about text

        const textScale = metrics.width * 1.2 / arcLength;  // proportion font size
        console.log('textScale: ' + textScale);
        if (textScale > 1) {
          const scaledFont = 'bold ' + (Math.floor(30 / textScale)).toString() + 'px Serif';
          console.log('scaledFont: ' + scaledFont);
          ctx.font = scaledFont;
        }

        metrics = ctx.measureText(text);  // get information about text

        ctx.fillTextArc(text,
                        ctrx,
                        ctry,
                        textRadius,
                        start,
                        angle,
                        metrics.height
        );
/*
        var numDegreesPerLetter = angle / text.length;
        ctx.save();
        ctx.translate(ctrx, ctry);  // centre of canvas
        ctx.rotate(start + numDegreesPerLetter / 2);

        for (var i=0; i<text.length; i++){
           ctx.save();
           ctx.translate(textRadius, 0);
     //      if (i == 0) {
     //          this.fillStyle = 'red';
     //          this.translate(cw / 2, -th / 2);
     //          this.fillRect(0,0,4,4);
               ctx.rotate(Math.PI / 2);
               ctx.translate(0, -metrics.height / 2);
     //          this.fillStyle = 'black';
     //      }

     //      this.fillRect(0,0,4,4);
           ctx.fillText(text[i], 0, 0);
           ctx.restore();
           ctx.rotate(numDegreesPerLetter);
        }
        ctx.restore();
*/
      }
    }
    canvas.addEventListener('click', function(event) {
      if (event.region) {
        Session.set('clickedSegment', event.region);
        console.log('event.region typeof: ' + typeof event.region);
        console.log('event.region: ' + event.region);
        // create an empty array variable
        let id = event.region;
        const levelText = [];
        const firstLevel = [{ name: "Optimus QMS ", id: '1234567890', flag: true }];
        // redefine the segmentsPerLevel variable down to that level

//        while (id !== null) {
          const selectedSegment = TreeData.find({ _id: id }).map((item) => {
            return { name: item.name, id: item._id, parent: item.parent, flag: true };
          });
          console.log('selectedSegment: ' + selectedSegment);
          // get all the selected segment's siblings
          const siblings = TreeData.find({ parent: selectedSegment[0].parent }).map((item) => {
            return { name: item.name, id: item._id, parent: item.parent, flag: false};
          });
          console.log('siblings: ' + siblings);
          // go through the siblings and change the flag of the selected sibling
          for (let r=0; r<siblings.length; r++) {
            if (siblings[r].id === id) {
              siblings[r].flag = true;
            }
          }
          // splice the level data to the beginning of the array variable
          levelText.splice(0, 0, siblings);
          // reset id to parent id
          console.log('levelText: ' + levelText);
          console.log('id: ' + id);
          id = selectedSegment[0].parent;
//        }

        levelText.splice(0, 0, firstLevel);
        console.log('levelText: ' + levelText);
        // add children of the clicked variable in next level down
        const children = TreeData.find({ parent: selectedSegment[0].id }).map((item) => {
          return { name: item.name, id: item._id, parent: item.parent, flag: false};
        });
        levelText.push(children);
        console.log('levelText: ' + children);
        draw(levelText);
      }
    });
  }
};

//    ctx.beginPath();
//    ctx.fillStyle = 'green'
//    ctx.arc(ctrx, ctry, (level - 1) * ctrx / (2* (1 + level)), 0, Math.PI * 2);
//    ctx.fill();

// Debug code commented out

// Obviously this will have to change depending on the size of each glyph and the circle, etc.

guiCanv = (function() {
  return {
    myCanvas: () => {
      let canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.width = 25 + 'em';
      canvas.style.height = 15 + 'em';
      canvas.style.top = -90 + 'px';
      canvas.style.left = -50 + 'px';
      canvas.id = 'signature';
      canvas.style.border = '1px solid black';

      canvas.addEventListener('mousemove', function() {
        console.log('mouse moving again');
      }, false);
      return canvas;
    }
  }
});

CanvasRenderingContext2D.prototype.fillTextArc = function(text, x, y, radius, startRotation, angle, th){
   var numDegreesPerLetter = angle / text.length;
   this.save();
   this.translate(x, y);  // centre of canvas
   this.rotate(startRotation + numDegreesPerLetter / 2);

   for (var i=0; i<text.length; i++){
      this.save();
      this.translate(radius, 0);
//      if (i == 0) {
//          this.fillStyle = 'red';
//          this.translate(cw / 2, -th / 2);
//          this.fillRect(0,0,4,4);
          this.rotate(Math.PI / 2);
          this.translate(0, -th / 2);
//          this.fillStyle = 'black';
//      }

//      this.fillRect(0,0,4,4);
      this.fillText(text[i], 0, 0);
      this.restore();
      this.rotate(numDegreesPerLetter);
   }
   this.restore();
}
