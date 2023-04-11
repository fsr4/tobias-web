export class Meeting {
  public readonly id: string;
  public readonly dateTime: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parseFromData(data: Record<string, any>): Meeting {
    return new Meeting(data._id, new Date(data.dateTime));
  }

  constructor(id: string, dateTime: Date) {
    this.id = id;
    this.dateTime = dateTime;
  }
}
