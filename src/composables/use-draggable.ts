import { Ref } from 'vue';
import { Topic } from '@/models/Topic';
import API from '@/utils/api-handler';

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

type InsertType = 'before' | 'child' | 'after';

export function useDropArea(): UseDropArea {
  const dragOver = (event: DragEvent) => {
    if (!event.dataTransfer || !event.dataTransfer.types.includes(DRAG_CONTENT_TYPE)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const target = event.currentTarget as HTMLElement;
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

    await updateTopicOrder(topicId, targetTopicId, insertType);
  };

  return {
    dragOver,
    dragLeave,
    drop,
  };
}

async function updateTopicOrder(topicId: string, targetTopicId: string, insertType: InsertType) {
  try {
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

    console.log('req', body);
    const response = await API.patch(`/topics/${topicId}`, body);
    console.log(response);
  } catch (e) {
    console.error(e);
  }
}
