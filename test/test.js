var assert = require('assert');

var lib = require('../dist/main');

describe('Test', () => {
    describe('First', () => {
        it('are you ok?', () => {
            const polygon = lib.polyline2polygon.fromArrPoints([
                [
                    114.05572414398193,
                    22.644927568859806
                ],
                [
                    114.05799865722656,
                    22.645432556416726
                ],
                [
                    114.06012296676636,
                    22.645977148759847
                ]
            ]);
            console.log(polygon);
            assert.equal(1, 1);
        })
    })
})