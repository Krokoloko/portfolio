console.log('hello world');

let pause = true;
let linearfunc = new Line(0,0);

let webHeight = window.innerHeight;
let webWidth = window.innerWidth;

let scene, render, camera, drawCount, positions, navigation, canRotate, canMove;

let line = {};

//html

//input elements
const StartButton = document.getElementById('switch');
const AInp = document.getElementById('A');
const BInp = document.getElementById('B');
const yInterceptInp = document.getElementById('yInt');
const spreadInp = document.getElementById('spread');
const stepInp = document.getElementById('step');
const speedInp = document.getElementById('speed');

const valueEdits = document.getElementsByTagName('input');

//etc
// const slider = document.getElementById('phonenumber');
// const displayNumber = document.getElementById('displayNumber');
const navBar = document.getElementById('nav');

//three js
scene = new THREE.Scene();
render = new THREE.WebGLRenderer();
camera = new THREE.PerspectiveCamera(45,webWidth/webHeight,1,1000000000);
navigation = new ThreeNavigator(camera);
console.log(render);


//html events

for (var i = 0; i < valueEdits.length; i++) {
  valueEdits[i].onchange = function(){
    OnUpdateValues();
  }
}

StartButton.onclick = function(){
  OnUpdateValues();
  OnPause();
  StartButton.value = "Pause";
}



// delegates
let OnUpdateValues = function(){
  console.log('updated values');
  line.A = AInp.value || 1;
  line.B = BInp.value || 1;
  line.yIntercept = yInterceptInp.value || 0;
  line.spread = spreadInp.value || 200;
  line.x = -(line.spread/2);
  line.step = stepInp.value || 1;
  line.speed = speedInp.value || 1;

}

let OnPause = function(){
  console.log('switch');
  pause = !pause;
};

let OnWebResize = function(){
  webWidth = window.innerWidth;
  webHeight = window.innerHeight;
  console.log('On resize');
};

function setUp(){
  //Three setup
  OnUpdateValues();
  render.setPixelRatio( window.devicePixelRatio );
  render.setSize(webWidth,webHeight-nav.offsetHeight);

  render.domElement.onmousedown = function(){
    canRotate = true;
  };

  render.domElement.onmousemove = function(e){
    if(canRotate){
      navigation.rotate(e.movementY/100,e.movementX/100);
    }
  };
  render.domElement.onmouseover = function(){
    canMove = true;
    console.log(canMove);
  };
  render.domElement.onkeypress = function(e){
    if(canMove){
      let x=y=z=0;
      switch(true){
        case (e.key == 'a' || e.key == 'A' || e.key == 'ArrowRight'):
          x = -1;
          break;
        case (e.key == 'd' || e.key == 'D' || e.key == 'ArrowLeft'):
          x = 1;
          break;
        case (e.key == 's' || e.key == 'S' || e.key == 'ArrowDown'):
          z = -1;
          break;
        case (e.key == 'w' || e.key == 'W' || e.key == 'ArrowUp'):
          z = 1;
          break;
        case (e.key == 'Spacebar'):
          y = 1;
          break;
        case (e.key == 'Spacebar' && e.altKey):
          y = -1;
          break;
      }
      navigation.move(x,y,z);
    }
  }
  render.domElement.onmouseout = function(){
    canMove = false;
  };

  render.domElement.onmouseup= function(){
    canRotate = false;
  };

  document.body.appendChild(render.domElement);
  camera.position.set(0,0,2000);

  line.geometry = new THREE.BufferGeometry();
  positions = new Float32Array(line.spread*3);

  line.material = new THREE.LineBasicMaterial({color: 0x00ffff, linewidth: 3});

  line.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

  drawCount = 2;
  line.geometry.setDrawRange(0,drawCount);

  line.mesh = new THREE.Line(line.geometry,line.material);


  scene.add(line.mesh);
  render.render(scene,camera);

  console.log(line.mesh.geometry.attributes.position);
  loop();
}

function updatePos(){
  let x=y=z=index=0;

  x = line.x;
  y = x*line.A*line.B+line.yIntercept;

  positions = line.mesh.geometry.attributes.position.array;

  for(let i = 0; i < line.spread;i+=1){
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;

    x = line.x;
    y = x*line.A*line.B+line.yIntercept;
    // y= Math.tan(x)*x;+line.yIntercept;
    z = 0;

    line.x++;
  }


}

function loop(){
  requestAnimationFrame(loop);
  // displayNumber.value = slider.value;
  // console.log('loop');

  if(webWidth != window.innerWidth || webHeight != window.innerHeight){
    OnWebResize();
  }
  if(!pause) {
    // line.mesh.geometry.vertices.push(new THREE.Vector3(line.x,line.A*line.x*line.B+line.yIntercept,0));

    drawCount = (drawCount + 1) % line.spread;

    line.mesh.geometry.setDrawRange(0,drawCount);

    if(drawCount === 0){
      OnUpdateValues();

      updatePos();

      line.geometry.attributes.position.needsUpdate = true;
    }



  }
  render.render(scene,camera);
}

setUp();
