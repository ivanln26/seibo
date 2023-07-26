type TextFieldProps = {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  type?: "email" | "password" | "text" | "url";
};

export default function TextField({
  id,
  name,
  label,
  required,
  type,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-y-1 group py-2">
      <label
        className="left-5 group-focus-within:left-4 group-focus-within:-top-3 group-focus-within:font-bold group-focus-within:text-primary-600 dark:group-focus-within:text-primary-200"
        htmlFor={id}
      >
        {label}
        {required && (
          <span>
            <strong>*</strong>
          </span>
        )}
      </label>
      <input
        id={id}
        className="h-14 px-4 rounded bg-transparent outline outline-1 outline-outline focus:outline-2 focus:outline-primary-600 dark:focus:outline-primary-200"
        name={name}
        type={type}
        required={required}
      />
    </div>
  );
}
