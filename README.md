# ts-log-adapter-gulplog

| Branch | Status |
| ------ | ------ |
| master | [![Continuous Integration](https://github.com/userfrosting/ts-log-adapter-gulplog/workflows/Continuous%20Integration/badge.svg?branch=master)](https://github.com/userfrosting/ts-log-adapter-gulplog/actions?query=branch:master+workflow:"Continuous+Integration") [![codecov](https://codecov.io/gh/userfrosting/ts-log-adapter-gulplog/branch/master/graph/badge.svg)](https://codecov.io/gh/userfrosting/ts-log-adapter-gulplog/branch/master) |
| develop | [![Continuous Integration](https://github.com/userfrosting/ts-log-adapter-gulplog/workflows/Continuous%20Integration/badge.svg?branch=develop)](https://github.com/userfrosting/ts-log-adapter-gulplog/actions?query=branch:develop+workflow:"Continuous+Integration") [![codecov](https://codecov.io/gh/userfrosting/ts-log-adapter-gulplog/branch/develop/graph/badge.svg)](https://codecov.io/gh/userfrosting/ts-log-adapter-gulplog/branch/develop) |

An adapter for the ts-log interface that pushes logging to gulplog.

Before being passed to `gulplog`, the message optional arguments will be processed to ensure proper logging. The `trace` log level does not map across and will be directed to `GulpLog.debug` with `TRACE: ` prefixed to logging.

## Install

```bash
npm i -D  @userfrosting/ts-log-adapter-gulplog
```

## Usage

```js
// gulpfile.esm.js
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

API documentation is regenerated for every release using [API Extractor](https://www.npmjs.com/package/@microsoft/api-extractor) and [API Documenter](https://www.npmjs.com/package/@microsoft/api-documenter).
The results reside in [docs/api](./docs/api/index.md).

## History

The bulk of this adapter's logic came from build scripts in UserFrosting 4.2.

## Release process

Generally speaking, all releases should first traverse through `alpha`, `beta`, and `rc` (release candidate) to catch missed bugs and gather feedback as appropriate. Aside from this however, there are a few steps that **MUST** always be done.

1. Make sure [`CHANGELOG.md`](./CHANGELOG.md) is up to date.
2. Update version via `npm` like `npm version 3.0.0` or `npm version patch`.
3. `npm publish`.
4. Create release on GitHub from tag made by `npm version`.

## License

[MIT](LICENSE)
