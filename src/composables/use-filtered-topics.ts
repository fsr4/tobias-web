import { computed, ComputedRef, Ref } from 'vue';
import { Topic } from '@/models/Topic';

type UseFilteredTopics = {
  mainTopics: ComputedRef<Topic[]>,
  unusedTopics: ComputedRef<Topic[]>,
  getSubTopics: (parent: string) => Topic[]
}

export default function useFilteredTopics(topics: Ref<Topic[] | undefined>): UseFilteredTopics {
  const mainTopics = computed(() => {
    if (!topics.value) return [];
    return topics.value
      .filter(t => t.position && !t.parent)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  });

  const unusedTopics = computed((): Topic[] => {
    if (!topics.value) return [];
    return topics.value.filter(t => !t.position);
  });

  const getSubTopics = (parent: string): Topic[] => {
    if (!topics.value) return [];
    return topics.value
      .filter(t => t.parent === parent)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  };

  return {
    mainTopics,
    unusedTopics,
    getSubTopics
  };
}
