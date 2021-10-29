import { Ref } from 'vue';
import { Topic } from '@/models/Topic';
import API from '@/utils/api-handler';

type UseDraggable = {
  drag: (event: DragEvent) => void,
  dragOver: (event: DragEvent) => void,
  dragLeave: (event: DragEvent) => void,
  drop: (event: DragEvent, callback: (() => void) | (() => Promise<void>)) => void
};

export default function useDraggable(topic?: Ref<Topic | undefined>): UseDraggable {
  const drag = (event: DragEvent) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', topic?.value?.id ?? '');
  };

  const dragOver = (event: DragEvent) => {
    if (!event.dataTransfer) return;
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
    } else if (y < 2 * offset && !target.dataset.parent) {
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
    if (!event.dataTransfer) return;
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;

    target.classList.remove('insert-above');
    target.classList.remove('insert-below');
    target.classList.remove('insert-sub');
  };

  const drop = async(event: DragEvent, callback: (() => void) | (() => Promise<void>)) => {
    if (!event.target || !event.dataTransfer) return;
    event.preventDefault();

    const target = event.currentTarget as HTMLElement;
    const targetPos = target.getBoundingClientRect();
    const y = event.y - targetPos.y;
    const offset = targetPos.height / 3;

    const topicId = event.dataTransfer.getData('text/plain');
    if (!target.dataset.position) return;

    const position = Number.parseInt(target.dataset.position);
    let newPosition;
    let newParent;

    if (y < offset) {
      // Insert above
      target.classList.remove('insert-above');
      newPosition = position;
      newParent = target.dataset.parent;
    } else if (y < 2 * offset && !target.dataset.parent) {
      // Insert as sub-topic
      target.classList.remove('insert-sub');
      newPosition = 1;
      newParent = target.dataset.topic;
    } else {
      // Insert below
      target.classList.remove('insert-below');
      newPosition = position + 1;
      newParent = target.dataset.parent;
    }

    try {
      const body: Record<string, unknown> = {
        position: newPosition,
        parent: newParent || null
      };

      console.log('req', body);
      const response = await API.patch(`/topics/${topicId}`, body);
      console.log(response);
    } catch (e) {
      console.error(e);
    }

    const result = callback();
    if (result instanceof Promise)
      await result;
  };

  return {
    drag,
    dragOver,
    dragLeave,
    drop
  };
}
