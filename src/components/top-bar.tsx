"use client";

import Icon from "@/components/icons/icon";

type TopBarProps = {
  open: () => void;
};

export default function TopBar({ open }: TopBarProps) {
  return (
    <header className="flex items-center md:hidden px-4 py-2 h-14 w-full">
      <button className="fill-black dark:fill-white" onClick={open}>
        <Icon icon="menu" height={28} width={28} />
      </button>
    </header>
  );
}
