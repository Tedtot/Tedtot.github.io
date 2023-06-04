var garbage = document.getElementsByClassName("garbage");
var recycle = document.getElementsByClassName("recycle");
var compost = document.getElementsByClassName("compost");

var garbageUI = 
    [
      "https://clipart-library.com/images_k/cup-of-lean-transparent/cup-of-lean-transparent-22.png",
      "https://static.thenounproject.com/png/1359370-200.png",
      "https://clipart-library.com/data_images/463488.png",
      "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/33592/potato-chips-clipart-xl.png",
      "https://clipartix.com/wp-content/uploads/2016/05/Hot-coffee-cup-clipart-image.png"
    ];
var recycleUI = 
    [
      "https://clipart-library.com/img/1856864.png",
      "https://clipartix.com/wp-content/uploads/2016/04/Primary-writing-paper-clipart.png",
      "https://www.freepnglogos.com/uploads/box-png/box-png-transparent-google-objects-pinterest-9.png",
      "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/23624/soda-can-clipart-xl.png",
      "https://www.pngmart.com/files/16/Translucent-Glass-Bottle-PNG-Clipart.png"
    ];
var compostUI = 
    [
      "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/59740/pizza-box-clipart-md.png",
      "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/7821764/tree-branch-clipart-xl.png",
      "https://www.pngkit.com/png/full/293-2931363_shell-clipart-transparent-background-cracked-egg-shell-clipart.png",
      "https://github.com/Tedtot/Tedtot.github.io/banana.png",
      "https://www.freepnglogos.com/uploads/plate-png/plate-aspen-paper-products-25.png"
    ];

var gameButton = document.getElementById("gamebutton");
var bins = [document.getElementById("trashBin"), document.getElementById("recycleBin"), 
            document.getElementById("compostBin")];
var pointText = document.getElementById("points");
var timer = document.getElementById("timer");
var gameActive = false;

var a;
var timeout;
var points;

function startGame() {
  
  //Resetting from last game
  points = 0;
  pointText.innerHTML = "Points: 0";
  
  for (var i = garbage.length - 1; i > 0; i--) garbage[i].remove(); 
  for (var i = recycle.length - 1; i > 0; i--) recycle[i].remove();
  for (var i = compost.length - 1; i > 0; i--) compost[i].remove();

  if (gameActive) {
    endGame(false);
    return;
  }
  
  gameActive = true;
  gameButton.innerHTML = "End Game";
  a = Date.now();
  timeout = setInterval(displayTimer, 100);
  
  for (var i = 0; i < Math.floor(Math.random() * 8) + 5; i++) {
    var clone;
    var ui;
    var rand = Math.random() * 3;
    if (rand < 1) {
      clone = garbage[0].cloneNode(true);
      ui = garbageUI[Math.floor(Math.random() * garbageUI.length)];
      garbage[0].parentNode.appendChild(clone);
    }
    
    else if (rand < 2){
      clone = recycle[0].cloneNode(true);
      ui = recycleUI[Math.floor(Math.random() * recycleUI.length)];
      recycle[0].parentNode.appendChild(clone);
    }
    
    else {
      clone = compost[0].cloneNode(true);
      ui = compostUI[Math.floor(Math.random() * compostUI.length)];
      compost[0].parentNode.appendChild(clone);
    }

    clone.style.top = Math.round(Math.random() * document.body.offsetHeight + 250) + 'px';
    clone.style.left = Math.round(Math.random() * document.body.offsetWidth) + 'px';
    clone.style.opacity = 1;
    clone.src = ui;
    dragElement(clone);
  }
}

function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(element.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(element.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    Array.from(bins).forEach((bin) => {
      doElementsCollide(element, bin);
    });    
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function doElementsCollide(el1, el2) {
    el1.offsetBottom = el1.offsetTop + el1.offsetHeight;
    el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
    el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
    el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

    if (!((el1.offsetBottom < el2.offsetTop) ||
             (el1.offsetTop > el2.offsetBottom) ||
             (el1.offsetRight < el2.offsetLeft) ||
             (el1.offsetLeft > el2.offsetRight))) 
    {
      doAction(el1, el2);
    }
}

function doAction(element, bin) {
  var binID = bin.getAttribute('id');
  var elementClass = element.getAttribute('class');
  element.remove();
  
  if (binID == "trashBin" && elementClass == "garbage")
     changePoints(5);
  else if (binID == "recycleBin" && elementClass == "recycle")
     changePoints(10);
  else if (binID == "compostBin" && elementClass == "compost")
     changePoints(8);
  else changePoints(-8);
  
  pointText.innerHTML = "Points: " + points;
  if (garbage.length <= 1 && recycle.length <= 1 && compost.length <= 1) endGame(true);
}

function changePoints(amount) {
  points += amount;
}

function endGame(isFinished) {
  if (isFinished) timer.innerHTML = "Time: " + (Date.now() - a) / 1000;

  clearInterval(timeout);
  gameButton.innerHTML = "Start Game";
  gameActive = false;
}

function displayTimer() {
  time = Math.round(((Date.now() - a) / 1000) * 10) / 10;
  timer.innerHTML = "Time: " + time;
}

function activateMenuItem(index) {
  var menuItems = document.querySelectorAll('#menu li a');
  for (var i = 0; i < menuItems.length; i++) {
    menuItems[i].classList.remove('active');
  }
  menuItems[index].classList.add('active');
}
