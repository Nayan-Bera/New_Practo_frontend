import React from "react";
import ReactDom from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  height?: string;
  width?: string;
}

const Portal: React.FC<PortalProps> = ({ 
  children,
  className = "",
  zIndex = 2,
  top = "0",
  height = "100%",
  width = "100%"
}) => {
  const portalElement = document.getElementById("portal");
  if (!portalElement) return null;

  const defaultClasses = `absolute w-[${width}] h-[${height}] top-[${top}] z-[${zIndex}]`;
  const classes = className ? `${defaultClasses} ${className}` : defaultClasses;

  return ReactDom.createPortal(
    <div className={classes}>
      {children}
    </div>,
    portalElement
  );
};

export default Portal; 