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
      const selectedSegmentName = selectedSegment[0].name;

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
//          newWindow.document.write('<iframe src="' + myFile + '" width="100%" height="100%"></iframe>');
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
        // calculate drawing coordinates
        const outerRadius = i * ctry / (1 + levels);
        const innerRadius = (i - 1) * ctry / (1 + levels);
        const angle = Math.PI * 2 / segments[i - 1].length;  // arc of segments
        const startOuterX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
        const startOuterY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j - angle / 2) * outerRadius;
        const startInnerX = ctrx + Math.cos(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;
        const startInnerY = ctry + Math.sin(Math.PI * 3 / 2 + angle * j + angle / 2) * innerRadius;

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
          ctx.fillStyle = 'magenta';
        } else {
          if (fillType === 'folder') {
            ctx.fillStyle = 'yellow';
          } else if (fillType === 'file') {
            ctx.fillStyle = 'green';
          } else if (fillType === 'image') {
            ctx.fillStyle = 'cyan';
          } else {
            ctx.fillStyle = 'light-gray';
          }
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

        let text = " " + segments[i - 1][j].name + " ";  // retrieve the segment text and add padding
        let metrics = ctx.measureText(text);  // get information about text
        let fontHeight = 30;
        let textRadius = (outerRadius - innerRadius) / 2 - fontHeight / 2 + innerRadius;
        let arcLength = textRadius * angle;
        let textScale = metrics.width * 1.2 / arcLength;  // proportion font size
        // iterate font size scaling until within accepted limit
        while (textScale > 1) {
          fontHeight = Math.floor(30 / textScale)
          const scaledFont = 'bold ' + fontHeight.toString() + 'px Serif';
          ctx.font = scaledFont;
          metrics = ctx.measureText(text);  // get information about text
          textRadius = (outerRadius - innerRadius) / 2 - fontHeight / 2 + innerRadius;
          arcLength = textRadius * angle;
          textScale = metrics.width * 1.2 / arcLength;  // proportion font size
        }

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
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
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
