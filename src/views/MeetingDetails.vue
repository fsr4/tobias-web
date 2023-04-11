<template>
  <router-link :to="{ name: ROUTE_MEETING_LIST }" class="back">
    <arrow-left/>
    {{ t('overview') }}
  </router-link>
  <div v-if="!meeting">
    <p>Loading...</p>
  </div>
  <div v-else>
    <header>
      <div>
        <h2>{{ t('meeting.meeting') }}</h2>
        <p>
          <calendar/>
          {{ t('meeting.date', [dateFormatter.format(meeting?.dateTime)]) }}
        </p>
        <p>
          <clock/>
          {{ t('meeting.time', [timeFormatter.format(meeting?.dateTime)]) }}
        </p>
      </div>
      <div>
        <button @click="sendInvitation">
          <mail/>
          {{ t('meeting.sendInvitation') }}
        </button>
      </div>
    </header>
    <div class="two-columns">
      <section>
        <h3>{{ t('meeting.schedule') }}</h3>
        <topic-list :topics="topics" @deleteTopic="deleteTopic" @updateTopicOrder="reloadTopics"/>
      </section>
      <section>
        <h3>{{ t('meeting.requestedTopics') }}</h3>
        <ul>
          <li v-for="topic in unusedTopics" :key="topic.id">
            <topic-item :topic="topic" @deleteTopic="deleteTopic"/>
          </li>
          <li>
            <topic-input :meeting-id="meeting?.id ?? ''" @newTopic="addNewTopic"/>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useMeetingDetails from '@/composables/use-meeting-details';
import useLocalizedDateFormatters from '@/composables/use-localized-date-formatters';
import TopicList from '@/components/TopicList.vue';
import useFilteredTopics from '@/composables/use-filtered-topics';
import TopicItem from '@/components/TopicItem.vue';
import ArrowLeft from 'bootstrap-icons/icons/arrow-left.svg';
import Calendar from 'bootstrap-icons/icons/calendar.svg';
import Clock from 'bootstrap-icons/icons/clock.svg';
import Mail from 'bootstrap-icons/icons/envelope.svg';
import TopicInput from '@/components/TopicInput.vue';
import { Topic } from '@/models/Topic';
import API from '@/utils/api-handler';
import { ROUTE_MEETING_LIST } from '@/router';

export default defineComponent({
  name: 'MeetingDetails',
  components: {
    TopicInput,
    ArrowLeft,
    Calendar,
    Clock,
    Mail,
    TopicItem,
    TopicList,
  },
  data() {
    return {
      ROUTE_MEETING_LIST,
    };
  },
  methods: {
    addNewTopic(topic: Topic) {
      this.topics.push(topic);
    },
    async deleteTopic(topicId: string) {
      const topicIndex = this.topics.findIndex((t: Topic) => t.id === topicId);
      if (topicIndex === -1) {
        console.warn('Deleted topic does not exist in local topic list');
        return;
      }
      await this.reloadTopics();
    },
    async reloadTopics() {
      await this.loadTopics();
    },
    async sendInvitation() {
      try {
        await API.post(`/meetings/${this.meeting?.id}/send-invitation`);
      } catch (e) {
        console.error(e);
      }
    },
  },
  setup() {
    const {
      t,
      locale,
    } = useI18n();
    const route = useRoute();
    const {
      meeting,
      topics,
      loadTopics,
    } = useMeetingDetails(route.params.id as string);
    const { unusedTopics } = useFilteredTopics(topics);
    const {
      longDateFormatter,
      shortTimeFormatter,
    } = useLocalizedDateFormatters(locale);
    return {
      t,
      meeting,
      topics,
      loadTopics,
      unusedTopics,
      dateFormatter: longDateFormatter,
      timeFormatter: shortTimeFormatter,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../assets/scss/mixins";
@import "../assets/scss/colors";

.back {
  text-decoration: none;
  color: inherit;
  font-size: 0.85em;
  display: flex;
  align-items: center;

  svg {
    padding-right: 0.5em;
  }
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin-top: 0.2em;
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    svg {
      font-size: 5em;
    }
  }
}

p {
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5em;
  }
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.two-columns {
  @include two-columns;
}
</style>
