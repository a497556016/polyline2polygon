const Calculation = function () {

};

/**
 * 计算相交点，只支持经纬度计算
 * @param a
 * @param b
 * @param c
 * @param d
 * @returns {*}
 */
Calculation.prototype.intersection = function(a, b, c, d){
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
Calculation.prototype.angleR = function (a, b) /* radians */ {
    return Math.atan((b.y - a.y) / (b.x - a.x));
}

//两点偏移量相加
Calculation.prototype.addPoint = function (a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z||0
    }
}

export default Calculation