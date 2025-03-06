import { FormEvent, useRef } from "react";

type NewGoalProps = {
  onAddGoal: (goal: string, summary: string) => void;
};

export default function NewGoal({ onAddGoal }: NewGoalProps) {
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

    // built-in class provided by browser
    // to extract the input, we have to put the name prop on it
    // new FormData(event.currentTarget);

    // handleSubmit will only be executed after the form is submittedn (so use ! after the current)
    // TS doesn't know we will entually connect the input to ref
    const enteredGoal = goal.current!.value;
    const enteredSummary = summary.current!.value;

    event.currentTarget.reset();
    onAddGoal(enteredGoal, enteredSummary);
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
