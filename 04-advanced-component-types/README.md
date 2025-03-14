## Advanced Component Types

### Building Better Wrapper Components with `ComponentPropsWithoutRef`

When building reusable components in React, we often want them to be flexible and accept various props. In this case, we want to improve our `Input.jsx` component to support different input types, such as `text`, `number`, etc.

---

#### Making `Input` Component More Flexible

##### Initial Implementation (`Input.jsx`)

Initially, our `Input.jsx` component is defined as follows:

```tsx
import React from "react";

type InputProps = {
  label: string;
  id: string;
};

export default function Input({ label, id }: InputProps) {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </p>
  );
}
```

Here, the input field is always of type `"text"`, which means it is not flexible for other input types like `"number"`, `"email"`, etc.

#### Issue in `App.jsx`

If we try to use this component with different types in `App.jsx`, it won’t work as expected:

```tsx
import Input from "../components/Input";

function App() {
  return (
    <main>
      <Input id="name" label="Your name" type="text" />
      <Input id="age" label="Your age" type="number" />
    </main>
  );
}

export default App;
```

The `Input` component does not accept the `type` prop because our `InputProps` type does not include it.

#### Fix: Collecting Additional Props

To allow all valid input attributes, we can modify the `Input` component like this:

```tsx
import React from "react";

type InputProps = {
  label: string;
  id: string;
};

export default function Input({ label, id, ...props }: InputProps) {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </p>
  );
}
```

However, this version of the code results in a TypeScript error because `InputProps` does not include properties like `type`, `placeholder`, `value`, etc., which are valid attributes for an `<input>` element.

---

#### Solution: Using `ComponentPropsWithoutRef<"input">`

To fix this, we need to extend `InputProps` type using `ComponentPropsWithoutRef<"input">`, which includes all the valid attributes of a native `<input>` element:

```tsx
import React, { ComponentPropsWithoutRef } from "react";

// Extending input props using ComponentPropsWithoutRef
type InputProps = {
  label: string;
  id: string;
} & ComponentPropsWithoutRef<"input">;

export default function Input({ label, id, ...props }: InputProps) {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </p>
  );
}
```

#### What is `ComponentPropsWithoutRef`?

`ComponentPropsWithoutRef<"input">` is a **generic utility type** provided by React. It extracts all valid props that a standard `<input>` element accepts, excluding `ref`.

#### Advantages of `ComponentPropsWithoutRef`

1. The component can accept any valid `<input>` attribute without explicitly defining them.
2. Instead of hardcoding a limited set of props, the component can now accept any valid input-related attributes.
3. Without this, TypeScript would throw errors when passing props like `type`, `placeholder`, or `value` that were not explicitly included in `InputProps`.

---

### Building a Wrapper Component That Renders Different Elements

We can take this concept further and create a reusable **button component** that can render either a `<button>` or an `<a>` element, depending on the props provided.

#### Approach 1: Using an Explicit Identifier (`el`)

```tsx
import { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  el: "button";
} & ComponentPropsWithoutRef<"button">;

type AnchorProps = {
  el: "anchor";
} & ComponentPropsWithoutRef<"a">;

export default function Button(props: ButtonProps | AnchorProps) {
  if (props.el === "anchor") {
    return <a className="button" {...props}></a>;
  }
  return <button className="button" {...props}></button>;
}
```

#### Issue with This Approach

- We need to **explicitly specify** whether the component should render as a `<button>` or `<a>` using the `el` prop.
- This adds an extra step for the developer using the component.

---

### Working with Type Predicates & TypeScript Limitations

We can make the component **smarter** by automatically detecting whether it should render a `<button>` or an `<a>` element.

### Approach 2: Inferring the Element from Props (`href` Property Check)

```tsx
import { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;
type AnchorProps = ComponentPropsWithoutRef<"a">;

export default function Button(props: ButtonProps | AnchorProps) {
  if (props.href) {
    return <a className="button" {...props}></a>;
  }
  return <button className="button" {...props}></button>;
}
```

#### Issue with This Approach

- TypeScript throws an error when accessing `props.href` because it does not exist on `ButtonProps` (i.e., button elements do not have an `href` attribute).

#### Solution: Using a Type Predicate (`isAnchorProps`)

To fix this, we can use a **type predicate** to check whether the `href` property exists.

```tsx
import { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;
type AnchorProps = ComponentPropsWithoutRef<"a">;

// Type predicate function
function isAnchorProps(props: ButtonProps | AnchorProps): props is AnchorProps {
  return "href" in props;
}

export default function Button(props: ButtonProps | AnchorProps) {
  if (isAnchorProps(props)) {
    return <a className="button" {...props}></a>;
  }
  return <button className="button" {...props}></button>;
}
```

- **Definition of type predicate**

  a special return type for a function that tells TypeScript whether a value belongs to a specific type. It helps with type narrowing, allowing TypeScript to infer more precise types inside conditional checks.

- Syntax of a Type Predicate
  A type predicate is written as:

  ```tsx
  function functionName(value: any): value is SomeType { ... }
  ```

  Here, `value is SomeType` means that if the function returns true, TypeScript will treat value as `SomeType` within the checked scope.

- When to use type predicates?

  - When working with union types(`A | B`) and need to distinguish between them
  - When we need type narrowing in conditional statements
  - When dealing with generic components that behave differently based on props

- Downside of this apporach is the absence of the `href` prop doesn't mean that we're dealing with a button

### Building a Polymorphic Component

- A polymorphic component allows different elements dynamically via an `as` prop

```tsx
import React, { ElementType } from "react";

// receive the identifier of the component that should be returned by the Container component
type ContainerProps = {
  as: ElementType;
};

export default function Container({ as }: ContainerProps) {
  const Component = as; // remap the name so that we can use it as conponent (It should start with uppercase)
  return <Component />;
}
```

- `ElementType`: allows the component prop to accept a React component (like `MyComponent`) or an HTML element type (like `div`, `section`, etc.)

- To accept `children` prop, we can make Container more flexible.

```tsx
import React, { ElementType, ReactNode } from "react";

// receive the identifier of the component that should be returned by the Container component
type ContainerProps = {
  as: ElementType;
  children: ReactNode;
};

export default function Container({ as, children }: ContainerProps) {
  const Component = as; // remap the name so that we can use it as conponent (It should start with uppercase)
  return <Component />;
}
```

- We might want `Component` to accpet more props on it
- The thing is, we don't know what kind of component will be passed as a value for `as`

```tsx
import React, {
  ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

// receive the identifier of the component that should be returned by the Container component
type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;
// ElementType : wants the name of a component, not JSX code that already renders component
// ReactNode : wants JSX code
// ComponentPropsWithoutRef : holds the default props accepted by one of the built-in elements & custom components

// We don't know what kind of component will be passed as a value for as
// SOLUTION : make ContainerProps a generic type

// Polymorphic Component
export default function Container<C extends ElementType>({
  as,
  children,
  ...props
}: ContainerProps<C>) {
  const Component = as || "div"; // remap the name so that we can use it as conponent (It shoul start with uppercase)
  return <Component {...props}>{children}</Component>;
}
```

- Solution : Make `ContainerProps` generic type

  -` T extends ElementType` : means the type should be based on `ElementType`

### Using `forwardRef` with TypeScript

#### Issue with `ComponentPropsWithRef`

In the following example, we might consider using `ComponentPropsWithRef<"input">` to handle the `ref` prop:

```tsx
import React, { ComponentPropsWithRef } from "react";

type InputProps = {
  label: string;
  id: string;
} & ComponentPropsWithRef<"input">;

export default function Input({ label, ref, id, ...props }: InputProps) {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} ref={ref} />
    </p>
  );
}
```

However, this code does not work as expected.

#### Why does this happen?

- Although `ComponentPropsWithRef<"input">` adds a `ref` property to the props, it only modifies the type definition.
- The `ref` is not actually forwarded to the underlying `<input>` element.
- Without `forwardRef`, `ref.current` will always remain at its initial value and will not reference the actual DOM element.

#### Correct Approach: Using `forwardRef`

To properly forward the `ref`, we need to use `forwardRef`:

```tsx
import React, { ComponentPropsWithoutRef, forwardRef } from "react";

type InputProps = {
  label: string;
  id: string;
} & ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, ...props },
  ref
) {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} ref={ref} />
    </p>
  );
});

export default Input;
```

#### Why `forwardRef` is necessary

- `forwardRef` is a **generic function** that allows us to pass a `ref` to the child component.
- Without specifying the type, TypeScript does not know what type of value the `ref` object will hold.
- Using `forwardRef<HTMLInputElement, InputProps>` explicitly defines both the ref type (`HTMLInputElement`) and the props type (`InputProps`), ensuring proper type safety.

### Building Another Wrapper Component (Custom Form Component)

- We can build a custom `Form` component that behaves like a native <form> while accepting all its default props.

```tsx
import React, { type ComponentPropsWithoutRef } from "react";

type FormProps = ComponentPropsWithoutRef<"form">;
// a wrapper component that should accept all props of form
export default function Form(props: FormProps) {
  return <form {...props}>{props.children}</form>;
}
```

- `ComponentPropsWithoutRef<"form">` ensures that Form can accept all standard `<form>` attributes.
- `{...props}` spread operator passes all received props to the underlying `<form>`, maintaining full functionality.
- `props.children` allows the component to wrap and render any child elements inside the form.

```tsx
import { useRef } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Form from "../components/Form";

function App() {
  return (
    <main>
      <Form>
        <Input type="text" label="Number" id="name" />
        <Input type="number" label="Age" id="age" />
        <p>
          <Button>Save</Button>
        </p>
      </Form>
    </main>
  );
}

export default App;
```

### Sharing Logic with `unknown` & Type Casting

```tsx
import React, { type FormEvent, type ComponentPropsWithoutRef } from "react";

type FormProps = ComponentPropsWithoutRef<"form"> & {
  onSave: (value: unknown) => void;
  // we don't know what kind of data will be collected
};
// a wrapper component that should accept all props of form
export default function Form(props: FormProps) {
  // which element triggered event
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // automatically gather all the values that have been entered into input field
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData); // convert formData object to a simpler object where we can access data with data.name
    props.onSave(data);
  }
  return (
    <form onSubmit={handleSubmit} {...props}>
      {props.children}
    </form>
  );
}
```

- The form can collect different types of data, but the exact structure is unknown.
- Using `unknown` prevents incorrect assumptions about the data type.
- The consumer of Form (here `App.tsx`) can cast the data into a known shape.

```tsx
import Button from "../components/Button";
import Input from "../components/Input";
import Form from "../components/Form";

function App() {
  function handleSave(data: unknown) {
    const extractedData = data as { name: string; age: string };
    console.log(extractedData);
  }
  return (
    <main>
      <Form onSave={handleSave}>
        <Input type="text" label="Number" id="name" />
        <Input type="number" label="Age" id="age" />
        <p>
          <Button>Save</Button>
        </p>
      </Form>
    </main>
  );
}

export default App;
```

- In `App.jsx`, we know what type of the input fields are
- `as` : convert type to another type

- However, when spreading props in `<form {...props}>`, React attempted to pass `onSave` as a DOM attribute, causing the warning:
  `Warning: Unknown event handler property `onSave`. It will be ignored.`

#### Solution : Destructure `onSave`

- `onSave` is not a standard prop that would exist on `<form>`
- We need to pull out that custom prop as a separate prop

```tsx
import React, { type FormEvent, type ComponentPropsWithoutRef } from "react";

type FormProps = ComponentPropsWithoutRef<"form"> & {
  onSave: (value: unknown) => void;
  // we don't know what kind of data will be collected
};
// a wrapper component that should accept all props of form
export default function Form({ onSave, children, ...otherProps }: FormProps) {
  // which element triggered event
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // automatically gather all the values that have been entered into input field
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData); // convert formData object to a simpler object where we can access data with data.name
    onSave(data);
  }
  return (
    <form onSubmit={handleSubmit} {...otherProps}>
      {children}
    </form>
  );
}
```

### Exposing Component APIs with `useImperativeHandle`

- In some cases, we might want to expose certain methods or APIs from a child component to the parent component.
- `useImperativeHandle` defines which instance values (methods or properties) should be exposed to the parent component when using `forwardRef`

```tsx
import React, {
  type FormEvent,
  type ComponentPropsWithoutRef,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

export type FormHandle = {
  clear: () => void;
};

type FormProps = ComponentPropsWithoutRef<"form"> & {
  onSave: (value: unknown) => void;
  // we don't know what kind of data will be collected
};
// a wrapper component that should accept all props of form
const Form = forwardRef<FormHandle, FormProps>(function Form(
  { onSave, children, ...otherProps },
  ref
) {
  const form = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => {
    return {
      clear() {
        console.log("CLEARING");
        form.current?.reset();
      },
    };
  }); // works with forwardRef

  // which element triggered event
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // automatically gather all the values that have been entered into input field
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData); // convert formData object to a simpler object where we can access data with data.name
    onSave(data);
    form.current?.reset();
  }
  return (
    <form onSubmit={handleSubmit} ref={form} {...otherProps}>
      {children}
    </form>
  );
});

export default Form;
```

- `FormHandle` defines the methods that the `Form` component exposes to its parent component through `forwardRef`
- By using `useImperativeHandle`, the `Form` component makes its internal methods accessible from outside

```tsx
import Button from "../components/Button";
import Input from "../components/Input";
import Form, { type FormHandle } from "../components/Form";
import { useRef } from "react";

function App() {
  const customForm = useRef<FormHandle>(null);

  function handleSave(data: unknown) {
    const extractedData = data as { name: string; age: string };
    console.log(extractedData);
    customForm.current?.clear();
  }
  return (
    <main>
      <Form onSave={handleSave} ref={customForm}>
        <Input type="text" label="Number" id="name" />
        <Input type="number" label="Age" id="age" />
        <p>
          <Button>Save</Button>
        </p>
      </Form>
    </main>
  );
}

export default App;
```
