// Crop mode geometry: show only a crop box of the image, defined by a ratio, a focus point and a zoom.
// Pure functions (no DOM), tested by test/crop.test.mjs.
//
// - ratio: crop width / height
// - focus: centre of the crop, fractions of the image (0–1)
// - zoom: 1 or more; the crop box is the largest box of the ratio divided by the zoom
// Same rules as imgproxy's `crop:w:h:fp:x:y` / `rs:fill` + `g:fp:x:y`: the box stays as centred on the focus point as
// the image allows.

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const HARD_ZOOM_CAP = 8;

// "4:5", "4/5", "4x5" or a number (0.8) → width / height; anything else → null
export const parseRatio = value => {
    if (typeof value === 'number') return value > 0 ? value : null;
    const parts = String(value ?? '')
        .split(/[:/x×]/)
        .map(part => parseFloat(part));
    if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) return parts[0] / parts[1];
    if (parts.length === 1 && parts[0] > 0) return parts[0];
    return null;
};

// A focus coordinate between 0 and 1; anything else → 0.5 (centred)
export const toFraction = value => {
    if (value === null || value === undefined || value === '') return 0.5;
    const n = Number(value);
    return Number.isFinite(n) ? clamp(n, 0, 1) : 0.5;
};

// Largest zoom that keeps the cropped output at least minWidth × minHeight source pixels (0 = not checked)
export const maxZoomFor = ({ imageWidth, imageHeight, ratio, minWidth = 0, minHeight = 0 }) => {
    let max = HARD_ZOOM_CAP;
    const w = Number(imageWidth);
    const h = Number(imageHeight);
    if (w > 0 && h > 0 && ratio > 0) {
        const boxW = Math.min(w, h * ratio);
        const boxH = boxW / ratio;
        if (minWidth > 0) max = Math.min(max, boxW / minWidth);
        if (minHeight > 0) max = Math.min(max, boxH / minHeight);
    }
    return Math.max(1, max);
};

// Zoom between 1 and the cap, 4 decimals rounded down (never above what a server applying the same cap keeps)
export const clampZoom = (zoom, maxZoom = HARD_ZOOM_CAP) => {
    const n = Number(zoom);
    const z = Math.floor(clamp(Number.isFinite(n) ? n : 1, 1, maxZoom) * 10000) / 10000;
    return z > 1.0001 ? z : 1;
};

// Crop box as fractions of the image: { left, top, width, height }
export const cropBox = ({ imageRatio, ratio, focusX, focusY, zoom }) => {
    const base = imageRatio > ratio ? { width: ratio / imageRatio, height: 1 } : { width: 1, height: imageRatio / ratio };
    const width = base.width / zoom;
    const height = base.height / zoom;
    return {
        left: clamp(focusX - width / 2, 0, 1 - width),
        top: clamp(focusY - height / 2, 0, 1 - height),
        width,
        height,
    };
};

// Where the crop box goes in the element (px): fitted inside it (contain) or covering it (cover), centred
export const fitBox = (element, ratio, mode) => {
    const { width, height } = element;
    const w = mode === 'cover' ? Math.max(width, height * ratio) : Math.min(width, height * ratio);
    const h = w / ratio;
    return { left: (width - w) / 2, top: (height - h) / 2, width: w, height: h };
};

// The whole image, placed so that its crop box lands exactly on `box` (px)
export const imageRectFor = (box, crop) => {
    const width = box.width / crop.width;
    const height = box.height / crop.height;
    return { left: box.left - crop.left * width, top: box.top - crop.top * height, width, height };
};
