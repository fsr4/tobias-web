<template>
  <div>
    <header>
      <h1>{{ t('meeting.meeting', 2) }}</h1>
      <button @click="addMeeting">+</button>
    </header>
    <h2 id="next">{{ t('meeting.next') }}</h2>
    <meeting-item v-if="nextMeeting" :meeting="nextMeeting"/>
    <section>
      <meeting-list id="upcoming" :title="t('meeting.upcoming')" :meetings="upcomingMeetings"/>
      <meeting-list id="past" :title="t('meeting.past')" :meetings="pastMeetings"/>
    </section>
  </div>
</template>

<script lang="ts">
import MeetingList from '@/components/MeetingList.vue';
import { defineComponent } from 'vue';
import MeetingItem from '@/components/MeetingItem.vue';
import { useI18n } from 'vue-i18n';
import useMeetingList from '@/composables/use-meeting-list';
import useFilteredMeetingLists from '@/composables/use-filtered-meeting-lists';
import API from '@/utils/api-handler';

export default defineComponent({
  components: {
    MeetingList,
    MeetingItem
  },
  methods: {
    addMeeting: async() => {
      try {
        const meeting = await API.post('/meetings', { dateTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) });
        await API.post('/topics/default?meeting=' + meeting._id);
      } catch (e) {
        console.error(e);
      }
    }
  },
  setup() {
    const { t } = useI18n();
    const { meetings } = useMeetingList();
    const {
      nextMeeting,
      upcomingMeetings,
      pastMeetings
    } = useFilteredMeetingLists(meetings);

    return {
      t,
      meetings,
      nextMeeting,
      upcomingMeetings,
      pastMeetings
    };
  }
});
</script>

<style scoped lang="scss">
@import "../assets/scss/mixins";

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

section {
  @include two-columns;
}
</style>
