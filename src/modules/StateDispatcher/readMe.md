# How to use

  1. Describe your state and the events your store will emit:

    ```ts
    type State = {
        userName: string;
        userAge: number;
        isAdmin: boolean;
        bornYear?: number;
        
    };

    type Events = {
      userName: string;
      userAge: number;
      isAdmin: boolean;
    };
    ```

  2. Provide initial state and a setter map. Each setter receives the current `state` and the new `value`. Mutate the state in place. If you `return` something, listeners will receive the returned value; otherwise they receive the original `value`.

    ```ts
    const INITIAL_STATE: State = {
      userName: "",
      userAge: 0,
      isAdmin: false,
    };

    const SETTERS: SetterMap<State, Events> = {
      userName(state, value) {
        state.userName = value;
      },
      userAge(state, value) {
        state.userAge = value;
        return {
          age: value,
          bornYear: new Date().getFullYear() - value,
        };
      },
      isAdmin(state, value) {
        state.isAdmin = value;
      },
    };
    ```

  3. Extend `StateDispatcher` to create your concrete manager:

    ```ts
    class UserManager extends StateDispatcher<State, Events> {
      constructor() {
        super(INITIALS_TATE, SETTERS, { maxListeners: 50 });
      }
    }

    const user = new UserManager();
    ```

  4. Use it. Setters are auto-generated from the keys of your events type and are fully typed:

    ```ts
    const manager = useRef(new UserManager());
    const [name, setName] = useState(manager.current.getValue("userName"));
    const [age, setAge] = useState(manager.current.getValue("userAge"));
    const [isAdmin, setIsAdmin] = useState(manager.current.getValue("isAdmin"));
    const [bornYear, setBornYear] = useState(manager.current.getValue("bornYear"));

    useEffect(() => {
        const unsubscribeName = manager.current.listen('userName', setName);
        const unsubscribeAge = manager.current.listen("userAge", ({age, bornYear}) => {
            setAge(age);
            setBornYear(bornYear);
        });
        return () => {
            unsubscribeName();
            unsubscribeAge();
            manager.current.destroy();
        };
    }, []);

    const onNameChange = (name: string) => {
        manager.current.setters.userName(name);
    };

    const onAgeChange = (age: number) => {
        manager.current.setters.userAge(age);
    };
    ```

## API

- **`new StateDispatcher(initialState, setters, config?)`** — constructor used from your subclass. `config.maxListeners` lets you raise the `EventEmitter` listener cap.
- **`getValue(selector)`** — read-only access to state via a selector. E.g. `manager.getValue(s => s.userName)`. Prevents direct writes to state from outside the manager.
- **`setters[event](value)`** — auto-generated, typed setter for each key of your `Events` type. Calls your setter function and emits an event with the same name.
- **`listen(event, cb)`** — subscribe to an event. Returns a function that removes the listener.
- **`destroy()`** *(protected)* — removes all listeners and marks the manager as destroyed. Call it from your subclass when the manager is no longer needed.
