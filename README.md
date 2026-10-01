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
-   Object fit is bindable
-   **Crop mode** (`crop`): shows only a crop box of the image — `cropRatio` ("4:5" or a number, empty = the image's
    own ratio), `cropFocusX` / `cropFocusY` (0–1, the centre of the crop) and `cropZoom` (1 or more). The box is the
    largest box of the ratio divided by the zoom, as centred on the focus point as the image allows (the rule of
    imgproxy's `fp` gravity), so it previews `rs:fill` + `g:fp` / `crop:w:h:fp:x:y` without a new URL. Fit: `cover`
    fills the element with the crop, anything else fits it inside; an element with no height is sized like the plain
    image (style aspect ratio, else the crop's shape) by an in-flow sizer.
    The zoom is capped by `cropMinOutputWidth` / `cropMinOutputHeight` (source px, 0 = not checked) and 8×: pass the
    original's size in `width` / `height` when the URL is a resized version. Geometry in `src/crop.js`, tests:
    `npm test`.

## Installation

To run locally, first install all dependencies with `yarn`

## Start

To serve locally, run `yarn serve --port=[PORT]`, and then go to Weweb editor, open developper popup and add localhost:[PORT] as custom wwObject.

## Build

Before release, you can check build error by running `yarn build`
​
