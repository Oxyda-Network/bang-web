import { ReactNode } from "react";
import "./Style/AboutMenu.css";

export interface AboutMenuItemProps {
  onClick: () => void;
  children: ReactNode;
}

export function AboutMenuItem({ onClick, children }: AboutMenuItemProps) {
  return <li><button onClick={onClick} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white">{children}</button></li>;
}

export interface AboutMenuProps {
  children: ReactNode;
}

export default function AboutMenu({ children }: AboutMenuProps) {
  return (
    <div className='about-menu z-50
    absolute top-10 right-0
    text-base list-none divide-y rounded-lg shadow bg-gray-700 divide-gray-600'>
      <ul className="py-2" aria-labelledby="about-menu-button">{children}</ul>
    </div>
  )
}