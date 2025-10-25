import type React from "react";
import { Link } from "react-router";

interface GlobalHeaderProps {
  isLoggedIn: boolean;
  suppressNav?: boolean;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  isLoggedIn,
  suppressNav
}) => (
  <header className="flex justify-between px-4 p-2 sticky top-0">
    <h2>
      <Link to="/">WLTA</Link>
    </h2>
    {!suppressNav && (
      <nav>
        <ul>
          <li>
            <Link to={isLoggedIn ? "/logout" : "/login"}>
              {isLoggedIn ? "Sign out" : "Sign in"}
            </Link>
          </li>
        </ul>
      </nav>
    )}
  </header>
);
