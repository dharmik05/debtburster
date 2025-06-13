const DebtCard = () => {
  return (
    <>
      <div className="car-section">
        <div className="car-header">
          <div className="car-header-left">
            <h2>Car</h2>
            <p>VehicleMotions.Inc</p>
          </div>
          <div className="car-edit">Edit</div>
        </div>

        <div className="label-value">
          <span className="car-finances-label">Remaining</span>
          <span className="car-finances-value value">$12,000</span>
        </div>
        <div className="label-value">
          <span className="car-finances-label">Original</span>
          <span className="car-finances-value value">$20,000</span>
        </div>

        <div className="car-progress-bar-container">
          <div className="car-progress-bar-fill"></div>
        </div>
        <div className="car-paid-off-text">$8,000 paid off</div>

        <div className="car-actions">
          <span className="car-action-link">Details</span>
          <span className="car-action-link">Make Payment</span>
        </div>
      </div>
    </>
  );
};

export default DebtCard;
