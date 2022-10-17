//import * as THREE from 'three';
import { Color, Vector3, OrthographicCamera, Scene, WebGLRenderer, Line, LineBasicMaterial, BufferGeometry, Mesh, MeshBasicMaterial, ShapeGeometry, DoubleSide} from 'three';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

import threehelv from './helvetiker_bold.typeface.json';

const chart = document.querySelector('#chart') as HTMLElement;
const search = document.querySelector('#search') as HTMLElement;
const style = getComputedStyle(document.body)
const colora = new Color(style.getPropertyValue('background-color'))
const colorb = new Color(style.getPropertyValue('color'))

//(l, r, t, b), l>r x, b>t y.
//l, t, -n -- r, t, -n
//   |           |
//l, b, -n -- r, b, -n
const camera = new OrthographicCamera(0, chart.clientWidth, chart.clientHeight, 0, 0, 1);

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
  resizeCanvasToDisplaySize();

  scene.add(line);
  scene.add(text);

  scene.background = colora;

  window.addEventListener('resize', onWindowResize);
  search.addEventListener('keydown', bigsearch);
}

function onWindowResize() {
  resizeCanvasToDisplaySize();
}

function bigsearch(event: any) {
  if (event.key == "Enter") {
    let queryurl = `/cf/${event.target.value}`
    fetch(queryurl)
      .then((response) => response.json())
      .then((data) => console.log(data))
  } else if (event.key == "ArrowUp") {
    updatetext(event.target.value)
  } else if (event.key == "ArrowDown") {
    updatelines()
    console.log(scene)
  }
}

function updatetext(msg:string) {
  const textshape = font.generateShapes(msg, 20);
  const textgeo = new ShapeGeometry(textshape);
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
  requestAnimationFrame(animate);
  render();
}

function resizeCanvasToDisplaySize() {
  camera.updateProjectionMatrix(); //updates camera settings
  renderer.setSize(chart.clientWidth, chart.clientHeight);
}

//-128 to 127 Int8Array
//-32,768 to 32,767 Iint16Array
//-2,147,483,648 to 2,147,483,647 Int32Array
//-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 BigInt64Array