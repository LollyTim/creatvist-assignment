// console.log("Doings canva ");

// var canvas = document.querySelector("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// var c = canvas.getContext("2d");

// // c.fillStyle = "rgba(255, 0 , 5,0.3)";
// // c.fillRect(100, 100, 100, 100);
// // c.fillStyle = "rgba(2, 0 , 5,0.3)";
// // c.fillRect(400, 100, 100, 100);
// // c.fillStyle = "rgba(100, 0 , 5,0.3)";
// // c.fillRect(220, 180, 100, 100);

// // /// line drawing
// // c.beginPath();
// // c.moveTo(50, 300);
// // c.lineTo(300, 100);
// // c.lineTo(100, 400);
// // c.strokeStyle = "#2323fe";
// // c.stroke();

// // //arc or circle
// // // c.beginPath();
// // // c.arc(500, 300, 100, 0, Math.PI * 2, false);
// // // c.strokeStyle = "red";
// // // c.stroke();

// // for (var i = 0; i < 30; i++) {
// //   var x = Math.random() * window.innerWidth;
// //   var y = Math.random() * window.innerHeight;
// //   c.beginPath();
// //   c.arc(x, y, 100, 0, Math.PI * 2, false);
// //   c.strokeStyle = "red";
// //   c.stroke();
// // }

// // console.log(canvas);

// // c.beginPath();
// // c.arc(200, 300, 100, 0, Math.PI * 2, false);
// // c.strokeStyle = "red";
// // c.stroke();

// var x = 200;
// var dx = 10;
// var radius = 40;
// function animation() {
//   requestAnimationFrame(animation);
//   // console.log("object");
//   c.clearRect(0, 0, innerWidth, innerHeight);
//   c.beginPath();
//   c.arc(x, 200, radius, 0, Math.PI * 2, false);
//   c.strokeStyle = "red";
//   c.stroke();
//   if (x + radius > innerWidth) {
//     dx = -dx;
//   } else if (x - radius < 0) {
//     dx = +dx;
//   }

//   x += dx;
// }

// animation();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Store items (rectangles in this case)
const items = [
  { x: 50, y: 50, width: 100, height: 100 },
  { x: 200, y: 100, width: 150, height: 150 },
  { x: 400, y: 300, width: 120, height: 120 },
];

// Store selected items
let selectedItems = [];

// Variables to handle selection box
let isSelecting = false;
let selectionStart = { x: 0, y: 0 };
let selectionEnd = { x: 0, y: 0 };

// Draw all items on the canvas
function drawItems() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  items.forEach((item) => {
    ctx.fillStyle = selectedItems.includes(item)
      ? "rgba(0, 0, 255, 0.5)"
      : "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(item.x, item.y, item.width, item.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(item.x, item.y, item.width, item.height);
  });
}

// Function to detect if an item is inside the selection box
function isItemInSelection(item, selectionBox) {
  const itemLeft = item.x;
  const itemRight = item.x + item.width;
  const itemTop = item.y;
  const itemBottom = item.y + item.height;

  const selectLeft = Math.min(selectionBox.x1, selectionBox.x2);
  const selectRight = Math.max(selectionBox.x1, selectionBox.x2);
  const selectTop = Math.min(selectionBox.y1, selectionBox.y2);
  const selectBottom = Math.max(selectionBox.y1, selectionBox.y2);

  return !(
    itemRight < selectLeft ||
    itemLeft > selectRight ||
    itemBottom < selectTop ||
    itemTop > selectBottom
  );
}

// Function to draw the selection box
function drawSelectionBox() {
  if (!isSelecting) return;

  const width = selectionEnd.x - selectionStart.x;
  const height = selectionEnd.y - selectionStart.y;

  ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  ctx.strokeRect(selectionStart.x, selectionStart.y, width, height);
}

// Event listeners for mouse interaction
canvas.addEventListener("mousedown", (e) => {
  isSelecting = true;
  selectionStart = { x: e.offsetX, y: e.offsetY };
  selectionEnd = { x: e.offsetX, y: e.offsetY };
});

canvas.addEventListener("mousemove", (e) => {
  if (isSelecting) {
    selectionEnd = { x: e.offsetX, y: e.offsetY };
    drawItems(); // Redraw items
    drawSelectionBox(); // Draw the selection box
  }
});

canvas.addEventListener("mouseup", () => {
  if (isSelecting) {
    isSelecting = false;
    const selectionBox = {
      x1: selectionStart.x,
      y1: selectionStart.y,
      x2: selectionEnd.x,
      y2: selectionEnd.y,
    };

    // Update selected items
    selectedItems = items.filter((item) =>
      isItemInSelection(item, selectionBox)
    );
    drawItems(); // Redraw items with the new selection
  }
});

// Initial draw
drawItems();
