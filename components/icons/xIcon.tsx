const XIcon = ({ color }: { color: string }) => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="1.06066"
        y1="1"
        x2="7"
        y2="6.93934"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="6.93934"
        x2="6.93934"
        y2="1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default XIcon;
