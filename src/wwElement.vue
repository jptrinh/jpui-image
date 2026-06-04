<template>
    <component
        :is="linkTag"
        v-bind="properties"
        class="ww-image-basic"
        ww-responsive="ww-image-basic"
        :class="{ '-link': hasLink && !isEditing }"
    >
        <div class="ww-image-basic-overlay"></div>
        <img :src="src" :alt="alt" v-bind="imgAttributes" />
    </component>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content'],
    setup() {
        const { hasLink, tag: linkTag, properties } = wwLib.wwElement.useLink();

        return {
            hasLink,
            linkTag,
            properties,
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

/* wwEditor:start */
.ww-image-basic {
    & img {
        pointer-events: none;
        user-select: none;
    }
}
/* wwEditor:end */
</style>
