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
      {/* <p>
        <Button>A Button</Button>
      </p>
      <p>
        <Button href="https://google.com">A Link</Button>
      </p> */}
      {/* <Container as={Button}>click me</Container> */}
      {/* <Input label="Test" id="test" ref={input} /> */}
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
