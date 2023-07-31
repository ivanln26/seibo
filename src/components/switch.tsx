export default function Switch() {
  return (
    <label className="relative">
      <input
        id="switch"
        className="sr-only peer"
        name="switch"
        type="checkbox"
      />
      <div className="h-8 w-14 cursor-pointer rounded-full bg-neutral-variant-90 dark:bg-neutral-variant-30 peer-checked:bg-primary-600 peer-checked:dark:bg-primary-200 border border-2 peer-checked:border-0 border-neutral-variant-50 dark:border-neutral-variant-60" />
      <span className="h-4 w-4 peer-checked:h-6 peer-checked:w-6 absolute top-2 left-1.5 peer-checked:top-1 rounded-full bg-neutral-variant-50 dark:bg-neutral-variant-60 peer-checked:bg-white peer-checked:dark:bg-primary-800 transition-all peer-checked:translate-x-full" />
    </label>
  );
}
