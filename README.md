# WW-IMAGE

This is an element for Weweb, to display an image.

-   Source of image can be changed, and will be uploaded to the Weweb CDN.
-   Object fit (fill / cover / contain) can be changed
-   Alt text can be changed (multi-language)
-   Overlay color/gradient can be applied
-   CSS filters can be applied
-   Loading strategy (`lazy` / `eager`)
-   Fetch priority (`auto` / `high` / `low`) — hint for browser resource scheduling
-   Intrinsic `width` and `height` — reserve layout space before the image loads (reduces CLS)
-   `srcset` — array of `{ url, descriptor }` candidates for responsive images (e.g. `480w`, `2x`)
-   `sizes` — array of `{ media, size }` conditions that tell the browser which srcset candidate to use

## Installation

To run locally, first install all dependencies with `yarn`

## Start

To serve locally, run `yarn serve --port=[PORT]`, and then go to Weweb editor, open developper popup and add localhost:[PORT] as custom wwObject.

## Build

Before release, you can check build error by running `yarn build`
​
