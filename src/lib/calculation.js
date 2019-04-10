/**
 * 计算相交点，只支持经纬度计算
 * @param a
 * @param b
 * @param c
 * @param d
 * @returns {*}
 */
function intersection(a, b, c, d){
    /** 1 解线性方程组, 求线段交点. **/
        // 如果分母为0 则平行或共线, 不相交
    var denominator = (b.y - a.y)*(d.x - c.x) - (a.x - b.x)*(c.y - d.y);
    if (denominator==0) {
        return false;
    }

    // 线段所在直线的交点坐标 (x , y)
    var x = ( (b.x - a.x) * (d.x - c.x) * (c.y - a.y)
        + (b.y - a.y) * (d.x - c.x) * a.x
        - (d.y - c.y) * (b.x - a.x) * c.x ) / denominator ;
    var y = -( (b.y - a.y) * (d.y - c.y) * (c.x - a.x)
        + (b.x - a.x) * (d.y - c.y) * a.y
        - (d.x - c.x) * (b.y - a.y) * c.y ) / denominator;

    //忽略是否在线段上相交
    return {
        x:  x,
        y:  y,
        z: a.z||0
    };

    /** 2 判断交点是否在两条线段上 **/
    if (
        // 交点在线段1上
        (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
        // 且交点也在线段2上
        && (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
    ){

        // 返回交点p
        return {
            x :  x,
            y :  y
        }
    }
    //否则不相交
    return false

}

//计算角度
function angleR(a, b) /* radians */ {
    return Math.atan((b.y - a.y) / (b.x - a.x));
}

//两点偏移量相加
function addPoint(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z||0
    }
}

//比较3点连接的折线角度是否近似直线以及距离是否很近
function compare3Point(path1, path2, path3){
    // console.log(path1, path2, path3);

    //计算弧度
    const a1 = Math.atan((path2.x-path1.x)/(path2.y-path1.y));
    const a2 = Math.atan((path3.x-path2.x)/(path3.y-path2.y));

    //计算夹角
    const a = Math.abs((a1 + a2)*(180/Math.PI));
    console.log('角度：', a);
    if(Number.isNaN(a) || a > 150){
        return true;
    }else{
        const l = getDistance(path1.y, path1.x, path3.y, path3.x);
        // console.log('距离：',l)
        if(l<0.08){ //过滤距离较近的点
            return true;
        }
    }

    return false;
}

/**
 * 获取两个地理经纬度坐标点之间的距离，单位km
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 * @returns {number}
 */
function getDistance( lat1,  lng1,  lat2,  lng2){
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

export default {
    intersection,
    compare3Point,
    angleR,
    addPoint
}