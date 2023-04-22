import { Topic } from '@/models/Topic.ts';
import { APIData } from '@/utils/api-data.ts';

export class Meeting {
  public readonly id: string;
  public readonly dateTime: Date;
  public readonly topics: Topic[];

  public static parseFromData(data: APIData): Meeting {
    const topics = data.topics.map((t: APIData) => Topic.parseFromData(t));
    return new Meeting(data._id, new Date(data.dateTime), topics);
  }

  constructor(id: string, dateTime: Date, topics: Topic[]) {
    this.id = id;
    this.dateTime = dateTime;
    this.topics = topics;
  }
}
