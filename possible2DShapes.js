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
    const MAX_UNITS = 4;
    possible2DShapes([{x: 0, y:0}], foundShapes, MAX_UNITS);
    const shapes = Object.values(foundShapes);
    return;
}

main();
