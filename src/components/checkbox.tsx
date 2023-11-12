"use client";

import { useState } from "react";

import Icon from "@/components/icons/icon";

type CheckboxProps = {
  id: string;
  name: string;
  checked?: boolean;
};

export default function Checkbox({ id, name, checked = false }: CheckboxProps) {
  const [check, setCheck] = useState(checked);

  return (
    <label className="relative" htmlFor={id}>
      <input
        id={id + "Hidden"}
        name={name}
        checked={!check}
        onChange={() => setCheck(!check)}
        disabled={check}
        type="hidden"
      />
      <input
        id={id}
        className="sr-only peer"
        name={name}
        checked={check}
        onChange={() => setCheck(!check)}
        type="checkbox"
      />
      <span className="block h-5 w-5 cursor-pointer rounded-sm border border-2 border-neutral-variant-50 peer-checked:border-0 peer-checked:bg-primary-600 dark:border-neutral-varialnt-60 peer-checked:dark:bg-primary-200" />
      <span className="absolute top-0.5 left-0.5 fill-transparent peer-checked:fill-white dark:fill-neutral-4">
        <Icon icon="check" height={16} width={16} />
      </span>
    </label>
  );
}
