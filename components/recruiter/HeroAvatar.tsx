// Flat illustration of the studio character at her laptop, for the Recruiter hero.
export default function HeroAvatar() {
  return (
    <div className="hero-avatar relative mx-auto w-full max-w-[22rem]" aria-hidden>
      <svg viewBox="0 0 360 360" className="block w-full">
        <defs>
          <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e6dcf8" />
            <stop offset="0.55" stopColor="#fde3d3" />
            <stop offset="1" stopColor="#d8f3e6" />
          </linearGradient>
        </defs>
        {/* blob backdrop */}
        <path
          d="M180 24c64 0 132 34 148 100s-14 148-78 186-150 32-198-16S8 168 34 104 116 24 180 24z"
          fill="url(#hero-bg)"
        />
        {/* desk */}
        <rect x="40" y="270" width="280" height="16" rx="8" fill="#f3d3ac" />
        {/* body */}
        <path d="M118 270c0-52 28-82 62-82s62 30 62 82z" fill="#c9b6f0" />
        <path d="M156 196c8 8 40 8 48 0" stroke="#fff4e3" strokeWidth="10" strokeLinecap="round" fill="none" />
        {/* neck + head */}
        <rect x="171" y="168" width="18" height="22" rx="8" fill="#ffe1d0" />
        {/* hair back */}
        <circle cx="180" cy="122" r="66" fill="#5b3a55" />
        <circle cx="122" cy="72" r="24" fill="#5b3a55" />
        <circle cx="238" cy="72" r="24" fill="#5b3a55" />
        <circle cx="136" cy="86" r="7" fill="#86d3b0" />
        <circle cx="224" cy="86" r="7" fill="#86d3b0" />
        {/* face */}
        <ellipse cx="180" cy="132" rx="56" ry="54" fill="#ffe1d0" />
        {/* bangs */}
        <path d="M122 118c6-38 30-56 58-56s52 18 58 56c-14-16-28-22-38-22-6 10-20 16-34 14-14-2-30 0-44 8z" fill="#5b3a55" />
        {/* eyes */}
        <ellipse cx="158" cy="138" rx="8" ry="10" fill="#2d1b3a" />
        <ellipse cx="202" cy="138" rx="8" ry="10" fill="#2d1b3a" />
        <circle cx="161" cy="134" r="3" fill="#fff" />
        <circle cx="205" cy="134" r="3" fill="#fff" />
        {/* blush + smile */}
        <ellipse cx="142" cy="156" rx="9" ry="5" fill="#ffb3c7" />
        <ellipse cx="218" cy="156" rx="9" ry="5" fill="#ffb3c7" />
        <path d="M172 158q8 8 16 0" stroke="#3d2350" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* laptop */}
        <path d="M108 268h144l-12-66H120z" fill="#a58fe0" />
        <circle cx="180" cy="236" r="10" fill="#ffb3c7" />
        <circle cx="180" cy="236" r="4.5" fill="#fff0a8" />
        <rect x="92" y="266" width="176" height="8" rx="4" fill="#c9b6f0" />
        {/* hands */}
        <ellipse cx="128" cy="262" rx="12" ry="9" fill="#ffe1d0" />
        <ellipse cx="232" cy="262" rx="12" ry="9" fill="#ffe1d0" />
        {/* mug + plant */}
        <rect x="282" y="242" width="22" height="28" rx="6" fill="#ffc9a8" />
        <path d="M304 250a7 7 0 0 1 0 14" stroke="#ffc9a8" strokeWidth="4" fill="none" />
        <rect x="56" y="246" width="26" height="24" rx="6" fill="#ffc9a8" />
        <circle cx="62" cy="236" r="12" fill="#86d3b0" />
        <circle cx="76" cy="230" r="13" fill="#b8ead2" />
        {/* sparkles */}
        <path d="M300 66l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" fill="#f6a57f" />
        <path d="M62 150l3.5 8 8 3.5-8 3.5-3.5 8-3.5-8-8-3.5 8-3.5z" fill="#a58fe0" />
      </svg>
      {/* floating tags */}
      <span className="float-tag left-0 top-[18%]">Python</span>
      <span className="float-tag right-0 top-[40%] [animation-delay:-1.5s]">Django</span>
      <span className="float-tag bottom-[22%] left-[2%] [animation-delay:-3s]">AI</span>
    </div>
  );
}
