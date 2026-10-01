// Crop mode geometry. Run: npm test (plain node, no dependency)
import assert from 'node:assert/strict';
import { clampZoom, cropBox, fitBox, imageRectFor, maxZoomFor, parseRatio, toFraction } from '../src/crop.js';

const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Parsing
near(parseRatio('4:5'), 0.8);
near(parseRatio('16/9'), 16 / 9);
near(parseRatio(1.5), 1.5);
assert.equal(parseRatio(''), null);
assert.equal(parseRatio('original'), null);
assert.equal(toFraction(null), 0.5);
assert.equal(toFraction(2), 1);

// Zoom cap: same numbers as the carrousl backend ("Set image focus", min width 1080)
assert.equal(clampZoom(10, maxZoomFor({ imageWidth: 4160, imageHeight: 6240, ratio: 0.8, minWidth: 1080 })), 3.8518);
assert.equal(clampZoom(2, maxZoomFor({ imageWidth: 2374, imageHeight: 1334, ratio: 0.8, minWidth: 1080 })), 1);
assert.equal(clampZoom(20), 8);
assert.equal(clampZoom(null), 1);

// Crop box: largest box of the ratio / zoom, kept inside the image around the focus point
{
    const c = cropBox({ imageRatio: 2 / 3, ratio: 0.8, focusX: 0.5, focusY: 0.4, zoom: 1 });
    near(c.width, 1);
    near(c.height, (2 / 3) / 0.8);
    near(c.top, 0); // 0.4 - 0.4167 clamped to 0
    const z = cropBox({ imageRatio: 2 / 3, ratio: 0.8, focusX: 0, focusY: 0.4, zoom: 2 });
    near(z.width, 0.5);
    near(z.left, 0); // clamped at the edge
}

// Fitting the crop in the element, and placing the image so the crop lands on the box
for (const mode of ['contain', 'cover']) {
    const element = { width: 300, height: 200 };
    const box = fitBox(element, 0.8, mode);
    near(box.width / box.height, 0.8);
    if (mode === 'contain') assert.ok(box.width <= 300 + 1e-9 && box.height <= 200 + 1e-9);
    else assert.ok(box.width >= 300 - 1e-9 && box.height >= 200 - 1e-9);
    const crop = cropBox({ imageRatio: 1.5, ratio: 0.8, focusX: 0.3, focusY: 0.5, zoom: 1.7 });
    const rect = imageRectFor(box, crop);
    near(rect.left + crop.left * rect.width, box.left);
    near(rect.top + crop.top * rect.height, box.top);
    near(crop.width * rect.width, box.width);
    near(rect.width / rect.height, 1.5); // no distortion
}

console.log('crop: all tests passed');
