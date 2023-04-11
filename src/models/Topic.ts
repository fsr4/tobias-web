export class Topic {
  public readonly id: string;
  public readonly title: string;
  public readonly parent: string | null;
  public readonly previous: string | null;
  public readonly next: string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parseFromData(data: Record<string, any>): Topic {
    const parent = data.parent?._id ? data.parent._id : data.parent;
    const previous = data.previous?._id ? data.previous._id : data.previous;
    const next = data.next?._id ? data.next._id : data.next;
    return new Topic(data._id, data.name, parent, previous, next);
  }

  constructor(
    id: string,
    title: string,
    parent: string | undefined,
    previous: string | undefined,
    next: string | undefined,
  ) {
    this.id = id;
    this.title = title;
    this.parent = parent ?? null;
    this.previous = previous ?? null;
    this.next = next ?? null;
  }
}
