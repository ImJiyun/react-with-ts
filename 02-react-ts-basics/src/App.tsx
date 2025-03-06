import CourseGoal from "./components/CourseGoal";
import goalsImg from "./assets/goals.jpg";
import Header from "./components/Header.tsx";
import { useState } from "react";
import CourseGoalList from "./components/CourseGoalList.tsx";
import NewGoal from "./components/NewGoal.tsx";

export type CourseGoal = {
  title: string;
  description: string;
  id: number;
};

export default function App() {
  // if we put primitive types in useState, TS can infer the type
  // Otherwise, TS doesn't know what type of the state has
  // useState is a generic function

  const [goals, setGoals] = useState<CourseGoal[]>([]);

  function handleAddGoal(goal: string, summary: string) {
    // update the state based on previous one
    setGoals((prevGoals) => {
      const newGoal: CourseGoal = {
        id: Math.random(),
        title: goal,
        description: summary,
      };
      return [...prevGoals, newGoal];
    });
  }

  function handleDeleteGoal(id: number) {
    //filter generate a new array from an existing array
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  }

  return (
    <main>
      <Header image={{ src: goalsImg, alt: "A list of goals" }}>
        <h1>Your Course Goals</h1>
      </Header>
      <NewGoal onAddGoal={handleAddGoal} />
      <CourseGoalList goals={goals} onDelete={handleDeleteGoal} />
    </main>
  );
}
