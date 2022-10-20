import { BoxHelper, Scene, Vector3, BufferGeometry, Line, LineBasicMaterial, Vector4 } from "three"
import { generateUUID } from "three/src/math/MathUtils"
import { Cdata } from './main'

export function maketestdata() {
    let testdata: Cdata = {
        entityName: generateUUID(),
        operationName: generateUUID(),
        startDate: maketestdate(),
        values: {}
    }

    for (let d = Math.ceil(Math.random() * 800); d > 0; d = d - Math.ceil(Math.random() * 3)) {
        testdata.values[d] = Math.floor(Math.random() * 1000000000000)
    }

    return testdata

}

function maketestdate() {
    const ryear = 1800 + Math.ceil(Math.random() * 350)
    const rmonth = Math.ceil(Math.random() * 12)
    const rday = Math.ceil(Math.random() * 28)
    return `${ryear}-${rmonth.toString().padStart(2, '0')}-${rday.toString().padStart(2, '0')}`
}

export function boxall(sc: Scene) {
    for (let bg in sc.children) {
        let box = new BoxHelper(sc.children[bg], 0xffff00)
        sc.add(box)
    }
}

export function debugsquare(c: Vector4, sc: Scene) {
    let linepoints = [];

    linepoints.push(new Vector3(c.x, c.y, 0))
    linepoints.push(new Vector3(c.x, c.w, 0));
    linepoints.push(new Vector3(c.z, c.w, 0));
    linepoints.push(new Vector3(c.z, c.y, 0));
    linepoints.push(new Vector3(c.x, c.y, 0))

    let borderbg = new BufferGeometry().setFromPoints(linepoints)

    let border = new Line(borderbg, new LineBasicMaterial({ color: 0x0000ff }))
    sc.add(border)
}