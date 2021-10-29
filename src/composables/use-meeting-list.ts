import { onMounted, ref, Ref, UnwrapRef } from 'vue';
import { Meeting } from '@/models/Meeting';
import API from '@/utils/api-handler';

type UseMeetingListType = {
  loadMeetings: () => void,
  meetings: Ref<UnwrapRef<Meeting[]>>
}

export default function useMeetingList(): UseMeetingListType {
  const meetings = ref<Meeting[]>([]);

  const loadMeetings = async function() {
    try {
      const data = await API.get('/meetings');
      for (const meeting of data) {
        meetings.value.push(Meeting.parseFromData(meeting));
      }
    } catch (e) {
      console.error(e);
    }
  };

  onMounted(loadMeetings);

  return {
    meetings,
    loadMeetings
  };
}
