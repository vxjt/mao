//if rendering is weird the camera is at 0.

'use strict';

import * as THREE from 'three';

//import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
//import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';


let line;

const chart = document.querySelector('#chart') as HTMLElement;
const search = document.querySelector('#search') as HTMLElement;
const style = getComputedStyle(document.body)
const colora = new THREE.Color(style.getPropertyValue('background-color'))
const colorb = new THREE.Color(style.getPropertyValue('color'))

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    canvas: chart,
    antialias: true
});

//set up camera & scene
const camera = new THREE.OrthographicCamera(0, chart.clientWidth, chart.clientHeight, 0, 0, 1);
//l, t, -n --- r, t, -n
//   |           |
//l, b, -n -- r, b, -n
//l>r x
//b>t y

init();

animate();

function init() {
    resizeCanvasToDisplaySize();

    //create geometry
    const linebg = new THREE.BufferGeometry();
    const linemat = new THREE.LineBasicMaterial({ color: colorb });

    const points = [];

    for (let i = 0; i <= 50; i++) {
        const point = new THREE.Vector3();
        point.x = i / 50 * camera.right * 2;
        point.y = Math.random() * camera.top * 2;
        point.z = 0;
        points.push(point.x, point.y, point.z);
    }

    console.log(points);

    linebg.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    line = new THREE.Line(linebg, linemat);
    scene.add(line);
    scene.background = colora;

    //hook events
    window.addEventListener('resize', onWindowResize);
    search.addEventListener('keydown', bigsearch);
}

function onWindowResize() {
    resizeCanvasToDisplaySize();
}

function bigsearch(event:any) {
    if (event.key == "Enter"){
        let queryurl = `/cf/${event.target.value}`
        fetch(queryurl)
        .then((response) => response.json())
        .then((data) => console.log(data))
    }
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
