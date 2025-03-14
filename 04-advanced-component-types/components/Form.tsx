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
