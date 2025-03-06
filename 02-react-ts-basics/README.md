## React with TypeScript

### Create a React Project with TypeScript

To start a new React project with TypeScript, use the following command:

```bash
npm create vite@latest project-name
```

### Defining Component Props Types

When defining props for components, we can explicitly declare their types:

```tsx
export default function CourseGoal(props: {
  title: string;
  description: string;
}) {
  return (
    <article>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button>Delete</button>
    </article>
  );
}
```

Here, `title` and `description` are required props, both of which are strings.

- We can also use **destructuring** with types, which helps in making the code cleaner:

```tsx
export default function CourseGoal({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button>Delete</button>
    </article>
  );
}
```

### Storing Props Types as a Custom Type or Interface

For better readability and maintainability, we can store the props' types in a `type` or `interface`:

```tsx
type CourseGoalProps = {
  title: string;
  description: string;
};

export default function CourseGoal({ title, description }: CourseGoalProps) {
  return (
    <article>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button>Delete</button>
    </article>
  );
}
```

This approach makes the code more modular and reusable, especially for larger components.

### Defining a Type for Props with Children

Sometimes, we want to pass other components or elements as children to our component. For this, we can use the `ReactNode` type, which represents anything that can be rendered in React:

```tsx
import { ReactNode } from "react";

interface CourseGoalProps {
  title: string;
  children: ReactNode;
}

export default function CourseGoal({ title, children }: CourseGoalProps) {
  return (
    <article>
      <div>
        <h2>{title}</h2>
        {children}
      </div>
      <button>Delete</button>
    </article>
  );
}
```

- `ReactNode` is a type that can be anything renderable by React, such as strings, numbers, JSX elements, arrays of JSX elements, etc.
- It comes from the `@types/react` package, which provides TypeScript definitions for React.

Alternatively, we can use `PropsWithChildren`, a utility type provided by React, which automatically adds the `children` prop to the component's props type:

```tsx
type CourseGoalProps = PropsWithChildren<{ title: string }>;

export default function CourseGoal({ title, children }: CourseGoalProps) {
  return (
    <article>
      <div>
        <h2>{title}</h2>
        {children}
      </div>
      <button>Delete</button>
    </article>
  );
}
```

By using `PropsWithChildren<T>`, you don't need to manually add the `children` prop, as it's automatically included.

#### Explicitly Use `type` in Imports

```tsx
import { type PropsWithChildren, type ReactNode } from "react";
```

- TypeScript strips `type`-only imports from the final JavaScript bundle during compilation, reducing the size of the output.
- It also improves code clarity by making it clear that these imports are for types only.

### `key` Prop

- The `key` prop is required for elements in a list or custom components, but it does not require explicit type definitions in TypeScript.

### Another Way of Typing Component

When using **arrow functions** (or function expressions) to define components, we can use `FC` (Functional Component) from React to type the component:

```tsx
import { type FC, type PropsWithChildren } from "react";

type CourseGoalProps = PropsWithChildren<{ title: string }>;

const CourseGoal: FC<CourseGoalProps> = ({ title, children }) => {
  return (
    <article>
      <div>
        <h2>{title}</h2>
        {children}
      </div>
      <button>Delete</button>
    </article>
  );
};

export default CourseGoal;
```

- `FC` is a generic type that tells TypeScript that the function is a React functional component and expects props of the specified type (`CourseGoalProps`).
- Note: `FC` cannot be used with function declarations, as it's specifically designed for function expressions.

### `useState` with TypeScript

In TypeScript, `useState` is a **generic function** that can infer types if the initial state is a primitive. However, when the initial value is complex or absent, TypeScript cannot infer the type, and we must explicitly provide it:

```tsx
import { useState } from "react";

type CourseGoal = {
  title: string;
  description: string;
  id: number;
};

export default function App() {
  const [goals, setGoals] = useState<CourseGoal[]>([]);

  function handleAddGoal() {
    setGoals((prevGoals) => {
      const newGoal: CourseGoal = {
        id: Math.random(),
        title: "Learn React + TS",
        description: "Learn it in depth",
      };
      return [...prevGoals, newGoal];
    });
  }

  return (
    <main>
      <button onClick={handleAddGoal}>Add Goal</button>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            <CourseGoal title={goal.title}>
              <p>{goal.description}</p>
            </CourseGoal>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

Here, we define the state type as `CourseGoal[]` to specify that `goals` is an array of `CourseGoal` objects.

### Passing Functions as Values

Sometimes we want to pass functions as props, such as deleting a goal. For this, we need to pass the function as a prop to child components:

```tsx
export default function App() {
  const [goals, setGoals] = useState<CourseGoal[]>([]);

  function handleDeleteGoal(id: number) {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  }

  return (
    <main>
      <CourseGoalList goals={goals} onDelete={handleDeleteGoal} />
    </main>
  );
}
```

The `handleDeleteGoal` function is passed to `CourseGoalList` as a prop, and inside the list, each goal component calls it when the delete button is clicked.

In the child component:

```tsx
type CourseGoalListProps = {
  goals: CourseGoal[];
  onDelete: (id: number) => void;
};

export default function CourseGoalList({
  goals,
  onDelete,
}: CourseGoalListProps) {
  return (
    <ul>
      {goals.map((goal) => (
        <li key={goal.id}>
          <CourseGoal id={goal.id} title={goal.title} onDelete={onDelete}>
            <p>{goal.description}</p>
          </CourseGoal>
        </li>
      ))}
    </ul>
  );
}
```

### Working with Events in TypeScript

When handling events like form submissions, we need to specify the event type. For example, with a form submission event, we can define it as `FormEvent<HTMLFormElement>`:

```tsx
import { FormEvent } from "react";

export default function NewGoal() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // without type definition, event object has 'any' type
    // since we're using onSubmit prop on form, the type of event is FormEvent
    // but a FormEvent doesn't have to come from the onSubmit prop on form
    // FormEvent is a generic type
    event.preventDefault();

    // built-in class provided by browser
    // to extract the input, we have to put the name prop on it
    new FormData(event.currentTarget);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="goal">Your goal</label>
        <input id="goal" type="text" name="goal" />
      </p>
      <p>
        <label htmlFor="summary">Short summary</label>
        <input id="summary" type="text" name="summary" />
      </p>
      <p>
        <button>Add Goal</button>
      </p>
    </form>
  );
}
```

In this case, the event type `FormEvent<HTMLFormElement>` specifies that the event is a form submission from a `<form>` element.

---

### Using `useRef()` with TypeScript

Another way of handling the event of submitting form is `useRef()`. `useRef` is a generic function, so we can specify the type of element it will reference

```tsx
import { FormEvent, useRef } from "react";

export default function NewGoal() {
  // ref value by default, contains undefined as a dafault starting value
  // put null as an initial value
  // useRef is a generic function
  const goal = useRef<HTMLInputElement>(null);
  const summary = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // without type definition, event object has 'any' type
    // since we're using onSubmit prop on form, the type of event is FormEvent
    // but a FormEvent doesn't have to come from the onSubmit prop on form
    // FormEvent is a generic type
    event.preventDefault();

    // handleSubmit will only be executed after the form is submittedn (so use ! after the current)
    // TS doesn't know we will entually connect the input to ref
    const enteredGoal = goal.current!.value;
    const enteredSummary = summary.current!.value;
  }
  // if we define the function inline, TS is able to infer the type
  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="goal">Your goal</label>
        <input id="goal" type="text" name="goal" ref={goal} />
      </p>
      <p>
        <label htmlFor="summary">Short summary</label>
        <input id="summary" type="text" name="summary" ref={summary} />
      </p>
      <p>
        {/* button in a form by default submit the form when the click event happens */}
        <button>Add Goal</button>
      </p>
    </form>
  );
}
```

In this case, we’re referencing `HTMLInputElement` for the goal and summary input fields
