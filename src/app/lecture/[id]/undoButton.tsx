'use client'

import { redirect } from "next/navigation"

import Button from "@/components/button"
import { ReactNode } from "react"

type props = {
    pathName:string
}

export default function UndoButton({pathName}: props): ReactNode{
    return <Button color="error" kind="tonal" onClick={() => redirect(pathName)}>Deshacer</Button>
}