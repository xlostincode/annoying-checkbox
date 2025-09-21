import Checkbox from "@/components/checkbox";
import { Button } from "@/components/ui/button";
import React from "react";

const OPTIONS = [
  {
    id: 1,
    label: "Superhuman Procrastination",
    value: "superhuman-procrastination",
  },
  {
    id: 2,
    label: "Breath Under Lava",
    value: "lava-breathing",
  },
  {
    id: 3,
    label: "Super speed for 5 seconds a day",
    value: "super-speed",
  },
  {
    id: 4,
    label: "Untangle any earphones",
    value: "untangle-earphones",
  },
  {
    id: 5,
    label: "Plug the USB on the first try",
    value: "plug-usb",
  },
];

function App() {
  const inputs = React.useRef(new Array(OPTIONS.length).fill(null));

  const submit = () => {
    console.log(inputs.current);
    if (inputs.current.every((val) => !val)) {
      alert("Please select at least one option");
      return;
    }

    alert(`You selected:\n
${inputs.current
  .filter((input) => input)
  .map((input) => input.label + "\n")
  .join("")}
    `);
  };

  return (
    <main className="h-screen w-full flex flex-col items-center bg-stone-950 text-stone-50 p-10 gap-10">
      <div className="text-center">
        <h1 className="text-2xl">Annoying Checkbox</h1>
        <p>
          Just a fun UI experiment. A checkbox that you have to fill out in
          order to select.
        </p>
        <p>Give it a try!</p>
      </div>

      <div className="flex flex-col gap-2 border border-dashed p-8 rounded-md">
        <h2 className="text-lg my-2">
          Select your favourite useless superpowers:
        </h2>

        {OPTIONS.map((option, index) => (
          <Checkbox
            key={option.id}
            width={24}
            height={24}
            label={option.label}
            value={option.value}
            onChange={(checked, value) => {
              if (checked) {
                console.log(value, checked);
                inputs.current[index] = option;
              }
            }}
          />
        ))}

        <Button onClick={submit}>Submit</Button>
      </div>

      <footer className="text-sm flex gap-4 fixed bottom-2 left-2">
        <a
          href="https://github.com/xlostincode/annoying-checkbox"
          target="_blank"
        >
          Github
        </a>
        <a href="https://x.com/0xlostincode" target="_blank">
          X/Twitter
        </a>
        <a href="https://www.youtube.com/@0xLostInCode" target="_blank">
          Youtube
        </a>
      </footer>
    </main>
  );
}

export default App;
