"use client";

import { useState } from "react";

type SwitchProps = {
  id: string;
  name: string;
  checked: boolean | undefined;
};

export default function Switch({ id, name, checked = false }: SwitchProps) {
  const [check, setCheck] = useState(checked);
  return (
    <label className="relative" htmlFor={id}>
      <input
        id={id + "Hidden"}
        name={name}
        type="hidden"
        checked={!check}
        onChange={() => setCheck(!check)}
        disabled={check}
        value="off"
      />
      <input
        id={id}
        className="sr-only peer"
        name={name}
        type="checkbox"
        checked={check}
        onChange={() => setCheck(!check)}
      />
      <div className="h-8 w-14 cursor-pointer rounded-full bg-neutral-variant-90 dark:bg-neutral-variant-30 peer-checked:bg-primary-600 peer-checked:dark:bg-primary-200 border border-2 peer-checked:border-0 border-neutral-variant-50 dark:border-neutral-variant-60" />
      <span className="h-4 w-4 peer-checked:h-6 peer-checked:w-6 absolute top-2 left-1.5 peer-checked:top-1 rounded-full bg-neutral-variant-50 dark:bg-neutral-variant-60 peer-checked:bg-white peer-checked:dark:bg-primary-800 transition-all peer-checked:translate-x-full" />
    </label>
  );
}
