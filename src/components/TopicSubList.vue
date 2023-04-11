<template>
  <ol>
    <li v-for="(subTopic, index) in getSubTopics(topicId)" :key="subTopic.id" class="sub">
      <topic-item
        :topic="subTopic"
        :position="`${prefix}.${index + 1}`"
        @deleteTopic="deleteTopic"
        @drop="updateTopicOrder"
        @dragover="dragOver"
        @dragleave="dragLeave"
      />
      <topic-sub-list
        v-if="getSubTopics(subTopic.id).length > 0"
        :topics="topics"
        :topic-id="subTopic.id"
        :prefix="`${prefix}.${index + 1}`"
        @deleteTopic="deleteTopic"
        @updateTopicOrder="updateTopicOrder"
      />
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import useFilteredTopics from '@/composables/use-filtered-topics';
import { Topic } from '@/models/Topic';
import TopicItem from '@/components/TopicItem.vue';
import { useDropArea } from '@/composables/use-draggable';

export default defineComponent({
  name: 'TopicSubList',
  components: { TopicItem },
  props: {
    topicId: {
      type: String,
      required: true,
    },
    topics: {
      type: Array as PropType<Topic[]>,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
    },
  },
  methods: {
    deleteTopic(topicId: string) {
      this.$emit('deleteTopic', topicId);
    },
    updateTopicOrder(dropEvent: DragEvent) {
      this.$emit('updateTopicOrder', dropEvent);
    },
  },
  setup(props) {
    const { topics } = toRefs(props);
    const { getSubTopics } = useFilteredTopics(topics);
    const {
      dragOver,
      dragLeave,
      drop,
    } = useDropArea();
    return {
      getSubTopics,
      dragOver,
      dragLeave,
      drop,
    };
  },
});
</script>

<style scoped lang="scss">
ol {
  list-style: none;
  padding: 0;

  li {
    margin: 0;

    .sub {
      padding-left: 2em;
    }
  }
}
</style>
