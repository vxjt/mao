import { generateUUID } from "three/src/math/MathUtils"

export var testdata: any = {}

maketestdata()

function maketestdata() {

    testdata.entityName = generateUUID()
    testdata.operationName = generateUUID()
    testdata.values = {}
    
    for (let d = Math.ceil(Math.random() * 1000); d > 0; d--) {
        testdata.values[maketestdate()] = Math.floor(Math.random() * 1000000000000)
    }

}

function maketestdate() {
    //2009-09-26
    const ryear = 1800 + Math.ceil(Math.random() * 350)
    const rmonth = Math.ceil(Math.random() * 12)
    const rday = Math.ceil(Math.random() * 28)
    //let tdate = new Date(Date.UTC(ryear, rmonth, rday))
    //let stringtest:string = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium'}).format(tdate)
    return `${ryear}-${rmonth.toString().padStart(2, '0')}-${rday.toString().padStart(2, '0')}`
}