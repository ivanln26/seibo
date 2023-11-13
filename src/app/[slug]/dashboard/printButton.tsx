"use client"

import Button from "@/components/button"

export default function PrintButton() {
    return (
        <div className="fixed bottom-5 right-10">
            <Button color="tertiary" onClick={() => window.print()}>Imprimir</Button>
        </div>
    )
}