import Calculation from './calculation'


function Polyline2polygon() {
    this.calculation = new Calculation();
};

Polyline2polygon.prototype.fromLinePoints = function (points, width = 5) {
    //将宽度转换为经纬度偏移值
    var earthRadius = 6371008.8; //地球半径
    var degrees = (width/earthRadius) % (2 * Math.PI);
    width = degrees * 180 / Math.PI;

    const polygons = [];
    points.forEach((point, i) => {
        if (i === 0) {
            return;
        }
        const prev = points[i - 1];

        const angle = this.calculation.angleR(prev, point);
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
                this.calculation.addPoint(prev, {x: a * width * sin, y: b * width * cos}),
                this.calculation.addPoint(point, {x: a * width * sin, y: b * width * cos}),
                this.calculation.addPoint(point, {x: -a * width * sin, y: -b * width * cos}),
                this.calculation.addPoint(prev, {x: -a * width * sin, y: -b * width * cos}),
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

            //当仅有一条线段时
            if(polygons.length == 1) {
                inside.push(polygon[1]);
                outside.push(polygon[2]);
            }
            return;
        }
        const poly1 = polygons[i-1];
        const poly2 = polygon;

        // 内边交点
        const middle1 = this.calculation.intersection(poly1[0], poly1[1], poly2[0], poly2[1]);
        inside.push(middle1);
        // 外边交点
        const middle2 = this.calculation.intersection(poly1[2], poly1[3], poly2[2], poly2[3]);
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

Polyline2polygon.prototype.arrToObjPoints = function (arrPoints) {
    const points = arrPoints.map(p => {
        return {x: p[0], y: p[1], z: p.length == 3?p[2]:0};
    });
    return points;
}

Polyline2polygon.prototype.fromArrPoints = function (arrPoints, width = 5) {
    const points = this.arrToObjPoints(arrPoints);
    const paths = this.fromLinePoints(points, width);

    return paths;
}

export default Polyline2polygon