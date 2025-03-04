## TypeScript Basics

### What is TypeScript?

- A superset of JavaScript
- Enhances development by adding type safety and catching potential errors
- Does not run directly in the browser; must be compiled to JavaScript during the build process

### Type Inference & Explicit Type Annotation

- **Type Inference**: TypeScript automatically determines the type of a variable based on its value.

  ```typescript
  let message = "Hello, TypeScript!"; // Inferred as string
  let count = 10; // Inferred as number
  ```

- **Explicit Type Annotation**: Developers can manually specify types to ensure clarity and avoid unexpected behavior.
  ```typescript
  let username: string = "JohnDoe";
  let age: number = 25;
  let isActive: boolean = true;
  ```

### Basic Primitive Types

- TypeScript provides basic types such as `string`, `number`, and `boolean`.

  ```typescript
  let userName = "Max";
  // userName = 34; // Error
  userName = "John";

  let userAge: number = 30;
  // userAge = "30"; // Error

  let isUserActive: boolean = true;
  // isUserActive = 1; // Error
  ```

### Invoking the TypeScript Compiler

To compile a TypeScript file into JavaScript, use:

```sh
tsc file_name
```

Or, using `npx`:

```sh
npx tsc file_name
```

### Union Types

- A variable can hold multiple types using the `|` (union) operator.

  ```typescript
  let userId: string | number = "123";
  userId = "abc";
  userId = 456; // Valid
  ```

### Object Types

- The `object` type can store any object but does not enforce a specific structure.

  ```typescript
  let user: object;

  user = {
    name: "Jiyun",
    age: 23,
    isAdmin: true,
    id: "jiyun123",
  };

  user = {}; // Valid, but lacks structure enforcement
  ```

- To define a specific object structure, use explicit type annotations.

  ```typescript
  let user: {
    name: string;
    age: number;
    isAdmin: boolean;
    id: string | number;
  };

  user = {
    name: "Jiyun",
    age: 23,
    isAdmin: true,
    id: "jiyun123",
  };

  user = {}; // Error: missing required properties
  ```

### Array Types

- Arrays can be defined using `Array<type>` or `type[]`.

  ```typescript
  let hobbies: Array<string>;
  let ages: number[];

  hobbies = ["Sports", "Cooking"];
  // hobbies = [1, 2, 3]; // Error
  ```

### Adding Types to Functions

- Function parameters and return values can be explicitly typed.

  ```typescript
  function greet(name: string): void {
    console.log(`Hello, ${name}`);
  }

  // Return type can be inferred, so it's optional
  function add(a: number, b: number): number {
    return a + b;
  }
  ```

### Defining Function Types

- Functions can accept other functions as arguments using function types.

  ```typescript
  function calculate(
    a: number,
    b: number,
    calcFn: (a: number, b: number) => number
  ): number {
    return calcFn(a, b);
  }
  ```

### Creating Custom Types

- TypeScript allows defining custom types using the `type` keyword to improve readability and reusability.
- It is not built into JavaScript, but TypeScript

#### Function Type Alias

- In JavaScript, functions are values, so TypeScript allows assigning types to them.

  ```typescript
  type AddFn = (a: number, b: number) => number;

  function calculate(a: number, b: number, calcFn: AddFn) {
    return calcFn(a, b);
  }
  ```

#### Union Type Alias

- Instead of repeatedly using union types, a type alias can be defined.

  ```typescript
  type StringOrNumber = string | number;

  let userId: StringOrNumber = "123";
  userId = 456; // Valid
  ```

#### Object Type Alias

- Defining an object structure with a type alias ensures consistency and reusability.

  ```typescript
  type User = {
    name: string;
    age: number;
    isAdmin: boolean;
    id: string | number;
  };

  let user: User;

  user = {
    name: "Jiyun",
    age: 23,
    isAdmin: true,
    id: "jiyun123",
  };
  ```

Using type aliases improves code maintainability and readability while preventing redundant type definitions.

### Defining Object Types with Interfaces

- An `interface` is used to define the structure of an object in TypeScript.

  ```typescript
  interface Credentials {
    email: string;
    password: string;
  }

  let creds: Credentials;

  creds = {
    email: "jiyun@gmail.com",
    password: "123",
  };
  ```

### `type` vs `interface`

| Feature                  | `type` Alias                                              | `interface`                                  |
| ------------------------ | --------------------------------------------------------- | -------------------------------------------- |
| **Object Types**         | Yes                                                       | Yes                                          |
| **Union Types**          | Yes                                                       | No                                           |
| **Extensibility**        | No (cannot be reopened)                                   | Yes (can be extended or merged)              |
| **Class Implementation** | Yes                                                       | Yes                                          |
| **Preferred Use Case**   | Use for unions, primitive types, and complex compositions | Use for defining object shapes and contracts |

#### Interface as a Contract

- Interfaces act as a contract that classes must follow when implementing them.

  ```typescript
  interface Credentials {
    email: string;
    password: string;
  }

  let creds: Credentials;

  creds = {
    email: "jiyun@gmail.com",
    password: "123",
  };

  class AuthCredentials implements Credentials {
    email: string;
    password: string;
    userName: string; // Additional property
  }
  ```

#### Extending Interfaces

- Unlike `type`, `interface` can be extended, allowing additional properties to be added.

  ```typescript
  interface Credentials {
    email: string;
    password: string;
  }

  interface Credentials {
    mode: string;
  }

  let creds: Credentials = {
    email: "jiyun@gmail.com",
    password: "123",
    mode: "admin",
  };
  ```

### Merge Types

- use type alias:

  - combines multiple types using the `&` operator

    ```typescript
    type Admin = {
      permissions: string[];
    };

    type AppUser = {
      userName: string;
    };

    // AppAdmin is a combination of two types
    type AppAdmin = Admin & AppUser;

    let admin: AppAdmin;

    admin = {
      permissions: ["login"],
      userName: "Jiyun",
    };
    ```

- use interface:

  - interface supports extension using extends

    ```typescript
    interface Admin {
      permissions: string[];
    }

    interface AppUser {
      userName: string;
    }

    interface AppAdmin extends Admin, AppUser {}

    let admin: AppAdmin;

    admin = {
      permissions: ["login"],
      userName: "Jiyun",
    };
    ```

### Literal Type

- A literal type restricts a variable to a specific set of values

  ```typescript
  let role: "admin" | "user" | "editor";

  role = "admin";
  role = "user";
  role = "editor";
  // role = "abc"; // error
  ```

- This is useful when working with predefined categories, such as user roles, themes, or status values

### Type Guard

```typescript
type Role = "admin" | "user" | "editor";
let role: Role;

role = "admin";
role = "user";
role = "editor";
// role = "abc"; // error

function performAction(action: string, role: Role) {
  if (role === "admin" && typeof action === "string") {
    // ...
  }
}
```

### Generic Types

- Generic types allow creating reusable components that work with a variety of data types
- They provide flexibility while maintaining type safety

```typescript
let roles: Array<Role>;
roles = ["admin", "editor"];

// it can be used with all kinds of data
// it's flexible
type DataStorage<T> = {
  storage: T[];
  add: (data: T) => void;
};

const textStorage: DataStorage<string> = {
  storage: [],
  add(data) {
    this.storage.push(data);
  },
};

const userStorage: DataStorage<User> = {
  storage: [],
  add(user) {
    this.storage.push(user);
  },
};
```

- A generic function allows working with multiple types dynamically

```typescript
function merge<T, U>(a: T, b: U) {
  return {
    ...a,
    ...b,
  };
}

const newUser = merge<{ name: string }, { age: number }>(
  { name: "Jiyun" },
  { age: 23 }
);
```
