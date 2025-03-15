### Creating a Context & Fitting Types

```tsx
import { createContext } from "react";

type Timer = {
  name: string;
  duration: string;
};

type TimerState = {
  isRunning: boolean;
  timers: Timer[];
};

type TimersContextValue = TimerState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};

const TimersContext = createContext<TimersContextValue | null>(null); // returns a context object
// context manages component-cross data
// predefine the type of data
```

### Creating a Type-Safe Provider Component

```tsx
type TimersContextProviderProps = {
  children: ReactNode;
};

export default function TimersContextProvider({
  children,
}: TimersContextProviderProps) {
  const ctx: TimersContextValue = {
    timers: [],
    isRunning: false,
    addTimer(timerData) {
      // ...
    },
    startTimers() {
      // ...
    },
    stopTimers() {
      // ...
    },
  };
  return (
    <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
  );
}
```

### Accessing Context Type-Safe With A Custom Hook

```tsx
export function useTimersContext() {
  const timersCtx = useContext(TimersContext);

  if (timersCtx === null) {
    throw new Error("TimersContext is null - that should not be the case!");
  }

  return timersCtx;
}
```

```tsx
import Button from "./UI/Button.tsx";
import { useTimersContext } from "../store/timers-context.tsx";

export default function Header() {
  const timersCtx = useTimersContext();
  return (
    <header>
      <h1>ReactTimer</h1>

      <Button>{timersCtx.isRunning ? "Stop" : "Start"} Timers</Button>
    </header>
  );
}
```

### `timers-context.tsx`

```tsx
import { createContext, useContext, useReducer, type ReactNode } from "react";
import Timers from "../components/Timers";

type Timer = {
  name: string;
  duration: number;
};

type TimersState = {
  isRunning: boolean;
  timers: Timer[];
};

type TimersContextValue = TimersState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};

export const TimersContext = createContext<TimersContextValue | null>(null); // returns a context object
// context manages component-cross data
// predefine the type of data

export function useTimersContext() {
  const timersCtx = useContext(TimersContext);

  if (timersCtx === null) {
    throw new Error("TimersContext is null - that should not be the case!");
  }

  return timersCtx;
}

type TimersContextProviderProps = {
  children: ReactNode;
};

const initialState: TimersState = {
  isRunning: true,
  timers: [],
};

type StartTimersAction = {
  type: "START_TIMERS";
};

type StopTimersAction = {
  type: "STOP_TIMERS";
};

type AddTimersAction = {
  type: "ADD_TIMER";
  payload: Timer;
};

type Action = StartTimersAction | StopTimersAction | AddTimersAction;

function timersReducer(state: TimersState, action: Action): TimersState {
  if (action.type === "START_TIMERS") {
    return {
      ...state,
      isRunning: true,
    };
  }
  if (action.type === "STOP_TIMERS") {
    return {
      ...state,
      isRunning: false,
    };
  }

  if (action.type === "ADD_TIMER") {
    return {
      ...state,
      timers: [
        ...state.timers,
        { name: action.payload.name, duration: action.payload.duration },
      ],
    };
  }
  return state;
}

export default function TimersContextProvider({
  children,
}: TimersContextProviderProps) {
  const [timersState, dispatch] = useReducer(timersReducer, initialState);

  const ctx: TimersContextValue = {
    timers: timersState.timers,
    isRunning: timersState.isRunning,
    addTimer(timerData) {
      dispatch({ type: "ADD_TIMER", payload: timerData });
    },
    startTimers() {
      dispatch({ type: "START_TIMERS" });
    },
    stopTimers() {
      dispatch({ type: "STOP_TIMERS" });
    },
  };
  return (
    <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
  );
}
```
