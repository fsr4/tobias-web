import { computed, ComputedRef, onMounted, Ref, ref } from 'vue';
import { Meeting } from '@/models/Meeting';
import API from '@/utils/api-handler';
import { Topic } from '@/models/Topic.ts';

type UseMeetingDetails = {
  meeting: Ref<Meeting | undefined>,
  topics: ComputedRef<Topic[]>,
  loadMeeting: () => Promise<void>,
};

export default function useMeetingDetails(meetingId: string): UseMeetingDetails {
  const meeting = ref<Meeting>();

  const loadMeeting = async() => {
    try {
      const data = await API.get(`/meetings/${meetingId}`);
      meeting.value = Meeting.parseFromData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const topics = computed(() => meeting.value?.topics ?? []);

  onMounted(loadMeeting);

  return {
    meeting,
    topics,
    loadMeeting,
  };
}
