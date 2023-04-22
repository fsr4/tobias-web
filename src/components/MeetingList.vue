<template>
  <div>
    <h3 :id="id">{{ title }}</h3>
    <ul v-if="meetings.length < 3">
      <li v-for="meeting in meetings" :key="meeting.id">
        <meeting-item :meeting="meeting"/>
      </li>
    </ul>
    <expandable-preview v-else preview-size="large" @expand="scrollTo(id)">
      <ul>
        <li v-for="meeting in meetings" :key="meeting.id">
          <meeting-item :meeting="meeting"/>
        </li>
      </ul>
    </expandable-preview>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import MeetingItem from '@/components/MeetingItem.vue';
import ExpandablePreview from '@/components/ExpandablePreview.vue';
import { Meeting } from '@/models/Meeting';

export default defineComponent({
  components: {
    ExpandablePreview,
    MeetingItem,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    meetings: {
      type: Array as PropType<Meeting[]>,
      required: true,
    },
  },
  methods: {
    scrollTo: (anchor: string) => {
      location.hash = '#' + anchor;
    },
  },
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
