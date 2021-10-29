<template>
  <div>
    <h3 :id="id">{{ title }}</h3>
    <ul v-if="meetings.length < 3">
      <li v-for="meeting in meetings" :key="meeting.id">
        <meeting-item :meeting="meeting"/>
      </li>
    </ul>
    <preview v-else preview-size="big" @expand="scrollTo(id)">
      <ul>
        <li v-for="meeting in meetings" :key="meeting.id">
          <meeting-item :meeting="meeting"/>
        </li>
      </ul>
    </preview>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import MeetingItem from '@/components/MeetingItem.vue';
import Preview from '@/components/Preview.vue';
import { Meeting } from '@/models/Meeting';

export default defineComponent({
  components: {
    Preview,
    MeetingItem
  },
  props: {
    id: String,
    title: String,
    meetings: Array as PropType<Meeting[]>
  },
  methods: {
    scrollTo: (anchor: string) => {
      location.hash = '#' + anchor;
    }
  }
});
</script>

<style scoped lang="scss">
details[open] > summary::after {
  transform: rotate(0deg);
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
