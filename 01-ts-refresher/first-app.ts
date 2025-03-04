let userName = "Max";
const API_KEY = "abc"; // a constant can't be reassigned, so we don't have to specify the type

// userName = 34; // error
userName = "John";

let userAge: number = 30;
// userAge = "30"; // error

let isUserActive: boolean = true;
// isUserActive = 1; // error

// string, number, boolean

type StringOrNumber = string | number;

// union types
let userId: StringOrNumber = "123";
userId = "abc";

// object
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

// user = {}; // error

// array
let hobbies: Array<string>;
let ages: number[];

hobbies = ["Sports", "Cooking"];
// hobbies = [1, 2, 3]; // error

// Add types to functions
function greet(name: string): void {
  console.log(`Hello, ${name}`);
}

// return type can be inferred, so it's optional
function add(a: number, b: number): number {
  return a + b;
}

type AddFn = (a: number, b: number) => number;

// In javascript, functions are values, so we can assign types to them
function calculate(a: number, b: number, calcFn: AddFn) {
  return calcFn(a, b);
}

// interfaces usually define objects
interface Credentials {
  email: string;
  password: string;
}

// interface Credentials {
//   mode: string;
// }

let creds: Credentials;

creds = {
  email: "jiyun@gmail.com",
  password: "123",
};

class AuthCredentials implements Credentials {
  email: string;
  password: string;
  userName: string;
}

// merge types
// type Admin = {
//   permissions: string[];
// };

// type AppUser = {
//   userName: string;
// };

// // AppAdmin is a combination of two types
// type AppAdmin = Admin & AppUser;

// let admin: AppAdmin;

// admin = {
//   permissions: ["login"],
//   userName: "Jiyun",
// };

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

// literal type
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
