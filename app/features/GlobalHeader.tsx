import type React from "react";
import { Link } from "react-router";

interface GlobalHeaderProps {
  rightNavContent?: React.ReactNode;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  rightNavContent
}) => (
  <header className="flex justify-between px-4 p-2 sticky top-0">
    <h2>
      <Link to="/">WLTA</Link>
    </h2>
    {!!rightNavContent && (
      <nav>
        {rightNavContent}
      </nav>
    )}
  </header>
);
