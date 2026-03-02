import { memo } from "react";

const Header = memo(function Header({ title, children }) {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-orange-600">
        {title}
      </h1>
      {children}
    </header>
  )
});

export default Header;
