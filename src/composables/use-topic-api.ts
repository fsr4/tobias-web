import API from '@/utils/api-handler';

type UseTopicAPI = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addTopic: (meetingId: string, name: string) => Promise<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteTopic: (topicId: string) => Promise<any>
};

export default function useTopicAPI(): UseTopicAPI {
  const addTopic = async(meetingId: string, name: string) => {
    return API.post('/topics', {
      meeting: meetingId,
      name: name
    });
  };

  const deleteTopic = async(topicId: string) => {
    return API.del(`/topics/${topicId}`);
  };

  return {
    addTopic,
    deleteTopic
  };
}
