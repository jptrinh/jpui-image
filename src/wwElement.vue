<template>
    <component
        :is="linkTag"
        v-bind="properties"
        class="ww-image-basic"
        ww-responsive="ww-image-basic"
        :class="{ '-link': hasLink && !isEditing, '-crop': isCropped }"
        :style="cropRootVars"
    >
        <div class="ww-image-basic-overlay"></div>
        <div v-if="isCropped" class="ww-image-basic-crop-sizer" aria-hidden="true"></div>
        <img
            v-if="showPlaceholder"
            :key="placeholderSrc"
            class="ww-image-basic-placeholder"
            :src="placeholderSrc"
            alt=""
            aria-hidden="true"
            :loading="imgAttributes.loading"
            :style="cropImageStyle"
        />
        <img
            ref="img"
            :src="src"
            :alt="alt"
            v-bind="imgAttributes"
            :class="{ '-pending': showPlaceholder }"
            :style="cropImageStyle"
            @load="onImageLoad"
            @error="onImageError"
        />
    </component>
</template>

<script>
import { clampZoom, cropBox, fitBox, imageRectFor, maxZoomFor, parseRatio, toFraction } from './crop.js';

export default {
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content'],
    setup(props) {
        const { hasLink, tag: linkTag, properties } = wwLib.wwElement.useLink();

        // True from a url change until the new image has loaded (or failed)
        const { value: isLoading, setValue: setLoading } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'isLoading',
            type: 'boolean',
            defaultValue: false,
        });

        return {
            isLoading,
            setLoading,
            hasLink,
            linkTag,
            properties,
        };
    },
    data() {
        return {
            // Crop mode: the element's size (measured) and the image's own size (read on load when not given)
            measured: null,
            naturalSize: null,
            // The main image has loaded: the placeholder can go
            isReady: false,
        };
    },
    computed: {
        /* URL */
        url() {
            const url = this.wwElementState.props.url || this.content.url || '';
            return typeof url === 'string' ? url : '';
        },
        isWeWeb() {
            return this.url.startsWith('designs/');
        },
        src() {
            return this.isWeWeb ? `${wwLib.wwUtils.getCdnPrefix()}${this.url}` : this.url;
        },
        placeholderSrc() {
            const url = this.content?.placeholderUrl;
            if (typeof url !== 'string' || !url) return '';
            return url.startsWith('designs/') ? `${wwLib.wwUtils.getCdnPrefix()}${url}` : url;
        },
        showPlaceholder() {
            return !!this.placeholderSrc && this.placeholderSrc !== this.src && !this.isReady;
        },

        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },

        /* ALT */
        alt() {
            return wwLib.wwLang.getText(this.content.alt);
        },
        /* CROP MODE */
        // Show only a crop box of the image (ratio + focus point + zoom), fitted in the element
        isCropped() {
            return !!this.content?.crop && !!this.src;
        },
        // Size of the original: the intrinsic width / height when given, else the loaded image's
        imageSize() {
            const width = Number(this.content?.width);
            const height = Number(this.content?.height);
            if (width > 0 && height > 0) return { width, height };
            return this.naturalSize;
        },
        imageRatio() {
            return this.imageSize ? this.imageSize.width / this.imageSize.height : null;
        },
        // Crop ratio; empty = the image's own ratio (the whole image, zoom still applies)
        cropRatio() {
            return parseRatio(this.content?.cropRatio) ?? this.imageRatio;
        },
        cropZoom() {
            const max = maxZoomFor({
                imageWidth: this.imageSize?.width,
                imageHeight: this.imageSize?.height,
                ratio: this.cropRatio,
                minWidth: Number(this.content?.cropMinOutputWidth) || 0,
                minHeight: Number(this.content?.cropMinOutputHeight) || 0,
            });
            return clampZoom(this.content?.cropZoom, max);
        },
        cropRect() {
            if (!this.imageRatio || !this.cropRatio) return null;
            return cropBox({
                imageRatio: this.imageRatio,
                ratio: this.cropRatio,
                focusX: toFraction(this.content?.cropFocusX),
                focusY: toFraction(this.content?.cropFocusY),
                zoom: this.cropZoom,
            });
        },
        // The crop's shape, for the sizer when the element has no aspect ratio of its own
        cropRootVars() {
            return this.isCropped && this.cropRatio ? { '--wwi-crop-ar': String(this.cropRatio) } : null;
        },
        cropImageStyle() {
            if (!this.isCropped) return null;
            const element = this.measured;
            // Size unknown yet (image not loaded, element not measured): keep it invisible rather than distorted
            if (!this.cropRect || !element?.width || !element?.height) return { visibility: 'hidden' };
            const box = fitBox(element, this.cropRatio, this.content?.objectFit === 'cover' ? 'cover' : 'contain');
            const rect = imageRectFor(box, this.cropRect);
            // Only the crop box shows: the rest of the image is clipped (the element only clips at its own edges)
            const inset = [
                box.top - rect.top,
                rect.left + rect.width - (box.left + box.width),
                rect.top + rect.height - (box.top + box.height),
                box.left - rect.left,
            ];
            return {
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                clipPath: `inset(${inset.map(v => `${Math.max(0, v)}px`).join(' ')})`,
            };
        },
        imgAttributes() {
            const srcsetItems = Array.isArray(this.content?.srcset) ? this.content.srcset : [];
            const sizesItems = Array.isArray(this.content?.sizes) ? this.content.sizes : [];

            const srcsetStr = srcsetItems
                .filter(i => i?.url)
                .map(i => (i.descriptor ? `${i.url} ${i.descriptor}` : i.url))
                .join(', ');

            const sizesStr = sizesItems
                .filter(i => i?.size)
                .map(i => (i.media ? `${i.media} ${i.size}` : i.size))
                .join(', ');

            return {
                loading: this.content?.loading || 'lazy',
                ...(this.content?.fetchpriority ? { fetchpriority: this.content.fetchpriority } : {}),
                ...(this.content?.width != null ? { width: this.content.width } : {}),
                ...(this.content?.height != null ? { height: this.content.height } : {}),
                ...(srcsetStr ? { srcset: srcsetStr } : {}),
                ...(sizesStr ? { sizes: sizesStr } : {}),
            };
        },
    },
    watch: {
        src: {
            handler() {
                this.naturalSize = null;
                this.isReady = false;
                this.setLoading(!!this.src);
                // Already in the cache: the load event may have fired before the watcher ran
                this.$nextTick(() => {
                    if (this.$refs.img?.complete && this.$refs.img.naturalWidth) {
                        this.setLoading(false);
                        this.isReady = true;
                    }
                });
            },
            immediate: true,
        },
        // Measure the element only in crop mode (a grid can hold hundreds of images)
        isCropped: {
            handler(value) {
                if (value) this.$nextTick(this.startMeasuring);
                else this.stopMeasuring();
            },
            immediate: true,
        },
    },
    beforeUnmount() {
        this.stopMeasuring();
    },
    methods: {
        onImageLoad(event) {
            const img = event?.target;
            this.setLoading(false);
            this.isReady = true;
            if (img?.naturalWidth && img?.naturalHeight) {
                this.naturalSize = { width: img.naturalWidth, height: img.naturalHeight };
            }
        },
        // The placeholder stays: better a small image than a broken one
        onImageError() {
            this.setLoading(false);
        },
        startMeasuring() {
            const element = this.$el;
            if (this.resizeObserver || typeof element?.getBoundingClientRect !== 'function') return;
            const measure = () => {
                const rect = element.getBoundingClientRect();
                this.measured = { width: rect.width, height: rect.height };
            };
            measure();
            const win = wwLib.getFrontWindow();
            if (typeof win?.ResizeObserver === 'function') {
                this.resizeObserver = new win.ResizeObserver(measure);
                this.resizeObserver.observe(element);
            }
        },
        stopMeasuring() {
            this.resizeObserver?.disconnect();
            this.resizeObserver = null;
            this.measured = null;
        },
    },
};
</script>

<style scoped lang="scss">
.ww-image-basic {
    position: relative;
    isolation: isolate;
    overflow: hidden;

    &.-link {
        cursor: pointer;
    }

    &-overlay {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--wwi-o, transparent);
        pointer-events: none;
    }

    & img {
        z-index: 0;
        width: 100%;
        height: 100%;
        display: block;
        aspect-ratio: var(--wwi-ar, unset);
        object-fit: var(--wwi-of, fill);
        object-position: var(--wwi-op, 50% 50%);
        filter: var(--wwi-f, none);
        image-rendering: -webkit-optimize-contrast;
    }
}

// Crop mode: the image is taken out of the flow, so an in-flow sizer gives the element the size the image used to give
// it (same rules as the img: full size, the style's aspect ratio, else the crop's shape)
.ww-image-basic-crop-sizer {
    display: block;
    width: 100%;
    height: 100%;
    aspect-ratio: var(--wwi-ar, var(--wwi-crop-ar, auto));
    pointer-events: none;
}

// Progressive loading: the placeholder sits under the main image, which stays invisible until it has loaded
.ww-image-basic-placeholder {
    position: absolute;
    top: 0;
    left: 0;
}
.ww-image-basic img.-pending {
    opacity: 0;
}

// Crop mode: the image is placed in px around the crop box (exact ratio), the element clips the rest
.ww-image-basic.-crop img {
    top: 0;
    left: 0;
    position: absolute;
    max-width: none;
    aspect-ratio: auto;
    object-fit: fill;
}

/* wwEditor:start */
.ww-image-basic {
    & img {
        pointer-events: none;
        user-select: none;
    }
}
/* wwEditor:end */
</style>
