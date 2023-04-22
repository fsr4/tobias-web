<template>
  <input type="text" :placeholder="t('meeting.addTopic')" @keypress="checkSubmit"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import useTopicAPI from '@/composables/use-topic-api';
import { Topic } from '@/models/Topic';

export default defineComponent({
  name: 'TopicInput',
  props: {
    meetingId: {
      type: String,
      required: true,
    },
  },
  emits: ['newTopic'],
  methods: {
    async checkSubmit(event: KeyboardEvent) {
      if (event.key !== 'Enter') {
        return;
      }

      const input = event.target as HTMLInputElement;
      try {
        const newTopic = await this.addTopic(this.meetingId, input.value);
        this.$emit('newTopic', Topic.parseFromData(newTopic));
      } catch (e) {
        console.error(e);
      }
      input.value = '';
    },
  },
  setup() {
    const { t } = useI18n();
    const { addTopic } = useTopicAPI();

    return {
      t,
      addTopic,
    };
  },
});
</script>

<style scoped lang="scss">
input {
  border: none;
  background: none;
  width: 100%;
  padding: 0.5em;
  font: inherit;
  color: inherit;

  &:focus-visible {
    outline: none;
  }
}
</style>
