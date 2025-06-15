const CircularBar = ({ percentage = 0 }) => {
  const radius = 90;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div id="debt-completed-circle">
      <div className="svg-ring-wrapper">
        <svg width="200" height="200">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2e2e2e" />
              <stop offset="100%" stopColor="#2e2e2e" />
            </linearGradient>
          </defs>

          <circle
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
          />
          <circle
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        <div className="ring-center-text">
          {percentage}%
          <br />
          <span>Paid</span>
        </div>
      </div>
    </div>
  );
};

export default CircularBar;
