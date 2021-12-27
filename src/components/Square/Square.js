import React, { useEffect, useState } from "react";
import styles from "./Square.module.css";

const Square = ({ index, color }) => {
  return (
    <button
      style={{ background: color ? color : "fff" }}
      className={styles.square}
    >
      {index}
    </button>
  );
};
export default Square;
