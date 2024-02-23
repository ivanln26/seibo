"use client";

import { useEffect, useState } from "react";

const time = /\d{2}\:\d{2}/;

export default function TimeInput({ id, name }: { id: string; name: string }) {
  const [data, setData] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data.trim() !== "" && !time.exec(data.trim())) {
      setError(true);
      return;
    }
    setError(false);
  }, [data]);

  return (
    <input
      id={id}
      name={name}
      className={`outline outline-1 bg-transparent ${
        error ? "outline-red-300" : "outline-outline"
      } rounded py-3 px-2`}
      value={data}
      onChange={(e) => setData(e.target.value)}
      required
      type="text"
    />
  );
}
