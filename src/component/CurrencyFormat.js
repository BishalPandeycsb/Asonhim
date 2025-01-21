import React from "react";
import PropTypes from "prop-types";

const CurrencyFormat = ({ 
  value, 
  prefix = "$", 
  decimalScale = 2, 
  thousandSeparator = true, 
  renderText 
}) => {
  // Helper function to format the number
  const formatValue = (number) => {
    let formattedValue = parseFloat(number).toFixed(decimalScale);
    if (thousandSeparator) {
      formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return `${prefix}${formattedValue}`;
  };

  // Format the value
  const formattedValue = formatValue(value);

  // Use the renderText prop to render custom output
  if (typeof renderText === "function") {
    return <>{renderText(formattedValue)}</>;
  }

  // Default behavior if no renderText prop is provided
  return <span>{formattedValue}</span>;
};

// Add PropTypes for better validation
CurrencyFormat.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  prefix: PropTypes.string,
  decimalScale: PropTypes.number,
  thousandSeparator: PropTypes.bool,
  renderText: PropTypes.func,
};

export default CurrencyFormat;
