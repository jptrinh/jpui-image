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
            responsive: true,
            states: true,
            classes: true,
            defaultValue: null,
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
