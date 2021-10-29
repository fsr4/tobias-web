export class Topic {
  public readonly id: string;
  public readonly title: string;
  public readonly position: number | null;
  public readonly parent: string | null;
  public readonly fullPosition: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public static parseFromData(data: any): Topic {
    const parent = data.parent?._id ? data.parent._id : data.parent;
    return new Topic(data._id, data.name, data.position, parent, data.fullPosition);
  }

  constructor(id: string, title: string, position: number | undefined, parent: string | undefined, fullPosition: string) {
    this.id = id;
    this.title = title;
    this.position = position ?? null;
    this.parent = parent ?? null;
    this.fullPosition = fullPosition;
  }
}
