Template.gui.onRendered (() => {
  const levelText = TreeData.find({ parent: null }).map((item) => {
//    return item.name;
    return { name: item.name, id: item._id, flag: false };
  });
  console.log('levelText typeof: ' + typeof levelText);
  console.log('levelText: ' + levelText);
  const segmentsPerLevel = [[{ name: "Optimus QMS", id: '1234567890', flag: true }], levelText];
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

Template.gui.events ({
  'click .js-qmsCanvas': (event) => {
    // get the click coordinates and calculates radius from centre
    var canvas = document.getElementById('qmsCanvas');
//    const canvasWidth = event.currentTarget.getAttribute('width');
//    const canvasHeight = event.currentTarget.getAttribute('height');
    const ctrx = canvas.width / 2;
    const ctry = canvas.height / 2;
    const pos = getMousePos(canvas, event);
    const clickRadius = Math.sqrt(Math.pow((pos.x - ctrx), 2) + Math.pow((pos.y - ctry), 2));
    let clickAngle = Math.asin((ctry - pos.y) / clickRadius);
    if (ctry - pos.y >= 1 && pos.x - ctrx >= 1) { clickAngle = Math.PI * 2 - clickAngle }
    else if (ctry - pos.y >= 1 && pos.x - ctrx < 1) { clickAngle += Math.PI }
    else if (ctry - pos.y < 1 && pos.x - ctrx < 1) { clickAngle += Math.PI }
    else { clickAngle *= -1 }
//      console.log('clickRadius: ' + clickRadius);
//      console.log('clickAngle: ' + clickAngle);
//      console.log('clickAngle: ' + clickAngle * 180 / Math.PI);

    // retrieve the visible segments array
    segments = JSON.parse(Session.get('segments'));
    const levels = segments.length;
//      console.log('levels: ' + levels);
    let segmentId = '';
    let segmentLevel = 0;
    // iterate through each segment to see which segment has been clicked
    for (let i = levels; i >= 1; i = i - 1) {
      for (let j = 0; j < segments[i - 1].length; j = j + 1) {
        // calculate drawing coordinates
        const outerRadius = i * ctry / (1 + levels);
        const innerRadius = (i - 1) * ctry / (1 + levels);
        const angle = Math.PI * 2 / segments[i - 1].length;  // arc of segments
        let startAngle = Math.PI * 3 / 2 + angle * j - angle / 2;
        let endAngle = startAngle + angle;
        if (startAngle >= Math.PI * 2) {
          startAngle = startAngle - Math.PI * 2;
        }
        if (endAngle >= Math.PI * 2) {
          endAngle = endAngle - Math.PI * 2;
        }

        if (clickRadius < outerRadius &&
            clickRadius >= innerRadius) {
          if (endAngle > startAngle) {
            if (clickAngle >= startAngle &&
                clickAngle < endAngle) {
              segmentId = segments[i - 1][j].id;
              segmentLevel = i - 1;
            }
          } else {
            if (clickAngle >= startAngle ||
                clickAngle < endAngle) {
              segmentId = segments[i - 1][j].id;
              segmentLevel = i - 1;
            }
          }
        }
      }
    }
    console.log('segmentId: ' + segmentId);



/*

    if (event.region) {
      Session.set('clickedSegment', event.region);
      console.log('event.region typeof: ' + typeof event.region);
      console.log('event.region: ' + event.region);
      let id = event.region;
*/


    if (segmentId !== '') {
      // create an empty array variable
      let id = segmentId;
      const levelText = [];
      const firstLevel = [{ name: "Optimus QMS", id: '1234567890', flag: true }];
      // redefine the segmentsPerLevel variable down to that level

      console.log('id: ' + id);
      console.log('segmentLevel: ' + segmentLevel);
      const selectedSegment = TreeData.find({ _id: id }).map((item) => {
        return { name: item.name, id: item._id, parent: item.parent, flag: true };
      });
      const selectedSegmentId = selectedSegment[0].id;

      for (let q = segmentLevel; q >= 1; q = q - 1) {
        const selectedSegment = TreeData.find({ _id: id }).map((item) => {
          return { name: item.name, id: item._id, parent: item.parent, flag: true };
        });
        const selectedSegmentId = selectedSegment[0].id;
        console.log('selectedSegment: ' + selectedSegment);
        console.log('selectedSegmentId: ' + selectedSegmentId);
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
        id = selectedSegment[0].parent;
        console.log('id: ' + id);
      }

      levelText.splice(0, 0, firstLevel);
      // add children of the clicked variable in next level down
      const children = TreeData.find({ parent: selectedSegmentId }).map((item) => {
        return { name: item.name, id: item._id, parent: item.parent, flag: false};
      });
      if (children.length > 0) {
        levelText.push(children);
        console.log('levelText: ' + children);
      }
      draw(levelText);
    }
  }
});

function draw(segments) {
  var myJSON = JSON.stringify(segments);
  Session.set('segments', myJSON);  // save a copy of the segments array

  console.log('segments: ' + segments);
  const levels = segments.length;
  console.log('levels: ' + levels);
  var canvas = document.getElementById('qmsCanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    // clear the current canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fillCol = ['black', 'red', 'yellow', 'green', 'blue', 'orange', 'cyan', 'violet', 'navy'];
    console.log(fillCol);

    const ctrx = canvas.width / 2;
    const ctry = canvas.height / 2;

    for (let i = levels; i >= 1; i = i - 1) {
      for (let j = 0; j < segments[i-1].length; j = j + 1) {
        // calculate drawing coordinates
        const outerRadius = i * ctry / (1 + levels);
        const innerRadius = (i - 1) * ctry / (1 + levels);
        const angle = Math.PI * 2 / segments[i - 1].length;  // arc of segments
        const startOuterX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
        const startOuterY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
//        const endOuterX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j + angle / 2) * outerRadius;
//        const endOuterY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j + angle / 2) * outerRadius;
        const startInnerX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;
        const startInnerY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;
//        const endInnerX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j - angle / 2) * innerRadius;
//        const endInnerY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j - angle / 2) * innerRadius;
//        const textRadius = (outerRadius - innerRadius) / 3 + innerRadius;
//        const arcLength = textRadius * angle;

        let startAngle = Math.PI * 3 / 2 + angle * j - angle / 2;
        let endAngle = startAngle + angle;
        if (startAngle >= Math.PI * 2) {
          startAngle = startAngle - Math.PI * 2;
        }
        if (endAngle >= Math.PI * 2) {
          endAngle = endAngle - Math.PI * 2;
        }
//        console.log('startAngle: ' + startAngle);
//        console.log('endAngle: ' + endAngle);

        // draw the segment
        ctx.beginPath();
        if (segments[i - 1][j].flag === true) {
          ctx.fillStyle = 'magenta';
        } else {
          ctx.fillStyle = fillCol[i];
        }
        ctx.arc(ctrx, ctry, outerRadius, startAngle, endAngle, false);
        if (i === 1) {
          ctx.moveTo(startInnerX, startInnerY);
        } else {
          ctx.lineTo(startInnerX, startInnerY);
        }
        ctx.arc(ctrx, ctry, innerRadius, endAngle, startAngle, true);
        if (i !== 1) {
          ctx.lineTo(startOuterX, startOuterY);
        }
        ctx.stroke();
        ctx.fill();

        // add text to the segment
        // first size the text font to fit its segment
        ctx.textAlign = "center";
        ctx.fillStyle = fillCol[0];  // text colour black
        ctx.font = "bold 30px Serif";  // set an arbitrary font size;

        let text = " " + segments[i - 1][j].name + " ";  // retrieve the segment text
        let metrics = ctx.measureText(text);  // get information about text
        let fontHeight = 30;
//        let textRadius = (outerRadius - innerRadius) / 2 - fontHeight / 2;
        let textRadius = (outerRadius - innerRadius) / 2 - fontHeight / 2 + innerRadius;
//        console.log('textRadius: ' + textRadius);
        let arcLength = textRadius * angle;
        let textScale = metrics.width * 1.2 / arcLength;  // proportion font size
//        console.log('textScale: ' + textScale);
        while (textScale > 1) {
          fontHeight = Math.floor(30 / textScale)
          const scaledFont = 'bold ' + fontHeight.toString() + 'px Serif';
//          console.log('scaledFont: ' + scaledFont);
          ctx.font = scaledFont;
          metrics = ctx.measureText(text);  // get information about text
          textRadius = (outerRadius - innerRadius) / 2 - fontHeight / 2 + innerRadius;
          console.log('textRadius: ' + textRadius);
          arcLength = textRadius * angle;
          textScale = metrics.width * 1.2 / arcLength;  // proportion font size
//          console.log('textScale: ' + textScale);
        }

/*
        ctx.fillTextArc(text,
                        ctrx,
                        ctry,
                        textRadius,
                        start,
                        angle,
                        metrics.height
        );
*/
        // draw the text
        let numDegreesPerLetter = angle / text.length;
        ctx.save();
        ctx.translate(ctrx, ctry);  // centre of canvas
        ctx.rotate(startAngle + numDegreesPerLetter / 2);

        for (var k=0; k<text.length; k++){
           ctx.save();
           ctx.translate(textRadius, 0);
     //      if (i == 0) {
     //          this.fillStyle = 'red';
     //          this.translate(cw / 2, -th / 2);
     //          this.fillRect(0,0,4,4);
               ctx.rotate(Math.PI / 2);
               ctx.translate(0, -fontHeight / 2);
     //          this.fillStyle = 'black';
     //      }

     //      this.fillRect(0,0,4,4);
           ctx.fillText(text[k], 0, 0);
           ctx.restore();
           ctx.rotate(numDegreesPerLetter);
        }
        ctx.restore();

      }
    }
/*
    canvas.addEventListener('click', function(event) {
      // get the click coordinates and calculates radius from centre
      const pos = getMousePos(canvas, event);
      const ctrx = canvas.width / 2;
      const ctry = canvas.height / 2;
      const clickRadius = Math.sqrt(Math.pow((pos.x - ctrx), 2) + Math.pow((pos.y - ctry), 2));
      let clickAngle = Math.asin((ctry - pos.y) / clickRadius);
      if (ctry - pos.y >= 1 && pos.x - ctrx >= 1) { clickAngle = Math.PI * 2 - clickAngle }
      else if (ctry - pos.y >= 1 && pos.x - ctrx < 1) { clickAngle += Math.PI }
      else if (ctry - pos.y < 1 && pos.x - ctrx < 1) { clickAngle += Math.PI }
      else { clickAngle *= -1 }
//      console.log('clickRadius: ' + clickRadius);
//      console.log('clickAngle: ' + clickAngle);
//      console.log('clickAngle: ' + clickAngle * 180 / Math.PI);

      // retrieve the visible segments array
      segments = JSON.parse(Session.get('segments'));
      const levels = segments.length;
//      console.log('levels: ' + levels);
      let segmentId = '';
      let segmentLevel = 0;
      // iterate through each segment to see which segment has been clicked
      for (let i = levels; i >= 1; i = i - 1) {
        for (let j = 0; j < segments[i - 1].length; j = j + 1) {
          // calculate drawing coordinates
          const outerRadius = i * ctry / (1 + levels);
          const innerRadius = (i - 1) * ctry / (1 + levels);
          const angle = Math.PI * 2 / segments[i - 1].length;  // arc of segments
          let startAngle = Math.PI * 3 / 2 + angle * j - angle / 2;
          let endAngle = startAngle + angle;
          if (startAngle >= Math.PI * 2) {
            startAngle = startAngle - Math.PI * 2;
          }
          if (endAngle >= Math.PI * 2) {
            endAngle = endAngle - Math.PI * 2;
          }

          if (clickRadius < outerRadius &&
              clickRadius >= innerRadius) {
            if (endAngle > startAngle) {
              if (clickAngle >= startAngle &&
                  clickAngle < endAngle) {
                segmentId = segments[i - 1][j].id;
                segmentLevel = i - 1;
              }
            } else {
              if (clickAngle >= startAngle ||
                  clickAngle < endAngle) {
                segmentId = segments[i - 1][j].id;
                segmentLevel = i - 1;
              }
            }
          }
        }
      }
      console.log('segmentId: ' + segmentId);

//      if (event.region) {
//        Session.set('clickedSegment', event.region);
//        console.log('event.region typeof: ' + typeof event.region);
//        console.log('event.region: ' + event.region);
//        let id = event.region;

      if (segmentId !== '') {
        // create an empty array variable
        let id = segmentId;
        const levelText = [];
        const firstLevel = [{ name: "Optimus QMS ", id: '1234567890', flag: true }];
        // redefine the segmentsPerLevel variable down to that level

        console.log('id: ' + id);
        console.log('segmentLevel: ' + segmentLevel);
        const selectedSegment = TreeData.find({ _id: id }).map((item) => {
          return { name: item.name, id: item._id, parent: item.parent, flag: true };
        });
        const selectedSegmentId = selectedSegment[0].id;

        for (let q = segmentLevel; q >= 1; q = q - 1) {
          const selectedSegment = TreeData.find({ _id: id }).map((item) => {
            return { name: item.name, id: item._id, parent: item.parent, flag: true };
          });
          const selectedSegmentId = selectedSegment[0].id;
          console.log('selectedSegment: ' + selectedSegment);
          console.log('selectedSegmentId: ' + selectedSegmentId);
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
          id = selectedSegment[0].parent;
          console.log('id: ' + id);
        }

        levelText.splice(0, 0, firstLevel);
        // add children of the clicked variable in next level down
        const children = TreeData.find({ parent: selectedSegmentId }).map((item) => {
          return { name: item.name, id: item._id, parent: item.parent, flag: false};
        });
        levelText.push(children);
        console.log('levelText: ' + children);
        draw(levelText);
      }
    });
*/
  }
};

//    ctx.beginPath();
//    ctx.fillStyle = 'green'
//    ctx.arc(ctrx, ctry, (level - 1) * ctrx / (2* (1 + level)), 0, Math.PI * 2);
//    ctx.fill();

// Debug code commented out

// Obviously this will have to change depending on the size of each glyph and the circle, etc.

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

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
