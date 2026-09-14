export class StoryPurchasedEvent {
  constructor(
    public readonly payload: {
      userId: string;
      storyId: string;
      email: string;
    },
  ) {}
}
