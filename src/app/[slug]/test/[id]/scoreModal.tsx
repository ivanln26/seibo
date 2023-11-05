"use client"
import Button from "@/components/button";
import { ReactElement, useState } from "react";

type Props = {
    children: React.ReactNode
}

export default function ScoreModal(
    { children }: Props,
) {
    const [hidden, setHidden] = useState(true);

    return (
        <>
            <p className="text-center"
                onClick={() => {
                    setHidden(false);
                }}
            >
                Nueva calificación.
            </p>
            <div
                className={`fixed inset-0 flex justify-center items-center transition-opacity bg-black bg-opacity-50 ${hidden && "hidden"
                    }`}
                onClick={() => setHidden(true)}
            >
                <div
                    className="flex flex-col gap-5 p-5 m-5 rounded bg-neutral-94 dark:bg-neutral-12"
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                    <div className="flex flex-row gap-5 justify-center mt-5">
                        <Button
                            kind="tonal"
                            color="error"
                            type="button"
                            onClick={() => {
                                setHidden(true);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            kind="tonal"
                            onClick={() => {
                                setHidden(true);
                            }}
                            color="tertiary"
                        >
                            Crear
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}