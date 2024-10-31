import { ReactNode } from "react";
import "./Style/AboutMenu.css";

export interface AboutMenuItemProps {
  href: string;
  children: ReactNode;
  onClick: (href: string) => void;
}

export function AboutMenuItem({ href, children, onClick }: AboutMenuItemProps) {
  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick(href);
        }}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
      >
        {children}
      </a>
    </li>
  );
}

export function AboutMenu({ children }: { children: ReactNode }) {
  return (
    <ul className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
      {children}
    </ul>
  );
}