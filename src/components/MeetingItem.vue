<template>
  <router-link :to="{ name: ROUTE_MEETING_DETAILS, params: { id: meeting.id } }">
    <div class="container">
      <p>
        <calendar/>
        {{ t('meeting.date', [dateFormatter.format(meeting.dateTime)]) }}
      </p>
      <p>
        <clock/>
        {{ t('meeting.time', [timeFormatter.format(meeting.dateTime)]) }}
      </p>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ROUTE_MEETING_DETAILS } from '@/router';
import { Meeting } from '@/models/Meeting';
import { useI18n } from 'vue-i18n';
import useLocalizedDateFormatters from '@/composables/use-localized-date-formatters';
import Calendar from 'bootstrap-icons/icons/calendar.svg';
import Clock from 'bootstrap-icons/icons/clock.svg';

export default defineComponent({
  name: 'MeetingItem',
  components: {
    Calendar,
    Clock,
  },
  props: {
    meeting: {
      type: Meeting,
      required: true,
    },
  },
  data() {
    return {
      ROUTE_MEETING_DETAILS,
    };
  },
  setup() {
    const {
      t,
      locale,
    } = useI18n();
    const {
      longDateFormatter,
      shortTimeFormatter,
    } = useLocalizedDateFormatters(locale);
    return {
      t,
      dateFormatter: longDateFormatter,
      timeFormatter: shortTimeFormatter,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../assets/scss/colors";

a {
  color: inherit;
  text-decoration: none;
}

.container {
  padding: 0.2em 1em;
  border: 1px solid $color-offset;

  &:hover {
    background-color: rgba($color-dark, 0.07);
  }
}

p {
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5em;
  }
}

@media screen and (prefers-color-scheme: dark) {
  .container:hover {
    background-color: rgba($color-light, 0.07);
  }
}
</style>
