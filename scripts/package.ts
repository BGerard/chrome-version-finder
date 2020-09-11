import * as shelljs from "shelljs";
import * as tar from "tar";

shelljs.rm('-rf', 'dist');
shelljs.mkdir('dist');
shelljs.cp('package.json', 'dist/package.json');
shelljs.cp('package-lock.json', 'dist/package-lock.json');
shelljs.cp('-R', 'lib', 'dist/lib');

tar.c(
    {
        gzip: true,
        file: 'chrome-version-finder.tar.gz',
        C: 'dist'
    },
    ['.']
).then(() => {
    console.log( {status: 0, message: 'Tarball has been created'});
});