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
