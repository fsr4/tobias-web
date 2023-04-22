import API from '@/utils/api-handler';
import { APIData } from '@/utils/api-data.ts';

type UseTopicAPI = {
  addTopic: (meetingId: string, name: string) => Promise<APIData>,
  updateTopicOrder: (topicId: string, targetTopicId: string, insertType: InsertType) => Promise<APIData>,
  removeTopicFromSchedule: (topicId: string) => Promise<APIData>,
  deleteTopic: (topicId: string) => Promise<APIData>,
};

export type InsertType = 'before' | 'child' | 'after';

export default function useTopicAPI(): UseTopicAPI {
  const addTopic = async(meetingId: string, name: string) => {
    return API.post('/topics', {
      meeting: meetingId,
      name: name,
    });
  };

  const updateTopicOrder = async(topicId: string, targetTopicId: string, insertType: InsertType) => {
    let body: Record<string, string>;
    switch (insertType) {
      case 'before':
        body = { insertBefore: targetTopicId };
        break;
      case 'child':
        body = { parent: targetTopicId };
        break;
      case 'after':
        body = { insertAfter: targetTopicId };
        break;
    }

    return await API.patch(`/topics/${topicId}`, body);
  };

  const removeTopicFromSchedule = async(topicId: string) => {
    return await API.patch(`/topics/${topicId}`, {
      parentTopic: null,
      insertBefore: null,
      insertAfter: null,
    });
  };

  const deleteTopic = async(topicId: string) => {
    return API.del(`/topics/${topicId}`);
  };

  return {
    addTopic,
    updateTopicOrder,
    removeTopicFromSchedule,
    deleteTopic,
  };
}
