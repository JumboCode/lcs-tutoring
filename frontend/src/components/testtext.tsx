import React, { useState } from "react";

export default function EditableText() {
  const [text, setText] = useState("Click the button to edit this text.");
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(text);

  const handleEdit = () => {
    setInput(text); // preload existing text
    setEditing(true);
  };

  const handleSubmit = () => {
    setText(input);
    setEditing(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <p className="mb-4">{text}</p>
      {!editing && (
        <button
          onClick={handleEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Text
        </button>
      )}
      {editing && (
        <div className="mt-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
