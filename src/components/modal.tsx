'use client'
import { useState } from "react"

import { redirect } from "next/navigation";
import { z } from "zod";

type modalCamp = {
    title: string,
    data: string,
    type: string
}

type ModalProps = {
    camps: modalCamp[], 
    api: string, 
    buttonText: string
}

export default function Modal({ camps, api, buttonText }: ModalProps) {
    const [hidden, setHidden] = useState(true);
    const [campsData, setCampsData] = useState<modalCamp[]>([...camps]);

    const handleCampChange = (index: number, value: any) => {
        const aux = [...campsData];
        aux[index].data = value;
        setCampsData(aux);
    }

    const create = async () => {
        var res: { [k: string]: any } = {};
        campsData.forEach((camp) => {
            res[camp.title] = camp.data
        });
        await fetch(api, { method: "POST", body: JSON.stringify(res) });
        redirect("/");
    };

    return (
        <>
            <button onClick={() => { setHidden(false) }} className="bg-tertiary-100 hover:bg-lime-400 px-1 text-black rounded-lg flex items-center justify-center shadow">
                {buttonText}
            </button>
            <div
                className={`fixed inset-0 bg-gray-200 bg-opacity-75 ${hidden ? "hidden" : ""} transition-opacity flex justify-center items-center`}
                onClick={() => setHidden(true)}>
                <div className="bg-white p-5 m-5 rounded border" onClick={e => e.stopPropagation()}>
                    <form action={create} className="flex flex-col gap-1">
                        {campsData.map((camp, i) => {
                            return (
                                <div key={i}>
                                    <label htmlFor="content">{camp.title}</label>
                                    <input className="border rounded-xl" name={camp.title} value={camp.data} type={camp.type}
                                        onChange={(e) => handleCampChange(i, e.target.value)} />
                                </div>
                            )
                        })}
                        <div className="flex flex-row justify-center mt-3">
                            <button type="submit" className="bg-primary-100 text-on-primary w-fit px-3 py-1 rounded-xl">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}