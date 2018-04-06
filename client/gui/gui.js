Template.gui.onRendered (() => {
  const levelText = TreeData.find({ parent: null }).map((item) => {
//    return item.name;
    return { name: item.name, id: item._id, flag: false };
  });
  console.log('levelText typeof: ' + typeof levelText);
  console.log('levelText: ' + levelText);
  const mongoId = new Mongo.ObjectID;
  // Extract the id String from the object to use as the Meteor id in TreeView
  const meteorId = mongoId._str;
  const segmentsPerLevel = [[{ name: "Optimus QMS", id: meteorId, flag: true, lines: 1, lineBreaks: [11] }], levelText];
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
  },
  'myFile': function () {
    const selectedFile = Session.get('selectedFile');
//    console.log("myFile selectedFileId typeof: " + typeof selectedFile);
    if (selectedFile !== '') {
      const fcId = new Mongo.ObjectID(selectedFile);
  //    console.log("myFile: " + fcId);
      const mySelectedFile = myFiles.findOne({ _id: fcId });
      if (!mySelectedFile) return;
  //    console.log("myFile mySelectedFile: " + myFiles.baseURL + '/' + mySelectedFile.md5);
      return myFiles.baseURL + '/' + mySelectedFile.md5;
    }
  },
  'contentType': function () {
    const selectedFile = Session.get('selectedFile');
//    console.log("contentType selectedFileId typeof: " + typeof selectedFile);
    if (selectedFile !== '') {
      const fcId = new Mongo.ObjectID(selectedFile);
  //    console.log("contentType selectedFileId: " + fcId);
      const mySelectedFile = myFiles.findOne({ _id: fcId });
      if (!mySelectedFile) return;
  //    console.log("contentType selectedContentType: " + mySelectedFile.contentType);
      return mySelectedFile.contentType;
    }
  },
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
        if (i !== 1) {
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
                segmentName = segments[i - 1][j].name;
                segmentLevel = i - 1;
              }
            } else {
              if (clickAngle >= startAngle ||
                  clickAngle < endAngle) {
                segmentId = segments[i - 1][j].id;
                segmentName = segments[i - 1][j].name;
                segmentLevel = i - 1;
              }
            }
          }
        } else {
          if (clickRadius < outerRadius) {
            segmentId = segments[i - 1][j].id;
            segmentName = segments[i - 1][j].name;
            segmentLevel = i - 1;
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
      let children = '';
      let selectedSegmentId = '';
      let selectedSegmentName = '';
      let id = segmentId;
      const levelText = [];
      const mongoId = new Mongo.ObjectID;
      // Extract the id String from the object to use as the Meteor id in TreeView
      const meteorId = mongoId._str;
      const firstLevel = [{ name: "Optimus QMS", id: meteorId, flag: true, lines: 1, lineBreaks: [11] }];

      if (segmentLevel === 0) {
        levelText.splice(0, 0, firstLevel);
        // add children of the clicked variable in next level down
        children = TreeData.find({ parent: null }).map((item) => {
          return { name: item.name, id: item._id, parent: item.parent, flag: false, lines: 1, lineBreaks: [item.name.length]};
        });
        selectedSegmentId = id;
        selectedSegmentName = segmentName;
        if (children.length > 0) {
          levelText.push(children);
          console.log('levelText: ' + children);
        }
      } else {
        // redefine the segmentsPerLevel variable down to that level

        console.log('id: ' + id);
        console.log('segmentLevel: ' + segmentLevel);
        const selectedSegment = TreeData.findOne({ _id: id });
        selectedSegmentId = selectedSegment._id;
        selectedSegmentName = selectedSegment.name;
        console.log('selectedSegmentId: ' + selectedSegmentId);
        console.log('selectedSegmentName: ' + selectedSegmentName);

        for (let q = segmentLevel; q >= 1; q = q - 1) {
          const thisSegment = TreeData.find({ _id: id }).map((item) => {
            return { name: item.name, id: item._id, parent: item.parent, flag: true, lines: 1, lineBreaks: [item.name.length] };
          });
          thisSegmentId = thisSegment[0].id;
          console.log('thisSegment: ' + thisSegment);
          console.log('thisSegmentId: ' + thisSegmentId);
          // get all the selected segment's siblings
          const siblings = TreeData.find({ parent: thisSegment[0].parent }).map((item) => {
            return { name: item.name, id: item._id, parent: item.parent, flag: false, lines: 1, lineBreaks: [item.name.length]};
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
          id = thisSegment[0].parent;
          console.log('id: ' + id);
        }

        levelText.splice(0, 0, firstLevel);
        // add children of the clicked variable in next level down
        children = TreeData.find({ parent: selectedSegmentId }).map((item) => {
          return { name: item.name, id: item._id, parent: item.parent, flag: false, lines: 1, lineBreaks: [item.name.length] };
        });
        if (children.length > 0) {
          levelText.push(children);
          console.log('levelText: ' + children);
        }
      }
      console.log('selectedSegmentId: ' + selectedSegmentId);
      Session.set('selectedFile', selectedSegmentId);
      const fcId = new Mongo.ObjectID(selectedSegmentId);
  //    console.log("myFile: " + fcId);
      const mySelectedFile = myFiles.findOne({ _id: fcId });
      if (mySelectedFile) {
  //    console.log("myFile mySelectedFile: " + myFiles.baseURL + '/' + mySelectedFile.md5);
        const myFile = myFiles.baseURL + '/' + mySelectedFile.md5;
        const contentType = mySelectedFile.contentType;

        if (getFillType(selectedSegmentName) !== 'folder') {
          var newWindow = window.open(myFile);
        }
      }
      draw(levelText);
    }
  }
});

function draw(segments) {
  var myJSON = JSON.stringify(segments);
  Session.set('segments', myJSON);  // save a copy of the segments array

  const levels = segments.length;
  var canvas = document.getElementById('qmsCanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    // clear the current canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fillCol = ['black', 'red', 'yellow', 'green', 'blue', 'orange', 'cyan', 'violet', 'navy'];

    const ctrx = canvas.width / 2;
    const ctry = canvas.height / 2;

    for (let i = levels; i >= 1; i = i - 1) {

      for (let j = 0; j < segments[i-1].length; j = j + 1) {

        // ******* THIS SECTION RELATES TO DRAWING THE SEGMENTS *******
        // calculate drawing coordinates
        const outerRadius = i * ctry / (1 + levels);
        const innerRadius = (i - 1) * ctry / (1 + levels);
        const angle = Math.PI * 2 / segments[i - 1].length;  // arc of segments
        const startOuterX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
        const startOuterY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
        const startInnerX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;
        const startInnerY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;
        let arcRadius = 0;
        let r = outerRadius;

        if ( i !== 1) {  // calculate the centre of each segment to apply colour gradient
          arcRadius = (outerRadius - innerRadius) / 2 + innerRadius;
          let arcLength = arcRadius * angle;
          r = arcLength / 2;
        }
        const x = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j) * arcRadius;
        const y = ctry + Math.sin(Math.PI * 3 / 2 + angle * j) * arcRadius;

        let startAngle = Math.PI * 3 / 2 + angle * j - angle / 2;
        let endAngle = startAngle + angle;
        if (startAngle >= Math.PI * 2) {
          startAngle = startAngle - Math.PI * 2;
        }
        if (endAngle >= Math.PI * 2) {
          endAngle = endAngle - Math.PI * 2;
        }
        // check the file ending class to determine which color scheme to use for the segment
        const fillType = getFillType(segments[i - 1][j].name);

        // draw the segment
        ctx.beginPath();
        if (segments[i - 1][j].flag === true) {
          ctx.fillStyle = getGrd(ctx, '#ffb3e6', x, y, r);
        } else {
          if (fillType === 'folder') {
            ctx.fillStyle = getGrd(ctx, '#ffffb3', x, y, r);
          } else if (fillType === 'file') {
            ctx.fillStyle = getGrd(ctx, '#ccffb3', x, y, r);
          } else if (fillType === 'image') {
            ctx.fillStyle = getGrd(ctx, '#ccffff', x, y, r);
          } else {
            ctx.fillStyle = getGrd(ctx, '#e0e0eb', x, y, r);
          }
        }
        if (segments[i-1].length !== 1) {
          ctx.arc(ctrx, ctry, outerRadius, startAngle, endAngle, false);
          ctx.lineTo(startInnerX, startInnerY);
          ctx.arc(ctrx, ctry, innerRadius, endAngle, startAngle, true);
          ctx.lineTo(startOuterX, startOuterY);
        } else {
          ctx.arc(ctrx, ctry, outerRadius, 0, 2*Math.PI);
        }
        ctx.stroke();
        ctx.fill();


        // ******* THIS SECTION RELATES TO ADDING THE TEXT *******
        // determine the number of lines of text in each segment and the font size for the level
        let lines = segments[i-1][j].lines;  // no of lines in segments
        let lineBreaks = segments[i-1][j].lineBreaks;  // line break points measured from start of text

        // set font size constraints and default font context
        const minFontHeight = 10;
        const maxFontHeight = 30;
        ctx.textAlign = "center";
        ctx.textBaseline= "middle";
        ctx.fillStyle = fillCol[0];  // text colour black
        ctx.font = "bold 30px Serif";  // set an arbitrary font size;

        // set variables initial values
        let fontHeight = 30;

        // add text to the segment
        // first size the text font to fit its segment
        for (let k = 0; k < lines; k = k + 1) {
          // split text into number of required lines
          text = " " + segments[i - 1][j].name + " ";  // retrieve the segment text and add padding
          let metrics = ctx.measureText(text);  // get information about text
          let textRadius = (outerRadius - innerRadius) / lines * ((k + 1) - (lines + 1) / 2) + innerRadius;
          arcLength = textRadius * angle;

          if (textRadius > arcLength) {  // need to split text
            textLength = text.length;
            lines = lines + 1;
            k = -1;  // force the loop to start again
            let breakPoints = Math.floor((textLength - 1) / (lines - 1));
            for (let l = 0; l < lines - 1; l = l + 1) {  // each line in segment
              lineBreaks[l] = breakPoints * (l + 1) + 1;  // default break point if no 'special' character found
              for (let m = 0; m < breakPoints + 1; m = m + 1) {  // each letter in text
                if (text.charAt(breakPoints + m) === ' ' || text.charAt(breakPoints + m) === '/' || text.charAt(breakPoints + m) === '-') {
                  lineBreaks[l] = breakPoints + m;
                  break;
                } else if (text.charAt(breakPoints - m) === ' ' || text.charAt(breakPoints - m) === '/' || text.charAt(breakPoints - m) === '-') {
                  lineBreaks[l] = breakPoints - m;
                  break;
                }
              }
              breakPoints = Math.floor((textLength - lineBreaks[l] - 1) / (lines - l - 1)); // resets the breakPoint based on previous breakPoint
            }
          }

          console.log('lineBreaks: ' + lineBreaks.length);
          for (let s = 0; s < lineBreaks.length; s += 1) {
            console.log('lineBreaks[' + s + ']: ' + lineBreaks[s]);
          }

/*

          let textScale = metrics.width * 1.2 / arcLength;  // proportion font size
          // iterate font size scaling until within accepted limit
          while (textScale > 1) {
            fontHeight = Math.floor(30 / textScale)
            const scaledFont = 'bold ' + fontHeight.toString() + 'px Serif';
            ctx.font = scaledFont;
            metrics = ctx.measureText(text);  // get information about text
            textRadius = (outerRadius - innerRadius) / 2 - fontHeight / 2 + innerRadius;
            arcLength = textRadius * angle;
            textScale = metrics.width / arcLength / 1.2;  // proportion font size
          }
*/

        // draw the text
          let numDegreesPerLetter = angle / text.length;
          ctx.save();
          ctx.translate(ctrx, ctry);  // centre of canvas
          ctx.rotate(startAngle + numDegreesPerLetter / 2);

          for (var k=0; k<text.length; k++){
            ctx.save();
            ctx.translate(textRadius, 0);
            ctx.rotate(Math.PI / 2);
            ctx.translate(0, -fontHeight / 2);
            ctx.fillText(text[k], 0, 0);
            ctx.restore();
            ctx.rotate(numDegreesPerLetter);
          }
          ctx.restore();
        }
      }
    }
  }
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getGrd(ctx, col, x, y, r1) {
  var grd = ctx.createRadialGradient(x, y, 0, x, y, r1);
  grd.addColorStop(0, col);
  grd.addColorStop(1, "white");
  return grd;
}

function getFillType(fname) {
  const extension = fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);
  let fillType = 'misc';
  if (extension === "") {
    fillType = 'folder';
  } else if (extension === "txt") {
    fillType = 'file';
  } else if (extension === "js") {
    fillType = 'file';
  } else if (extension === "pdf") {
    fillType = 'file';
  } else if (extension === "doc" ||
            extension === "docx") {
    fillType = 'file';
  } else if (extension === "xls" ||
            extension === "xlsx") {
    fillType = 'file';
  } else if (extension === "jpg" ||
            extension === "jpeg" ||
            extension === "png" ||
            extension === "gif") {
    fillType = 'image';
  } else if (extension === "ppt") {
    fillType = 'file';
  }
  return fillType;
}
