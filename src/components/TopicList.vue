<template>
  <ol>
    <li v-for="topic in mainTopics" :key="topic.id">
      <topic-item :topic="topic"
                  @deleteTopic="deleteTopic"
                  @drop="updateTopicOrder"
                  @dragover="dragOver"
                  @dragleave="dragLeave"
      />
      <topic-sub-list v-if="getSubTopics(topic.id).length > 0"
                      :topics="topics"
                      :topic-id="topic.id"
                      :level="1"
                      @deleteTopic="deleteTopic"
                      @updateTopicOrder="updateTopicOrder"
      />
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import TopicItem from '@/components/TopicItem.vue';
import useFilteredTopics from '@/composables/use-filtered-topics';
import { Topic } from '@/models/Topic';
import useDraggable from '@/composables/use-draggable';
import TopicSubList from '@/components/TopicSubList.vue';

export default defineComponent({
  name: 'TopicList',
  components: { TopicSubList, TopicItem },
  props: {
    topics: Array as PropType<Topic[]>
  },
  emits: ['deleteTopic', 'updateTopicOrder'],
  methods: {
    deleteTopic(topicId: string) {
      // TODO: Refresh on deletion
      this.$emit('deleteTopic', topicId);
    },
    async updateTopicOrder(dropEvent: DragEvent) {
      await this.drop(dropEvent, () => this.$emit('updateTopicOrder'));
    }
  },
  setup(props) {
    const { topics } = toRefs(props);
    const { mainTopics, getSubTopics } = useFilteredTopics(topics);
    const { dragOver, dragLeave, drop } = useDraggable();
    return {
      mainTopics,
      getSubTopics,
      dragOver,
      dragLeave,
      drop
    };
  }
});
</script>

<style scoped lang="scss">
ol {
  list-style: none;
  padding: 0;

  li {
    margin: 0;
  }
}
</style>
