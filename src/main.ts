//import * as THREE from 'three';
import { Color, Vector3, OrthographicCamera, Scene, WebGLRenderer, Line, LineBasicMaterial, BufferGeometry, Mesh, MeshBasicMaterial, ShapeGeometry, DoubleSide} from 'three';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

import threehelv from './helvetiker_bold.typeface.json';

import { testdata } from './test'

let canvaswidth: number, canvasheight: number;

let drawsettings = {'margin': 15}

const chart = document.querySelector('#chart') as HTMLElement;
const search = document.querySelector('#search') as HTMLElement;
const style = getComputedStyle(document.body)
const colora = new Color(style.getPropertyValue('background-color'))
const colorb = new Color(style.getPropertyValue('color'))

//(l, r, t, b), l>r x, b>t y.
//l, t, -n -- r, t, -n
//   |           |
//l, b, -n -- r, b, -n
const camera = new OrthographicCamera(0, 843, 322, 0, 0, 1);

const scene = new Scene();

const renderer = new WebGLRenderer({
  canvas: chart,
  antialias: true
});

const linemat = new LineBasicMaterial({ color: colorb });
const linebg = new BufferGeometry()

const line = new Line(linebg, linemat);

const font = new FontLoader().parse(threehelv);

const textmat = new MeshBasicMaterial({
  color: colorb,
  side: DoubleSide
});

const text = new Mesh(new BufferGeometry(), textmat);

init();

animate();

function init() {
  scene.add(line);
  scene.add(text);

  scene.background = colora;

  window.addEventListener('resize', onWindowResize);
  search.addEventListener('keydown', bigsearch);
  
  onWindowResize()
}

function onWindowResize() {
  canvaswidth = chart.clientWidth;
  canvasheight = chart.clientHeight;
  resizeCanvasToDisplaySize();
}

const testx = Math.random() * 100 //2015-09-26
const testy = Math.floor(Math.random() * 100000000000) //
const testsf = Math.floor(Math.random() * 100)

function testmethod1() {
  let errorvar
  for(let i =0 ; i < 10000; i++) {
    let height = testy + testsf * 3 + (canvasheight % testsf) / (Math.floor(canvasheight / (testy + testsf * 3)))
    let width = testx + testsf * 4 + (canvaswidth % testsf) / (Math.floor(canvaswidth / (testx + testsf * 4)))
    errorvar =+ height + width
//y label height: y + sf * 3 + (chart.clientheight % sf) / (floor(chart.clientheight / (y + sf * 3)))
//x label width: x + sf * 4 + chart.clientwidth % sf / (floor(chart.clientwidth / (x + sf * 4)))
 }
 return errorvar
}

/*
function testmethod2() {
  let errorvar
  for(let i =0 ; i < 10000; i++) {
    let height = testy + testsf * 3 + (canvasheight % testsf) / (newfloor(canvasheight / (testy + testsf * 3)))
    let width = testx + testsf * 4 + (canvaswidth % testsf) / (newfloor(canvaswidth / (testx + testsf * 4)))
    errorvar =+ height + width
//y label height: y + sf * 3 + (chart.clientheight % sf) / (floor(chart.clientheight / (y + sf * 3)))
//x label width: x + sf * 4 + chart.clientwidth % sf / (floor(chart.clientwidth / (x + sf * 4)))
 }
 return errorvar
}

console.time();
console.log(testmethod1())
console.timeEnd();
console.time();
//console.log(testmethod2())
console.timeEnd();

*/

function bigsearch(event:KeyboardEvent) {
  if (event.key == "Enter") {
    drawchart(testdata)
    /*
    let queryurl = `/cf/${event.target.value}`
    fetch(queryurl)
      .then((response) => response.json())
      .then((data) => console.log(data))
      */
  }
}

function drawchart(data:Object) {
  console.log(data, drawsettings)
}

//Text needs to be done before lines.  Sizing and alignment of text is much more involved than geometry.
//operation name
//company
//y values
//x values
//more x and y values will be supplied than needs to be rendered, so we need to decide what sample to render as well.
//first problem: given an amount of x y values what do you decide to show
//get x range
//get y range
//available element size
//y original height = textgeo.boundingBox.max.y - textgeo.boundingBox.min.y
//y original width = textgeo.boundingBox.max.x - textgeo.boundingBox.min.x
//y label height: y + sf * 3 + (chart.clientheight % sf) / (floor(chart.clientheight / (y + sf * 3)))
//x label width: x + sf * 4 + chart.clientwidth % sf / (floor(chart.clientwidth / (x + sf * 4)))
//---
//get y range


function updatetext(msg:string) {
  const textshape = font.generateShapes(msg, 20);
  const textgeo = new ShapeGeometry(textshape);
  textgeo.computeBoundingBox()
  console.log(textgeo.boundingBox)
  text.geometry = textgeo
}

function updatelines() {
  //update only vertexes
  let linepoints = [];
  linepoints.push( new Vector3(0, Math.random() * 150, 0) );
  linepoints.push( new Vector3(400, Math.random() * 200, 0 ) );
  linepoints.push( new Vector3(800, Math.random() * 250, 0 ) );
  linebg.setFromPoints(linepoints)
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  //updatelines()
  requestAnimationFrame(animate);
  render();
}

function resizeCanvasToDisplaySize() {
  camera.updateProjectionMatrix(); //updates camera settings
  renderer.setSize(canvaswidth, canvasheight);
}

//-128 to 127 Int8Array
//-32,768 to 32,767 Iint16Array
//-2,147,483,648 to 2,147,483,647 Int32Array
//-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 BigInt64Array