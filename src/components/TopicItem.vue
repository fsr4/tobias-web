<template>
  <div draggable="true" @dragstart="drag" :data-topic="topic.id">
    <p v-if="topic.parent || topic.previous || topic.next">
      {{ position }} {{ topic.title }}
    </p>
    <p v-else>
      {{ topic.title }}
    </p>
    <button @click="remove">
      <cross/>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { Topic } from '@/models/Topic';
import { useDraggable } from '@/composables/use-draggable';
import Cross from 'bootstrap-icons/icons/x.svg';
import useTopicAPI from '@/composables/use-topic-api';

export default defineComponent({
  name: 'TopicItem',
  components: { Cross },
  props: {
    topic: {
      type: Object as PropType<Topic>,
      required: true,
    },
    position: {
      type: String,
    },
  },
  emits: ['deleteTopic'],
  methods: {
    async remove() {
      if (!this.topic) {
        return;
      }

      try {
        await this.deleteTopic(this.topic.id);
        this.$emit('deleteTopic', this.topic.id);
      } catch (e) {
        console.error(e);
      }
    },
  },
  setup(props) {
    const { topic } = toRefs(props);

    const drag = useDraggable(topic);
    const { deleteTopic } = useTopicAPI();

    return {
      drag,
      deleteTopic,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../assets/scss/colors";

div {
  border: 1px solid transparent;
  position: relative;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: rgba($color-dark, 0.07);
  }
}

p {
  display: inline-block;
  cursor: grab;
  margin: 0;
  padding: 0.5em;
}

button {
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
}

.insert-above {
  border-top-color: #aaaaee;
}

.insert-below {
  border-bottom-color: #aaaaee;
}

.insert-sub {
  background-color: rgba($color-dark, 0.1);
}

.insert-above::before, .insert-below::after, .insert-sub::after {
  content: "";
  display: block;
  position: absolute;
  left: -10px;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background-color: #aaaaee;
  border-radius: 50%;
}

.insert-below::after, .insert-sub::after {
  bottom: -10px;
}

.insert-sub::after {
  left: calc(2em - 10px);
}

.insert-sub::before {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100% - 2em);
  height: 1px;
  background-color: #aaaaee;
}

@media screen and (prefers-color-scheme: dark) {
  div:hover {
    background-color: rgba($color-light, 0.07);
  }
}
</style>
