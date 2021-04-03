# ts-log-adapter-gulplog

| Branch | Status |
| ------ | ------ |
| master | [![Continuous Integration](https://github.com/userfrosting/ts-log-adapter-gulplog/workflows/Continuous%20Integration/badge.svg?branch=master)](https://github.com/userfrosting/ts-log-adapter-gulplog/actions?query=branch:master+workflow:"Continuous+Integration") [![codecov](https://codecov.io/gh/userfrosting/ts-log-adapter-gulplog/branch/master/graph/badge.svg)](https://codecov.io/gh/userfrosting/ts-log-adapter-gulplog/branch/master) |

An adapter for the ts-log interface that pushes logging to gulplog.

Before being passed to `gulplog`, the message optional arguments will be processed to ensure proper logging. The `trace` log level does not map across and will be directed to `GulpLog.debug` with `TRACE: ` prefixed to logging.

## Install

```bash
npm i -D  @userfrosting/ts-log-adapter-gulplog
```

## Usage

```js
// gulpfile.mjs
import { GulpLogLogger } from "@userfrosting/ts-log-adapter-gulplog";
import { src, dest } from "gulp";
import AssetBundler from "@userfrosting/gulp-bundle-assets";
import cleanCss from "gulp-clean-css";
import concatCss from "gulp-concat-css";
import concatJs from "gulp-concat-js";
import uglify from "gulp-uglify";

export function bundle() {
    const config = {
        bundle: {
            example: {
                scripts: [
                    "foo.js",
                    "bar.js"
                ],
                styles: [
                    "foo.css",
                    "bar.css"
                ]
            }
        },
        logger: new GulpLogLogger(),
    };
    const joiner = {
        Scripts(bundleStream, name) {
            return bundleStream
                .pipe(concatJs(name + ".js"))// example.js
                .pipe(uglify());
        },
        Styles(bundleStream, name) {
            return bundleStream
                .pipe(concatCss(name + ".css"))// example.css
                .pipe(cleanCss());
        }
    };

    return src("src/**")
        .pipe(new AssetBundler(config, joiner))
        .pipe(dest("public/assets/"));
}
```

```bash
$ gulp bundle
```

## API

See [docs/api](./docs/api/index.md).

## License

[MIT](LICENSE)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
