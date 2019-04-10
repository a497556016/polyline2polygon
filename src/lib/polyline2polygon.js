import calculation from './calculation'

function fromLinePoints(points, width = 5) {
    width = width / 100000;
    const polygons = [];
    points.forEach((point, i) => {
        if (i === 0) {
            return;
        }
        const prev = points[i - 1];

        const angle = calculation.angleR(prev, point);
        // console.log(`angle = ${angle}, r = ${angle * 180 / Math.PI} deg`);

        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // 网上和往下区别对待，使单边保持一致
        //sin > 0 时，从启点的上方开始
        //sin < 0时，从起点的下方开始
        let a = 1, b = 1;
        if(prev.x < point.x) {
            a = -1; b = 1;
        }else {
            a = 1; b = -1;
        }
        /*if(sin > 0) {
            if(prev.x < point.x) {
                a = -1; b = 1;
            }else {
                a = 1; b = -1;
            }
        }else {
            if(prev.x < point.x) {
                a = -1; b = 1;
            }else {
                a = 1; b = -1;
            }
        }*/
        let poly = [
                calculation.addPoint(prev, {x: a * width * sin, y: b * width * cos}),
                calculation.addPoint(point, {x: a * width * sin, y: b * width * cos}),
                calculation.addPoint(point, {x: -a * width * sin, y: -b * width * cos}),
                calculation.addPoint(prev, {x: -a * width * sin, y: -b * width * cos}),
            ]
            //.map(roundPoint)
        ;
        polygons.push(poly);
    });

    const inside = [], outside = [];
    //取相交点
    polygons.forEach((polygon, i) => {

        //起点
        if(i == 0) {
            inside.push(polygon[0]);
            outside.push(polygon[3]);
            return;
        }
        const poly1 = polygons[i-1];
        const poly2 = polygon;

        // 内边交点
        const middle1 = calculation.intersection(poly1[0], poly1[1], poly2[0], poly2[1]);
        inside.push(middle1);
        // 外边交点
        const middle2 = calculation.intersection(poly1[2], poly1[3], poly2[2], poly2[3]);
        outside.push(middle2);

        //终点
        if(i == polygons.length - 1){
            inside.push(polygon[1]);
            outside.push(polygon[2]);
        }
    })

    const lines = inside.concat(outside.reverse());//mars3d.draw.utils.getPositionsWithHeight(left.concat(right.reverse()), 10);

    // console.log(inside, outside, lines);

    console.log(JSON.stringify(lines.map(l => [l.x, l.y])))
    return lines;
}

function fromArrPoints(arrPoints) {
    const points = arrPoints.map(p => {
        return {x: p[0], y: p[1], z: 0};
    });
    const paths = lineToPolygons(points);

    return paths;
}


/**
 * 过滤多余的坐标点
 * @param paths
 * @returns {*}
 */
function filterPaths(paths){
    if(paths.length <= 2){
        return paths;
    }
    const filtered = [];

    let index = 0;

    function compute(i){
        if(index+i+1>paths.length-1){
            filtered.push(paths[index]);
            filtered.push(paths[paths.length-1])
            return;
        }

        let path1 = paths[index], path2 = paths[index+i], path3 = paths[index+i+1];
        if(calculation.compare(path1, path2, path3)){//如果夹角很大，近似为直线
            compute(++i);
        }else{
            index = index + i;
            filtered.push(path1);
            compute(1);
        }
    }

    compute(1);

    return filtered;
}


export default {
    filterPaths,
    fromLinePoints,
    fromArrPoints
}