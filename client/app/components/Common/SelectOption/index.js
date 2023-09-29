/**
 *
 * SelectOption
 *
 */

import React from "react";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";

const SelectOption = (props) => {
  const {
    disabled,
    error,
    label,
    multi,
    options,
    defaultValue,
    value,
    handleSelectChange,
    handleCreateOptions,
    isCreateable,
    placeholder,
  } = props;

  const _handleSelectChange = (value) => {
    handleSelectChange(value);
  };
  const _handleCreateOptions = (value) => {
    handleCreateOptions(value);
  };
  const animatedComponents = makeAnimated();

  const styles = `select-box${error ? " invalid" : ""}`;

  return (
    <div className={styles}>
      {label && <label>{label}</label>}
      {isCreateable ? (
        <CreatableSelect
          isMulti={true}
          className="select-container"
          classNamePrefix="react-select"
          value={value}
          options={options}
          styles={dropdownStyles}
          onChange={_handleSelectChange}
          {...(placeholder && { placeholder })}
        />
      ) : (
        <Select
          isDisabled={disabled}
          className="select-container"
          classNamePrefix="react-select"
          components={animatedComponents}
          isMulti={multi}
          options={options}
          defaultValue={defaultValue}
          value={value}
          onChange={_handleSelectChange}
          styles={dropdownStyles}
        />
      )}

      <span className="invalid-message">{error && error[0]}</span>
    </div>
  );
};

export default SelectOption;

const dropdownStyles = {
  control: (styles, { isFocused }) => {
    return {
      ...styles,
      color: "#323232",
      fontFamily: "Poppins",
      backgroundColor: "white",
      transition: "0.3s",
      boxShadow: "none",

      borderColor: isFocused ? "#bdcbd2" : "#e4e6eb",

      ":hover": {
        borderColor: !isFocused ? "#e4e6eb" : "#bdcbd2",
        boxShadow: "none",
      },
    };
  },
  menu: (styles) => {
    return {
      ...styles,
      zIndex: 2,
    };
  },
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      color: "#323232",
      fontFamily: "Poppins",
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? "#eceef3"
        : isFocused
        ? "#f8f9fa"
        : undefined,

      ":hover": {
        ...styles[":hover"],
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? undefined
          : "#f8f9fa",
      },
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled ? "#eceef3" : undefined,
      },
    };
  },
  indicatorSeparator: (styles) => ({
    ...styles,
    display: "none",
  }),
  dropdownIndicator: (base, { isFocused }) => ({
    ...base,
    transform: isFocused ? "rotate(180deg)" : undefined,
    transition: "transform 0.3s",
  }),
  input: (styles) => ({
    ...styles,
    color: "#323232",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#323232",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#323232",
    fontFamily: "Poppins",
  }),
};
