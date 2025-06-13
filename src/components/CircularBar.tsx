const CircularBar = () => {
  return (
    <>
      <div id="debt-completed-circle">
        <div className="svg-ring-wrapper">
          <svg className="progress-ring" width="200" height="200">
            <circle
              className="ring-bg"
              stroke="#2e2e2e"
              strokeWidth="20"
              fill="transparent"
              r="90"
              cx="100"
              cy="100"
            />
            <circle
              className="ring-progress"
              stroke="url(#gradient)"
              strokeWidth="20"
              fill="transparent"
              r="90"
              cx="100"
              cy="100"
              strokeLinecap="round"
              strokeDasharray="565.48"
              strokeDashoffset="113.1"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#252525" />
                <stop offset="100%" stopColor="#252525" />
              </linearGradient>
            </defs>
          </svg>
          <div className="ring-center-text">
            80%
            <br />
            <span>Paid</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CircularBar;
