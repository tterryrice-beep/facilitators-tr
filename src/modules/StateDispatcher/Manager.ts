import { EventEmitter } from "events";

export type SetterMap<State, Events> = {
  [K in keyof Events]: (state: State, value: Events[K]) => void;
};

export abstract class StateDispatcher<
  StateValues,
  Events extends Record<string, any>,
> {
  protected readonly emitter = new EventEmitter();
  protected state: StateValues;
  protected isDestroyed = false;

  private activeSubscriptionCount = 0;
  private readonly minListeners: number;

  public readonly setters: {
    [K in keyof Events]: (value: Events[K]) => void;
  };

  constructor(
    initialState: StateValues,
    setters: SetterMap<StateValues, Events>,
    config?: {
      maxListeners?: number;
    },
  ) {
    this.state = initialState;

    this.setters = Object.fromEntries(
      Object.entries(setters).map(([key, fn]) => [
        key,
        (value: any) => {
          const result = fn(this.state, value);
          this.emitter.emit(key, result === undefined ? value : result);
        },
      ]),
    ) as {
      [K in keyof Events]: (value: Events[K]) => void;
    };

    this.minListeners = config?.maxListeners ?? Object.keys(setters).length;
    this.emitter.setMaxListeners(this.minListeners);
  }

  private updateMaxListeners() {
    this.emitter.setMaxListeners(
      Math.max(this.activeSubscriptionCount, this.minListeners),
    );
  }

  public listen = <K extends keyof Events>(
    key: K,
    cb: (value: Events[K]) => void,
  ): (() => void) => {
    this.activeSubscriptionCount++;
    this.updateMaxListeners();
    this.emitter.addListener(key as string, cb);
    return () => {
      this.emitter.removeListener(key as string, cb);
      this.activeSubscriptionCount--;
      this.updateMaxListeners();
    };
  };

  public getState = (): Readonly<StateValues> => this.state;

  protected destroyDispatcher = () => {
    this.emitter.removeAllListeners();
    this.emitter.setMaxListeners(0);
    this.isDestroyed = true;
  };
}
