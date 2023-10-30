
type Props = {
    params: {
        slug: string
    }
}

export default function Page({ params }: Props) {

    return (
        <>
            <h1 className="text-4xl">Examenes</h1>
            <div className="flex flex-row justify-center gap-5 flex-wrap lg:flex-nowrap">
                <div className="basis-full lg:basis-1/3">
                    <div className="text-center">
                        <h2 className="text-2xl">1° Trimestre</h2>
                    </div>
                    <div className="flex flex-col gap-2 px-2 my-5 divide-y divide-black bg-primary-100 rounded-xl border text-center justify-center">
                        <div>sape</div>
                        <div>sape</div>
                        <div>sape</div>
                        <div>sape</div>
                    </div>
                </div>
                <div className="basis-full lg:basis-1/3">
                    <div className="text-center">
                        <h2 className="text-2xl">2° Trimestre</h2>
                    </div>
                    <div className="flex flex-col gap-2 px-2 my-5 divide-y divide-black bg-primary-100 rounded-xl border text-center justify-center">
                        <div>sape</div>
                        <div>sape</div>
                        <div>sape</div>
                        <div>sape</div>
                    </div>
                </div>
                <div className="basis-full lg:basis-1/3">
                    <div className="text-center">
                        <h2 className="text-2xl">3° Trimestre</h2>
                    </div>
                    <div className="flex flex-col gap-2 px-2 my-5 divide-y divide-black bg-primary-100 rounded-xl border text-center justify-center">
                        <div>sape</div>
                        <div>sape</div>
                        <div>sape</div>
                        <div>sape</div>
                    </div>
                </div>
            </div>
            <button className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 fixed bottom-10 right-10" aria-label="Botón Flotante">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
        </button>
        </>
    );
}