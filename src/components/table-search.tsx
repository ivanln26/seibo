"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import Icon from "@/components/icons/icon";

export default function TableSearch() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="flex justify-end">
      <div className="relative group">
        <span className="absolute left-2 top-3 fill-black dark:fill-white group-focus-within:fill-primary-600 dark:group-focus-within:fill-primary-200">
          <Icon icon="search" height={24} width={24} />
        </span>
        <input
          className="h-12 pl-10 text-base pr-4 w-full rounded bg-transparent outline outline-1 outline-outline focus:outline-2 focus:outline-primary-600 dark:focus:outline-primary-200"
          placeholder="Buscar..."
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
    </div>
  );
}
