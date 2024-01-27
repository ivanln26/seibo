"use client";

type Option = {
  value: string | number;
  description: string;
  key?: string | number;
};

type SelectProps = {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  defaultValue?: string | number;
  options: Option[];
};

export default function Select({
  id,
  name,
  label,
  options,
  required = false,
  defaultValue,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-y-1 group py-2">
      {label && (
        <label
          className="animate-all ease-in-out duration-300 group-focus-within:font-bold group-focus-within:text-primary-600 dark:group-focus-within:text-primary-200"
          htmlFor={id}
        >
          {label}
          {required && <span aria-label="required">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        className="h-12 px-4 rounded bg-transparent animate ease-in-out duration-300 outline outline-1 outline-neutral-variant-50 dark:outline-neutral-variant-60 focus:outline-2 focus:outline-primary-600 dark:focus:outline-primary-200"
        required={required}
        defaultValue={defaultValue}
      >
        {options.map(({ value, description, key }, i) => (
          <option value={value} key={key ? key : i}>
            {description}
          </option>
        ))}
      </select>
    </div>
  );
}
