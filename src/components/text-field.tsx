import Icon from "@/components/icons/icon";
import type { Icon as TIcon } from "@/components/icons/icon";

type TextFieldProps = {
  id: string;
  name: string;
  label?: string;
  helpText?: string;
  icon?: TIcon;
  required?: boolean;
  type?: "email" | "password" | "text" | "url";
  defaultValue?: string;
};

export default function TextField({
  id,
  name,
  label,
  helpText,
  icon,
  required,
  type,
  defaultValue,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-y-1 group py-2">
      {label && (
        <label
          className="left-5 animate-all ease-in-out duration-300 group-focus-within:left-4 group-focus-within:-top-3 group-focus-within:font-bold group-focus-within:text-primary-600 dark:group-focus-within:text-primary-200"
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
      <div className="relative">
        {icon && (
          <span className="absolute left-2 top-3 fill-black dark:fill-white group-focus-within:fill-primary-600 dark:group-focus-within:fill-primary-200">
            <Icon icon={icon} height={24} width={24} />
          </span>
        )}
        <input
          id={id}
          className={`h-12 ${
            icon ? "pl-10" : "pl-4"
          } text-base pr-4 w-full rounded bg-transparent outline outline-1 outline-outline animate-all ease-in-out duration-300 focus:outline-2 focus:outline-primary-600 dark:focus:outline-primary-200`}
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
        />
      </div>
      {helpText && (
        <span className="text-xs text-neutral-variant-30 dark:text-neutral-variant-90">
          {helpText}
        </span>
      )}
    </div>
  );
}
