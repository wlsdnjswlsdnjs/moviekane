type WombatMascotProps = {
  className?: string;
  mood?: "watching" | "pointing" | "sleepy";
};

export function WombatMascot({
  className = "",
  mood = "watching",
}: WombatMascotProps) {
  const eyeY = mood === "sleepy" ? 62 : 58;
  const mouth =
    mood === "pointing"
      ? "M54 76 Q66 84 77 75"
      : mood === "sleepy"
        ? "M55 76 Q66 72 76 76"
        : "M58 75 Q66 82 75 75";

  return (
    <svg
      viewBox="0 0 220 160"
      role="img"
      aria-label="영화를 보는 웜뱃 캐릭터"
      className={`wombat-doodle ${className}`}
    >
      <path
        d="M58 44 C82 16 133 20 168 42 C198 62 207 104 184 126 C158 151 81 145 54 126 C28 108 30 67 58 44Z"
        fill="#fffdf8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path
        d="M52 47 C42 31 24 32 20 48 C16 63 30 75 45 67"
        fill="#fffdf8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path
        d="M70 36 C59 20 44 21 39 36 C34 50 48 60 61 55"
        fill="#fffdf8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <circle cx="55" cy={eyeY} r="5" fill="currentColor" />
      <circle cx="92" cy={eyeY + 1} r="5" fill="currentColor" />
      <path
        d="M70 62 C78 52 91 58 91 70 C91 82 75 88 67 78 C62 72 64 67 70 62Z"
        fill="#fffdf8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <path
        d={mouth}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M44 123 L44 144 L66 144 L69 130"
        fill="#fffdf8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path
        d="M151 132 L151 149 L174 149 L178 127"
        fill="#fffdf8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      {mood === "watching" ? (
        <>
          <path
            d="M118 76 L177 57 L177 100 L118 88Z"
            fill="currentColor"
            opacity="0.12"
          />
          <path
            d="M114 76 L178 55 L178 101 L114 91Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />
          <circle cx="116" cy="83" r="9" fill="currentColor" />
        </>
      ) : null}
      {mood === "pointing" ? (
        <path
          d="M156 76 C181 70 192 56 199 43"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="8"
        />
      ) : null}
    </svg>
  );
}
