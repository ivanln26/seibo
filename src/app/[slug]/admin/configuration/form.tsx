"use client";

import { useState } from "react";
import { useFormState } from "react-dom";

import { updateAdminModel } from "@/app/actions";
import type { UpdateAdminModelResult } from "@/app/actions";
import Select from "@/components/select";
import SubmitButton from "@/components/submit-button";
import type { TwColor } from "@/color";
import type { School } from "@/db/schema";

const updateInitialState: UpdateAdminModelResult<"config"> = {
  success: true,
  message: "",
};

const twColors: Record<TwColor, string> = {
  primary: "bg-primary-500 dark:bg-primary-400",
  secondary: "bg-secondary-500 dark:bg-secondary-400",
  red: "bg-red-500 dark:bg-red-400",
  orange: "bg-orange-500 dark:bg-orange-400",
  yellow: "bg-yellow-500 dark:bg-yellow-400",
  lime: "bg-lime-500 dark:bg-lime-400",
  green: "bg-green-500 dark:bg-green-400",
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  cyan: "bg-cyan-500 dark:bg-cyan-400",
  blue: "bg-blue-500 dark:bg-blue-400",
  violet: "bg-violet-500 dark:bg-violet-400",
  purple: "bg-purple-500 dark:bg-purple-400",
  fuchsia: "bg-fuchsia-500 dark:bg-fuchsia-400",
  pink: "bg-pink-500 dark:bg-pink-400",
} as const;

const colors: { value: TwColor; name: string }[] = [
  { value: "primary", name: "Seibo" },
  { value: "secondary", name: "Seibo secundario" },
  { value: "red", name: "Rojo" },
  { value: "orange", name: "Amber" },
  { value: "yellow", name: "Amarillo" },
  { value: "lime", name: "Lima" },
  { value: "green", name: "Verde" },
  { value: "emerald", name: "Esmeralda" },
  { value: "cyan", name: "Cian" },
  { value: "blue", name: "Azul" },
  { value: "violet", name: "Violeta" },
  { value: "purple", name: "Púrpura" },
  { value: "fuchsia", name: "Fucsia" },
  { value: "pink", name: "Rosa" },
] as const;

function isTwColor(color: string): color is TwColor {
  return color in twColors;
}

type Props = {
  slug: string;
  school: School;
};

export default function Form({ slug, school }: Props) {
  const [primary, setPrimary] = useState<TwColor>(
    school.settings?.primary || "primary",
  );
  const [secondary, setSecondary] = useState<TwColor>(
    school.settings?.secondary || "secondary",
  );

  const updateAction = updateAdminModel.bind(null, "config", slug, school.id);
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
  );

  return (
    <>
      <form action={updateFormAction}>
        <h2 className="text-2xl">Color</h2>
        <div className="flex items-end gap-x-2">
          <div className="grow">
            <Select
              id="primary"
              name="primary"
              label="Primario"
              value={primary}
              onChange={(e) =>
                isTwColor(e.target.value)
                  ? setPrimary(e.target.value)
                  : setPrimary("primary")}
              options={colors.map((color) => ({
                value: color.value,
                description: color.name,
              }))}
            />
          </div>
          <div className="py-2">
            <div className={`h-12 w-20 rounded ${twColors[primary]}`} />
          </div>
        </div>
        <div className="flex items-end gap-x-2">
          <div className="grow">
            <Select
              id="secondary"
              name="secondary"
              label="Secundario"
              value={secondary}
              onChange={(e) =>
                isTwColor(e.target.value)
                  ? setSecondary(e.target.value)
                  : setSecondary("secondary")}
              options={colors.map((color) => ({
                value: color.value,
                description: color.name,
              }))}
            />
          </div>
          <div className="py-2">
            <div className={`h-12 w-20 rounded ${twColors[secondary]}`} />
          </div>
        </div>
        <SubmitButton />
      </form>
    </>
  );
}
