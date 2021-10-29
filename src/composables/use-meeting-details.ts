import { onMounted, Ref, ref } from 'vue';
import { Meeting } from '@/models/Meeting';
import API from '@/utils/api-handler';
import { Topic } from '@/models/Topic';

type UseMeetingDetails = {
  meeting: Ref<Meeting | undefined>,
  topics: Ref<Topic[]>,
  loadMeeting: () => Promise<void>,
  loadTopics: () => Promise<void>
};

export default function useMeetingDetails(meetingId: string): UseMeetingDetails {
  const meeting = ref<Meeting>();
  const topics = ref<Topic[]>([]);

  const loadMeeting = async() => {
    try {
      const data = await API.get(`/meetings/${meetingId}`);
      meeting.value = Meeting.parseFromData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadTopics = async() => {
    topics.value = [];
    try {
      const data = await API.get('/topics', { meeting: meetingId });
      for (const topic of data) {
        topics.value.push(Topic.parseFromData(topic));
      }
    } catch (e) {
      console.error(e);
    }
  };

  onMounted(loadMeeting);
  onMounted(loadTopics);

  return {
    meeting,
    topics,
    loadMeeting,
    loadTopics
  };
}
