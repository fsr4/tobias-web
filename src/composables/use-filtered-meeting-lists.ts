import { Meeting } from '@/models/Meeting';
import { computed, ComputedRef, Ref, UnwrapRef } from 'vue';

type UseFilteredMeetingLists = {
  nextMeeting: ComputedRef<Meeting | undefined>,
  upcomingMeetings: ComputedRef<Meeting[]>,
  pastMeetings: ComputedRef<Meeting[]>,
}

export default function useFilteredMeetingLists(meetings: Ref<UnwrapRef<Meeting[]>>): UseFilteredMeetingLists {
  const nextMeeting = computed((): Meeting | undefined => {
    return upcomingMeetings.value.shift();
  });

  const upcomingMeetings = computed((): Meeting[] => {
    const now = new Date();
    return meetings.value
      .filter(m => m.dateTime > now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  });

  const pastMeetings = computed((): Meeting[] => {
    const now = new Date();
    return meetings.value
      .filter(m => m.dateTime < now)
      .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  });

  return {
    nextMeeting,
    upcomingMeetings,
    pastMeetings
  };
}
