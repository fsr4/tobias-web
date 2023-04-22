import { Ref } from 'vue';
import { Topic } from '@/models/Topic';
import useTopicAPI, { InsertType } from '@/composables/use-topic-api.ts';

const DRAG_CONTENT_TYPE = 'application/vnd.topic-tool.topic-item';

type UseDraggable = (event: DragEvent) => void;

type UseDropArea = {
  dragOver: (event: DragEvent) => void,
  dragLeave: (event: DragEvent) => void,
  drop: (event: DragEvent) => void,
};

export function useDraggable(topic: Ref<Topic>): UseDraggable {
  return (event: DragEvent) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'move';
    // use setData to work around WebKit bug preventing us from using `effectAllowed` on drop checking
    event.dataTransfer.setData(DRAG_CONTENT_TYPE, '');
    event.dataTransfer.setData('text/plain', topic.value.id);
  };
}

export function useDropArea(): UseDropArea {
  const dragOver = (event: DragEvent) => {
    if (!event.dataTransfer || !event.dataTransfer.types.includes(DRAG_CONTENT_TYPE)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const target = event.currentTarget as HTMLElement;

    const topicId = event.dataTransfer.getData('text/plain');
    const targetTopicId = target.dataset.topic;
    // Disallow interacting with self
    if (topicId === targetTopicId) return;

    const targetPos = target.getBoundingClientRect();
    const y = event.y - targetPos.y;
    const offset = targetPos.height / 3;

    if (y < offset) {
      target.classList.remove('insert-below');
      target.classList.remove('insert-sub');
      target.classList.add('insert-above');
    } else if (y < 2 * offset/* && !target.dataset.parent */) {
      target.classList.remove('insert-above');
      target.classList.remove('insert-below');
      target.classList.add('insert-sub');
    } else {
      target.classList.remove('insert-sub');
      target.classList.remove('insert-above');
      target.classList.add('insert-below');
    }
  };

  const dragLeave = (event: DragEvent) => {
    if (!event.dataTransfer || !event.dataTransfer.types.includes(DRAG_CONTENT_TYPE)) return;
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;

    target.classList.remove('insert-above');
    target.classList.remove('insert-below');
    target.classList.remove('insert-sub');
  };

  const drop = async(event: DragEvent) => {
    if (!event.target || !event.dataTransfer || !event.dataTransfer.types.includes(DRAG_CONTENT_TYPE)) return;
    event.preventDefault();

    const target = event.currentTarget as HTMLElement;
    const targetPos = target.getBoundingClientRect();
    const y = event.y - targetPos.y;
    const offset = targetPos.height / 3;

    const topicId = event.dataTransfer.getData('text/plain');
    const targetTopicId = target.dataset.topic;
    if (!targetTopicId) {
      throw new Error(`Topic ${target} is missing data-topic attribute`);
    }

    // Disallow interacting with self
    if (topicId === targetTopicId) return;

    let insertType: InsertType;
    if (y < offset) {
      target.classList.remove('insert-above');
      insertType = 'before';
    } else if (y < 2 * offset/* && !target.dataset.parent */) {
      target.classList.remove('insert-sub');
      insertType = 'child';
    } else {
      target.classList.remove('insert-below');
      insertType = 'after';
    }
    
    try {
      await useTopicAPI().updateTopicOrder(topicId, targetTopicId, insertType);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    dragOver,
    dragLeave,
    drop,
  };
}


