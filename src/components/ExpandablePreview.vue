<template>
  <div :class="'container ' + previewSize">
    <div :class="expanded ? 'expanded' : 'contracted'">
      <slot/>
    </div>
    <button @click="toggle">{{ expanded ? t('preview.less') : t('preview.more') }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ExpandablePreview',
  props: {
    previewSize: {
      type: String as PropType<'small' | 'large'>,
      default: 'small',
    },
  },
  emits: {
    expand: () => true,
    contract: () => true,
  },
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded;
      if (this.expanded) {
        this.$emit('expand');
      } else {
        this.$emit('contract');
      }
    },
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../assets/scss/colors";

.container {
  position: relative;
  text-align: justify;
}

.container > .expanded {
  margin-bottom: 3.5em;
}

.container > .contracted {
  margin-bottom: 2em;
}

button {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);

  background: white;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 0.8em 1em;
  cursor: pointer;
}

.expanded {
  height: auto;

  + button {
    transform: translate(-50%, 120%);
  }
}

.small .contracted {
  height: 5em;
}

.big .contracted {
  height: 10em;
}

.contracted {
  overflow: hidden;

  $fadeOutColor: $color-light;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(rgba($fadeOutColor, 0), rgba($fadeOutColor, 1) 90%);
  }
}

@media screen and (prefers-color-scheme: dark) {
  .contracted {
    $fadeOutColor: $color-dark;
  }
}
</style>
