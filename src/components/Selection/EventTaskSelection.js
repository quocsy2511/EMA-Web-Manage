import { Select } from "antd";
import React from "react";
import { motion } from "framer-motion";

const EventTaskSelection = (props) => {
  return (
    <motion.div layout className="w-[25%] flex items-center">
      <p className="text-base font-medium">{props.title}</p>
      <div className="w-[5%]" />
      <Select
        className="flex-1"
        placeholder={props.placeholder}
        onChange={(value) => {
          props.updatevalue(value);
        }}
        value={props.value ?? null}
        options={props.options}
        listHeight={props.dropdownHeight ?? 200} // height of dropdown
        {...props}

        // Search func is optional => Declare those field if search is needed
        // showSearch
        // optionFilterProp="children" // Together with showSearch
        // filterOption={(input, option) => {
        //   // input: the input that user type in
        //   // option: the option object { value, label}
        //   return (option?.label ?? "")
        //     .toLowerCase()
        //     .includes(input.toLowerCase());
        // }}
      />
    </motion.div>
  );
};

export default EventTaskSelection;
