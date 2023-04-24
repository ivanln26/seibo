"use client";

import { SyntheticEvent } from "react";

export default function Form() {
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    await fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "hello",
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      <button>Submit</button>
    </form>
  );
}
