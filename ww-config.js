export default {
    type: 'wwObject',
    css({ style, content }) {
        return [
            {
                property: '--wwi-ar',
                value: style.aspectRatio,
            },
            {
                property: '--wwi-of',
                value: content.objectFit,
            },
            {
                property: '--wwi-op',
                value: content.objectPosition,
            },
            {
                property: '--wwi-f',
                value: content.filter,
            },
            {
                property: '--wwi-o',
                value: content.overlay,
            },
        ];
    },
    options: {
        sizable: true,
        ignoredStyleProperties: ['overflow'],
        linkable: true,
    },
    editor: {
        label: {
            fr: 'Image',
            en: 'Image',
        },
        icon: 'photograph',
    },
    properties: {
        url: {
            label: { en: 'Image', fr: 'Image' },
            type: 'Image',
            bindable: true,
            defaultValue: 'https://cdn.weweb.app/public/images/no_image_selected.png',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'A string that represents the image url: `"https://.../.../my_image.png"`',
            },
            /* wwEditor:end */
        },
        objectFit: {
            label: {
                en: 'Fit',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: null, default: true, label: { en: 'Fill' } },
                    { value: 'cover', label: { en: 'Cover' } },
                    { value: 'contain', label: { en: 'Contain' } },
                ],
            },
            bindable: true,
            responsive: true,
            states: true,
            classes: true,
            defaultValue: null,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip:
                    'A CSS object-fit value: `"cover" | "contain"`, or empty for fill. In crop mode: `"cover"` makes the crop cover the element, anything else fits it inside.',
            },
            /* wwEditor:end */
        },
        objectPosition: {
            label: { en: 'Position' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: null, default: true, label: { en: 'Default' } },
                    { value: 'center', label: { en: 'Center' } },
                    { value: 'top', label: { en: 'Top' } },
                    { value: 'bottom', label: { en: 'Bottom' } },
                    { value: 'left', label: { en: 'Left' } },
                    { value: 'right', label: { en: 'Right' } },
                    { value: 'top left', label: { en: 'Top Left' } },
                    { value: 'top right', label: { en: 'Top Right' } },
                    { value: 'bottom left', label: { en: 'Bottom Left' } },
                    { value: 'bottom right', label: { en: 'Bottom Right' } },
                ],
            },
            bindable: true,
            responsive: true,
            states: true,
            classes: true,
            defaultValue: null,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip:
                    'A CSS object-position value: `"center" | "top" | "bottom left"` \n\n <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-position" target="_blank">[documentation]</a>',
            },
            /* wwEditor:end */
        },
        overlay: {
            type: 'Color',
            label: { en: 'Overlay' },
            options: {
                nullable: true,
                gradient: true,
            },
            responsive: true,
            states: true,
            bindable: true,
            classes: true,
            /* wwEditor:start */
            bindingValidation: {
                cssSupports: 'color',
                type: 'string',
                tooltip: 'A string that represents a color code: `"rebeccapurple" | "#00ff00" | "rgb(214, 122, 127)"`',
            },
            /* wwEditor:end */
        },
        filter: {
            type: 'CssFilters',
            label: { en: 'Filters' },
            responsive: true,
            states: true,
            bindable: true,
            classes: true,
            /* wwEditor:start */
            bindingValidation: {
                cssSupports: 'filter',
                type: 'string',
                tooltip:
                    'A string that represents a filter value: `"blur(5px)" | "contrast(200%)" | "hue-rotate(90deg)"` \n\n <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/filter" target="_blank">[documentation]</a>',
            },
            /* wwEditor:end */
        },
        alt: {
            section: 'settings',
            label: { en: 'Alt', fr: 'Alt' },
            type: 'Text',
            multiLang: true,
            bindable: true,
            options: {
                placeholder: 'Image description',
            },
            defaultValue: { en: '' },
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'A string that represents the image alt: `"image description"`',
            },
            /* wwEditor:end */
        },
        loading: {
            section: 'settings',
            label: { en: 'Loading' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'lazy', label: { en: 'Lazy' }, default: true },
                    { value: 'eager', label: { en: 'Eager' } },
                ],
            },
            defaultValue: 'lazy',
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Valid values: lazy | eager',
            },
            /* wwEditor:end */
        },
        fetchpriority: {
            section: 'settings',
            label: { en: 'Fetch Priority' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'auto', label: { en: 'Auto' }, default: true },
                    { value: 'high', label: { en: 'High' } },
                    { value: 'low', label: { en: 'Low' } },
                ],
            },
            defaultValue: 'auto',
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Hint for the browser fetch priority: `"auto" | "high" | "low"`',
            },
            /* wwEditor:end */
        },
        width: {
            section: 'settings',
            label: { en: 'Intrinsic Width' },
            type: 'Number',
            options: { min: 0, step: 1 },
            bindable: true,
            defaultValue: null,
            /* wwEditor:start */
            bindingValidation: {
                type: 'number',
                tooltip:
                    'Intrinsic width of the image in pixels — used by the browser to reserve layout space before the image loads.',
            },
            /* wwEditor:end */
        },
        height: {
            section: 'settings',
            label: { en: 'Intrinsic Height' },
            type: 'Number',
            options: { min: 0, step: 1 },
            bindable: true,
            defaultValue: null,
            /* wwEditor:start */
            bindingValidation: {
                type: 'number',
                tooltip:
                    'Intrinsic height of the image in pixels — used by the browser to reserve layout space before the image loads.',
            },
            /* wwEditor:end */
        },
        crop: {
            section: 'settings',
            label: { en: 'Crop to a focus point' },
            type: 'OnOff',
            bindable: true,
            defaultValue: false,
            /* wwEditor:start */
            bindingValidation: { type: 'boolean', tooltip: 'true to show only a crop box of the image' },
            propertyHelp: {
                tooltip:
                    'Shows only a crop box of the image: the largest box of the crop ratio, divided by the zoom, as centred on the focus point as the image allows (the rule of imgproxy fp gravity). Fit: cover fills the element with the crop, anything else fits it inside. Needs the image size (Intrinsic width / height, else read once loaded).',
            },
            /* wwEditor:end */
        },
        cropRatio: {
            section: 'settings',
            label: { en: 'Crop ratio' },
            type: 'Text',
            bindable: true,
            defaultValue: '',
            hidden: content => !content?.crop,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Width:height of the crop: `"4:5"`, `"16:9"`, or a number like `0.8`. Empty = the image\'s own ratio.',
            },
            /* wwEditor:end */
        },
        cropFocusX: {
            section: 'settings',
            label: { en: 'Focus X' },
            type: 'Number',
            options: { min: 0, max: 1, step: 0.01 },
            bindable: true,
            defaultValue: null,
            hidden: content => !content?.crop,
            /* wwEditor:start */
            bindingValidation: { type: 'number', tooltip: 'Horizontal centre of the crop, 0 (left) to 1 (right). Empty = 0.5.' },
            /* wwEditor:end */
        },
        cropFocusY: {
            section: 'settings',
            label: { en: 'Focus Y' },
            type: 'Number',
            options: { min: 0, max: 1, step: 0.01 },
            bindable: true,
            defaultValue: null,
            hidden: content => !content?.crop,
            /* wwEditor:start */
            bindingValidation: { type: 'number', tooltip: 'Vertical centre of the crop, 0 (top) to 1 (bottom). Empty = 0.5.' },
            /* wwEditor:end */
        },
        cropZoom: {
            section: 'settings',
            label: { en: 'Zoom' },
            type: 'Number',
            options: { min: 1, step: 0.05, noRange: true },
            bindable: true,
            defaultValue: null,
            hidden: content => !content?.crop,
            /* wwEditor:start */
            bindingValidation: { type: 'number', tooltip: '1 or more: the crop box is the largest box of the ratio divided by this. Empty = 1.' },
            /* wwEditor:end */
        },
        cropMinOutputWidth: {
            section: 'settings',
            label: { en: 'Min output width (px)' },
            type: 'Number',
            options: { min: 0, step: 10, noRange: true },
            bindable: true,
            defaultValue: 0,
            hidden: content => !content?.crop,
            /* wwEditor:start */
            bindingValidation: { type: 'number', tooltip: 'Caps the zoom so the crop keeps at least this many source pixels of width. 0 = not checked.' },
            propertyHelp: { tooltip: 'Use the same limit as the code that exports the crop, so the preview never zooms further than the file.' },
            /* wwEditor:end */
        },
        cropMinOutputHeight: {
            section: 'settings',
            label: { en: 'Min output height (px)' },
            type: 'Number',
            options: { min: 0, step: 10, noRange: true },
            bindable: true,
            defaultValue: 0,
            hidden: content => !content?.crop,
            /* wwEditor:start */
            bindingValidation: { type: 'number', tooltip: 'Same for the height. 0 = not checked.' },
            /* wwEditor:end */
        },
        srcset: {
            section: 'settings',
            label: { en: 'Srcset' },
            type: 'Array',
            bindable: true,
            defaultValue: [],
            options: {
                expandable: true,
                getItemLabel(item) {
                    return item?.descriptor || item?.url || 'Candidate';
                },
                item: {
                    type: 'Object',
                    defaultValue: { url: '', descriptor: '' },
                    options: {
                        item: {
                            url: { label: { en: 'URL' }, type: 'Text' },
                            descriptor: { label: { en: 'Descriptor' }, type: 'Text' },
                        },
                    },
                },
            },
            /* wwEditor:start */
            bindingValidation: {
                type: 'array',
                tooltip:
                    'Array of `{ url, descriptor }` objects. `descriptor` is a width (`"480w"`) or pixel-density (`"2x"`) value.',
            },
            /* wwEditor:end */
        },
        sizes: {
            section: 'settings',
            label: { en: 'Sizes' },
            type: 'Array',
            bindable: true,
            defaultValue: [],
            hidden: content => !content?.srcset?.length,
            options: {
                expandable: true,
                getItemLabel(item) {
                    if (item?.media && item?.size) return `${item.media} → ${item.size}`;
                    return item?.size || 'Default';
                },
                item: {
                    type: 'Object',
                    defaultValue: { media: '', size: '' },
                    options: {
                        item: {
                            media: { label: { en: 'Media condition' }, type: 'Text' },
                            size: { label: { en: 'Size' }, type: 'Text' },
                        },
                    },
                },
            },
            /* wwEditor:start */
            bindingValidation: {
                type: 'array',
                tooltip: 'Array of `{ media, size }` objects. Leave `media` empty for the default/fallback size.',
            },
            /* wwEditor:end */
        },
    },
};
