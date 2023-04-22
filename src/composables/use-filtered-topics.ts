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
    const mainTopics = topics.value.filter(t => !t.parentTopic && (t.previous || t.next));
    const firstTopic = mainTopics.filter(t => !t.previous)[0];
    if (!firstTopic) return [];
    return sortTopics(firstTopic, mainTopics);
  });

  const unusedTopics = computed((): Topic[] => {
    if (!topics.value) return [];
    return topics.value.filter(t => !t.parentTopic && !t.previous && !t.next);
  });

  const getSubTopics = (parent: string): Topic[] => {
    if (!topics.value) return [];
    const subTopics = topics.value.filter(t => t.parentTopic === parent);
    if (parent === '6435bbf4c1698c3a433de6d5') console.log(subTopics);
    const firstTopic = subTopics.filter(t => !t.previous)[0];
    if (!firstTopic) return [];
    return sortTopics(firstTopic, subTopics, parent === '6435bbf4c1698c3a433de6d5');
  };

  return {
    mainTopics,
    unusedTopics,
    getSubTopics,
  };
}

function sortTopics(head: Topic, topics: Topic[], log?: boolean): Topic[] {
  if (log) console.log('===', topics);

  function sort(sorted: Topic[], remaining: Topic[]): Topic[] {
    const nextTopicId = sorted[sorted.length - 1].next;
    if (!nextTopicId) return sorted;
    const nextIndex = remaining.findIndex(topic => topic.id === nextTopicId);
    if (nextIndex === -1) return sorted;
    const next = remaining.splice(nextIndex, 1)[0];
    sorted.push(next);
    return sort(sorted, remaining);
  }

  return sort([head], topics);
}
