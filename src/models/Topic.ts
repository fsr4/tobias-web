import { APIData } from '@/utils/api-data.ts';

export class Topic {
  public readonly id: string;
  public readonly title: string;
  public readonly parentTopic: string | null;
  public readonly previous: string | null;
  public readonly next: string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parseFromData(data: APIData): Topic {
    const parentTopic = data.parentTopic?._id ? data.parentTopic._id : data.parentTopic;
    const previous = data.previous?._id ? data.previous._id : data.previous;
    const next = data.next?._id ? data.next._id : data.next;
    return new Topic(data._id, data.name, parentTopic, previous, next);
  }

  constructor(
    id: string,
    title: string,
    parentTopic: string | undefined,
    previous: string | undefined,
    next: string | undefined,
  ) {
    this.id = id;
    this.title = title;
    this.parentTopic = parentTopic ?? null;
    this.previous = previous ?? null;
    this.next = next ?? null;
  }
}
