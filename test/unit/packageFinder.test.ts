import { expect } from 'chai';
import {findPackage} from "../../src/packageFinder";

describe('Package Finder', function () {
    it('should return a mediaLink if a package is found', async () => {
        const lookupPackage = () => {
          return Promise.resolve({
              items: [
                  { name: 'chrome-linux.zip', mediaLink: 'fakeUrl', kind: '', size: '' }
              ]
          });
        };
        const actual = await findPackage(lookupPackage)(100);
        expect(actual).to.eql('fakeUrl');
    });
});