import React, { useState } from "react";

const tabs = ["For You", "Following", "React.js", "JavaScript", "CSS"];

export default function FeedTabs({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const [active, setActive] = useState(tabs[0]);

  const handleClick = (tab: string) => {
    setActive(tab);
    onTabChange && onTabChange(tab);
  };

  return (
    <div className="flex border-b border-zinc-800 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleClick(tab)}
          className={`px-4 py-2 text-sm font-medium text-zinc-200 hover:text-white focus:outline-none transition-colors ${
            active === tab ? "text-blue-500 border-b-2 border-blue-500" : ""
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
