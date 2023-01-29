/* eslint-disable no-console */
import { S2LatLngRect, S2RegionCoverer } from 'nodes2ts';
import { Covering } from '../../src/model/Covering';
import { S2Manager } from '../../src/s2/S2Manager';
import { S2Util } from '../../src/s2/S2Util';
import { QueryRadiusInput } from '../../src/types';
import { DynamoDB } from "aws-sdk";

describe('query radius', () => {
    it('should work with coordinates in The Netherlands', () => {
        let queryRadiusInput: QueryRadiusInput = {
            RadiusInMeter: 10000,
            CenterPoint: {
                latitude: 53.3576,
                longitude: 6.3791,
            },
        };

        const latLngRect: S2LatLngRect = S2Util.getBoundingLatLngRectFromQueryRadiusInput(queryRadiusInput);

        const covering = new Covering(new S2RegionCoverer().getCoveringCells(latLngRect));
        expect(covering).toBeDefined();

        const hashKeyLength = 6;

        covering.getGeoHashRanges(hashKeyLength).map(range => {
            const hashKey = S2Manager.generateHashKey(range.rangeMin, hashKeyLength);
            console.log('hashKey: ' + hashKey);

            const minRange: DynamoDB.AttributeValue = { N: range.rangeMin.toNumber().toString() };
            const maxRange: DynamoDB.AttributeValue = { N: range.rangeMax.toNumber().toString() };
            console.log('  minRange: ' + JSON.stringify(minRange));
            console.log('  maxRange: ' + JSON.stringify(maxRange));

            return hashKey;
        });

    });
});
