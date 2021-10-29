export class Meeting {
  public readonly id: string;
  public readonly dateTime: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public static parseFromData(data: any): Meeting {
    return new Meeting(data._id, new Date(data.dateTime));
  }

  constructor(id: string, dateTime: Date) {
    this.id = id;
    this.dateTime = dateTime;
  }
}
