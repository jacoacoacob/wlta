import type React from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { IconUser } from "~/patterns/IconUser";
import { Link } from "react-router";

interface ProfileMenuProps {
  isLoggedIn: boolean;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isLoggedIn
}) => {
  return (
    <Popover>
      <PopoverButton
        className="block text-sm/6 font-semibold focus:outline-none"
      >
        <IconUser />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom end"
        className="border rounded-xl bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
      >
        <div className="p-3 flex flex-col">
          <Link to={isLoggedIn ? "/logout" : "/login"}>
            {isLoggedIn ? "Sign out" : "Sign in"}
          </Link>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
