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
      }
    }

//    ctx.beginPath();
//    ctx.fillStyle = 'green'
//    ctx.arc(ctrx, ctry, (level - 1) * ctrx / (2* (1 + level)), 0, Math.PI * 2);
//    ctx.fill();

  }
};
