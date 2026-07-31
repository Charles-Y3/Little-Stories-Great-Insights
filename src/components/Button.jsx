import React, { forwardRef } from "react";
import styles from "./Button.module.css";

const Button = forwardRef(function Button(
  { variant = "ghost", size, block, icon, className = "", ...props },
  ref
) {
  const cls = [
    styles.btn,
    styles[variant],
    size === "sm" ? styles.sm : "",
    block ? styles.block : "",
    icon ? styles.icon : "",
    className
  ]
    .filter(Boolean)
    .join(" ");
  return <button ref={ref} className={cls} {...props} />;
});

export default Button;
