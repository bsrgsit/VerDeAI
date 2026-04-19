import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  eyebrow,
  className = "",
  headerAction,
}) => {
  return (
    <article className={`panel ${className}`}>
      {(title || eyebrow || headerAction) && (
        <div className="panel-head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h3>{title}</h3>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </article>
  );
};
