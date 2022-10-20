import { Color, OrthographicCamera, Scene, WebGLRenderer, Mesh, MeshBasicMaterial, ShapeGeometry, DoubleSide, Vector4 } from 'three';

import { Vector3, Line, LineBasicMaterial, BufferGeometry } from 'three'; //line drawing

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

import threehelv from './helvetiker_bold.typeface.json';

import { maketestdata, boxall, debugsquare } from './test'

export type Cdata = {
  entityName: string
  operationName: string
  startDate: string
  values: {
    [key: number]: number
  }
}

let canvaswidth: number, canvasheight: number;

let drawsettings = {
  'margin': 12,
  'digits': 3
}

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

const font = new FontLoader().parse(threehelv);

const textmat = new MeshBasicMaterial({
  color: colorb,
  side: DoubleSide
});

init();

animate();

function init() {
  scene.background = colora

  window.addEventListener('resize', onWindowResize);
  search.addEventListener('keydown', bigsearch);

  onWindowResize()
}

function onWindowResize() {
  canvaswidth = chart.clientWidth;
  canvasheight = chart.clientHeight;
  resizeCanvasToDisplaySize();
}

function bigsearch(event: KeyboardEvent) {
  if (event.key == "Enter") {
    drawchart(maketestdata())
    /*
    let queryurl = `/cf/${event.target.value}`
    fetch(queryurl)
      .then((response) => response.json())
      .then((data) => console.log(data))
      */
  }
}

function drawchart(data: Cdata) {
  
  scene.clear()

  let keyarraystr = Object.keys(data.values)
  let keyarray = keyarraystr.map(key => {
    return Number(key);
  });

  let valuesarray = Object.values(data.values)

  let minx = Math.min(...keyarray)
  let maxx = Math.max(...keyarray)

  let miny = Math.min(...valuesarray)
  let maxy = Math.max(...valuesarray)

  let startdate = Date.parse(data.startDate)

  let minxdate = startdate + minx * 24 * 60 * 60 * 1000
  let maxxdate = startdate + maxx * 24 * 60 * 60 * 1000

  let maxxdatestring = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(maxxdate)

  let maxxdateshape = font.generateShapes(maxxdatestring, 10)
  let maxxdategeo = new ShapeGeometry(maxxdateshape)
  let maxxmesh = new Mesh(maxxdategeo, textmat);

  let minxdatestring = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(minxdate)

  let minxdateshape = font.generateShapes(minxdatestring, 10)
  let minxdategeo = new ShapeGeometry(minxdateshape)
  let minxmesh = new Mesh(minxdategeo, textmat)

  let maxy2 = ceil2(maxy, drawsettings.digits)

  let maxy2shape = font.generateShapes(maxy2.toLocaleString(), 10)
  let maxy2geo = new ShapeGeometry(maxy2shape)

  let maxy2mesh = new Mesh(maxy2geo, textmat)

  let miny2 = floor2(miny, drawsettings.digits)

  let miny2shape = font.generateShapes(miny2.toLocaleString(), 10)
  let miny2geo = new ShapeGeometry(miny2shape)
  let miny2mesh = new Mesh(miny2geo, textmat)

  let charttitle = `${data.entityName}\n${data.operationName}`

  let charttitleshape = font.generateShapes(charttitle, 16)
  let charttitlegeo = new ShapeGeometry(charttitleshape)

  let charttitlemesh = new Mesh(charttitlegeo, textmat)

  let chartcoords = new Vector4()

  let dateaxis = new Vector4()

  let xentries

  minxdategeo.computeBoundingBox()
  maxxdategeo.computeBoundingBox()
  miny2geo.computeBoundingBox()
  maxy2geo.computeBoundingBox()
  charttitlegeo.computeBoundingBox()

  if (maxxdategeo.boundingBox) {

    maxxmesh.position.x = canvaswidth - maxxdategeo.boundingBox.max.x - drawsettings.margin

    if(miny2geo.boundingBox) {

      chartcoords.y = maxxdategeo.boundingBox.max.y + drawsettings.margin * 2 + (miny2geo.boundingBox.max.y - miny2geo.boundingBox.min.y) / 2
    
    }

    miny2mesh.position.y = maxxdategeo.boundingBox.max.y + drawsettings.margin * 2
    chartcoords.z = canvaswidth - drawsettings.margin - (maxxdategeo.boundingBox.max.x - maxxdategeo.boundingBox.min.x) / 2
    
  }

  if (charttitlegeo.boundingBox) {

    maxy2mesh.position.y = canvasheight - drawsettings.margin - charttitlegeo.boundingBox.max.y
    charttitlemesh.position.y = canvasheight - drawsettings.margin - charttitlegeo.boundingBox.max.y

    if (maxy2geo.boundingBox) {

      if (minxdategeo.boundingBox) {
  
        chartcoords.x = maxy2geo.boundingBox.max.x + drawsettings.margin * 2 + (minxdategeo.boundingBox.max.x - minxdategeo.boundingBox.min.x) / 2
    
      }
  
      charttitlemesh.position.x = maxy2geo.boundingBox.max.x + drawsettings.margin * 2
      minxmesh.position.x = maxy2geo.boundingBox.max.x + drawsettings.margin * 2
      
      chartcoords.w = canvasheight - drawsettings.margin + (maxy2geo.boundingBox.max.y - maxy2geo.boundingBox.min.y) / 2 - charttitlegeo.boundingBox.max.y
  
    }

  }

  if (maxxdategeo.boundingBox && maxy2geo.boundingBox && minxdategeo.boundingBox) {
    
    dateaxis.x = maxy2geo.boundingBox.max.x + drawsettings.margin * 2 + (minxdategeo.boundingBox.max.x - minxdategeo.boundingBox.min.x) / 2
    dateaxis.z = canvaswidth - drawsettings.margin - (maxxdategeo.boundingBox.max.x - maxxdategeo.boundingBox.min.x) / 2
    xentries = Math.floor((dateaxis.z - dateaxis.x) / (Math.max(minxdategeo.boundingBox.max.x, maxxdategeo.boundingBox.max.x) + drawsettings.margin * 5))
  }

  dateaxis.y = drawsettings.margin
  dateaxis.w = drawsettings.margin
  
  minxmesh.position.y = drawsettings.margin
  maxxmesh.position.y = drawsettings.margin
  maxy2mesh.position.x = drawsettings.margin
  miny2mesh.position.x = drawsettings.margin

  let chartpoints = []

  for (let key in data.values) {

    chartpoints.push(new Vector3(((Number(key) - minx) / (maxx - minx)) * (chartcoords.z - chartcoords.x) + chartcoords.x, ((data.values[key] - miny2) / (maxy2 - miny2)) * (chartcoords.w - chartcoords.y) + chartcoords.y, 0))

  }

  let chartbg = new BufferGeometry().setFromPoints(chartpoints)

  let chartline = new Line(chartbg, linemat)

  if (!xentries) {
    xentries = 0
  }

  
  scene.add(maxxmesh);
  scene.add(minxmesh);

  scene.add(maxy2mesh)
  scene.add(miny2mesh)

  scene.add(charttitlemesh)

  //boxall(scene)

  scene.add(chartline);


  for (let n = xentries; n > 0; n--) {
    let progressx = n / (xentries + 1)
    let midx = progressx * (dateaxis.z - dateaxis.x) + dateaxis.x
    let curx = progressx * (maxx - minx) + minx
    let curdate = startdate + curx * 24 * 60 * 60 * 1000

    let curdatestring = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(curdate)

    let curdateshape = font.generateShapes(curdatestring.toString(), 10)

    let curdategeo = new ShapeGeometry(curdateshape)

    let curmesh = new Mesh(curdategeo, textmat)

    curdategeo.computeBoundingBox()
    
    if(curdategeo.boundingBox) {
      curmesh.position.x = midx - (curdategeo.boundingBox.max.x - curdategeo.boundingBox.min.x) / 2
      curmesh.position.y = drawsettings.margin
    }

    scene.add(curmesh)
    //debugsquare(new Vector4(midx, 0, midx, 20), scene)

  }

  //debugsquare(chartcoords, scene)
  //debugsquare(new Vector4(0, 0, canvaswidth, canvasheight), scene)
  //debugsquare(dateaxis, scene)
}

function ceil2(n: number, d: number) {

  return Math.ceil(n / Math.pow(10, Math.floor(Math.log10(Math.abs(n))) + 1 - d)) * Math.pow(10, Math.floor(Math.log10(Math.abs(n))) + 1 - d)

}

function floor2(n: number, d: number) {

  return Math.floor(n / Math.pow(10, Math.floor(Math.log10(Math.abs(n))) + 1 - d)) * Math.pow(10, Math.floor(Math.log10(Math.abs(n))) + 1 - d)

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
  renderer.setSize(canvaswidth, canvasheight);
}

//-128 to 127 Int8Array
//-32,768 to 32,767 Iint16Array
//-2,147,483,648 to 2,147,483,647 Int32Array
//-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 BigInt64Array