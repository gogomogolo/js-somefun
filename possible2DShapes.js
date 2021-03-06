const directions = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:-1}, {x:0, y:1}, {x:1, y:1}, {x:1, y:-1}, {x:-1, y:1}, {x:-1, y:-1}]
const keygen = (x,y) => `${x}:${y}`;
const vectoralKeyElement = (x,y) => `x:${x}-y:${y}|`;

const getNeighbours = shape => {
    //1- Generate a set from point of shape by using a key generator called keygen
    const filterSet = new Set();
    shape.forEach(point => filterSet.add(keygen(point.x, point.y)));
    //2- For each point in shape, filtering neighbour points using generated set to create a map by using keygen
    const neighbours = {};
    for (const point of shape) {
        for (const direction of directions) {
            const neighbour = {x: point.x + direction.x, y: point.y + direction.y};
            const key = keygen(neighbour.x, neighbour.y);
            if (!filterSet.has(key)) neighbours[key] = neighbour;
        }
    }
    //3- Convert map to list and return
    return Object.values(neighbours);
}

const constructKey = shape => {
    //1- sort points in shape respect to x and y
    const sortedPoints = shape.sort((p1, p2) => p1.x === p2.x ? p1.y - p2.y: p1.x - p2.x);
    //2- create vectoral key for shape key: x:1-y:2|
    let key = '';
    for (let i=1; i<sortedPoints.length; i++){
        key += vectoralKeyElement(shape[i].x - shape[i-1].x, shape[i].y - shape[i-1].y);
    }
    return key === '' ? vectoralKeyElement(shape[0].x, shape[0].y): key;
    //3- return the key
}

const possible2DShapes = (shape, foundedShapes, maxUnits) => {
    //1- if shape length is equal to max return
    if (shape.length <= maxUnits){
        const key = constructKey(shape);
        if (foundedShapes[key] !== undefined)
            return;
        foundedShapes[key] = [...shape];

    }
    else {
        return;
    }
    //2- find possible neighbours as a point
    const neighbours = getNeighbours(shape);
    //3- for each neighbour create new shape
    // if shape is constructed before continue with next shape
    // else memorize shape and call shape with possible2DShapes
    for (const neighbour of neighbours) {
        const shapeStub = [...shape, neighbour];
        const key = constructKey(shapeStub);
        if (foundedShapes[key] !== undefined)
            continue;
        possible2DShapes([...shapeStub], foundedShapes, maxUnits);
    }
}

function main(){
    const foundShapes = {};
    const MAX_UNITS = 5;
    possible2DShapes([{x: 0, y:0}], foundShapes, MAX_UNITS);
    const shapes = Object.values(foundShapes);
    const shifts = [];
    for (let i=0; i<shapes.length; i++){
        const shape = shapes[i];
        let minX = Number.MAX_SAFE_INTEGER;
        let minY = Number.MAX_SAFE_INTEGER;
        for (let j=0; j<shape.length; j++){
            const point = shape[j];
            if (minX > point.x) minX = point.x;
            if (minY > point.y) minY = point.y;
        }
        shifts.push({x: minX, y: minY});
    }

    const shiftedShapes = [];
    for (let i=0; i<shapes.length; i++){
        const shape = shapes[i];
        const shift = shifts[i];
        const shiftedShape = [];
        for (let j=0; j<shape.length; j++){
            const point = {...shape[j]};
            point.x += Math.abs(shift.x);
            point.y += Math.abs(shift.y);
            shiftedShape.push(point);
        }
        shiftedShapes.push(shiftedShape);
    }

    for (let i=0; i<shiftedShapes.length; i++){
        const shape = [...shiftedShapes[i]];
        const x = shape[shape.length-1].x-shape[0].x
        shape.sort((p1, p2) => p1.y === p2.y ? p1.x - p2.x: p1.y - p2.y);
        const y = shape[shape.length-1].y-shape[0].y
        shiftedShapes[i].push({x: x, y: y});
    }

    for (let i=0; i<shiftedShapes.length; i++){
        const shape = shiftedShapes[i];
        let line = '';
        let result = '';
        let offset = -1;
        const filterSet = new Set();
        for (let j=0; j<shape.length-1; j++){
            if (!filterSet.has(shape[j].x)){
                filterSet.add(shape[j].x);
                result += `${line}\n`;
                line = '';
                offset = -1;
            }
            let spaceCount = shape[j].y - offset -1;
            offset = shape[j].y;
            while (spaceCount !== 0){
                line += ' ';
                spaceCount--;
            }
            line += 'Q';
            if (j===shape.length-2){
                result += `${line}\n`;
            }
        }
        console.log(result);
    }
}

main();
