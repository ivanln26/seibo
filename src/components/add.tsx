type AddProps = {
  height: number;
  width: number;
};

export default function Add({ height, width }: AddProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      height={height}
      width={width}
    >
      <path d="M450-200v-250H200v-60h250v-250h60v250h250v60H510v250h-60Z" />
    </svg>
  );
}
