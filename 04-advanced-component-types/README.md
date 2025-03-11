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
