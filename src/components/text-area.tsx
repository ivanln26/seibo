type Props = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
};

export default function TextArea(
  { id, name, defaultValue, label, required = false }: Props,
) {
  return (
    <div className="flex flex-col gap-y-1 group py-2">
      {label && (
        <label
          className="animate-all ease-in-out duration-300 group-focus-within:font-bold group-focus-within:text-primary-600 dark:group-focus-within:text-primary-200"
          htmlFor={id}
        >
          {label}
          {required && (
            <span aria-label="required">
              <strong>*</strong>
            </span>
          )}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        className="px-4 py-2 rounded bg-transparent outline outline-1 outline-outline animate-all ease-in-out duration-300 focus:outline-2 focus:outline-primary-600 dark:focus:outline-primary-200"
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  );
}
