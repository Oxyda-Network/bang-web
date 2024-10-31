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