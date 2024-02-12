"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { updateAdminModel } from "@/app/actions";
import type { UpdateAdminModelResult } from "@/app/actions";
import Select from "@/components/select";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";
import type { TwColor } from "@/color";
import type { School } from "@/db/schema";

const updateInitialState: UpdateAdminModelResult<"settings"> = {
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
    school.settings?.color.primary || "primary",
  );
  const [secondary, setSecondary] = useState<TwColor>(
    school.settings?.color.secondary || "secondary",
  );
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const updateAction = updateAdminModel.bind(null, "settings", slug, school.id);
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
  );

  useEffect(() => {
    if (updateState.success && updateState.message !== "") {
      setMessages(
        (prevArr) => [...prevArr, {
          message: updateState.message,
          color: "tertiary",
        }],
      );
    }
    if (!updateState.success && typeof updateState.error === "string") {
      const msg: SnackbarMessage = {
        message: updateState.error,
        color: "error",
      };
      setMessages((prevArr) => [...prevArr, msg]);
    }
  }, [updateState]);

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
        <hr className="border border-neutral-variant-50 dark:border-neutral-variant-60" />
        <h2 className="text-2xl">Trimestre</h2>
        <TextField
          id="first-term-start"
          name="first-term-start"
          label="Inicio de primer trimestre"
          defaultValue={school.settings?.terms.first.start}
          required
          type="date"
        />
        <TextField
          id="first-term-end"
          name="first-term-end"
          label="Fin de primer trimestre"
          defaultValue={school.settings?.terms.first.end}
          required
          type="date"
        />
        <TextField
          id="second-term-start"
          name="second-term-start"
          label="Inicio de segundo trimestre"
          defaultValue={school.settings?.terms.second.start}
          required
          type="date"
        />
        <TextField
          id="second-term-end"
          name="second-term-end"
          label="Fin de segundo trimestre"
          defaultValue={school.settings?.terms.second.end}
          required
          type="date"
        />
        <TextField
          id="third-term-start"
          name="third-term-start"
          label="Inicio de tercer trimestre"
          defaultValue={school.settings?.terms.third.start}
          required
          type="date"
        />
        <TextField
          id="third-term-end"
          name="third-term-end"
          label="Fin de tercer trimestre"
          defaultValue={school.settings?.terms.third.end}
          required
          type="date"
        />
        <SubmitButton title="Guardar" />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
