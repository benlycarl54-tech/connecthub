import React, { useState, useRef, useEffect } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ScrollColumn({ items, selected, onSelect, renderItem }) {
  const containerRef = useRef(null);
  const itemHeight = 44;
  const selectedIndex = items.indexOf(selected);

  useEffect(() => {
    if (containerRef.current && selectedIndex >= 0) {
      containerRef.current.scrollTop = selectedIndex * itemHeight;
    }
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      if (index >= 0 && index < items.length) {
        onSelect(items[index]);
      }
    }
  };

  return (
    <div className="relative h-[132px] flex-1 overflow-hidden">
      <div className="absolute top-[44px] left-0 right-0 h-[44px] border-t border-b border-border z-10 pointer-events-none" />
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
        onScroll={handleScroll}
        style={{ scrollSnapType: "y mandatory", paddingTop: 44, paddingBottom: 44 }}
      >
        {items.map((item, i) => {
          const isSelected = item === selected;
          return (
            <div
              key={i}
              className={`h-[44px] flex items-center justify-center text-base snap-center transition-colors ${
                isSelected ? "text-foreground font-semibold" : "text-muted-foreground"
              }`}
              style={{ scrollSnapAlign: "center" }}
              onClick={() => onSelect(item)}
            >
              {renderItem ? renderItem(item) : item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BirthdayPicker({ value, onSet, onCancel }) {
  const now = new Date();
  const [month, setMonth] = useState(value ? value.getMonth() : now.getMonth());
  const [day, setDay] = useState(value ? value.getDate() : now.getDate());
  const [year, setYear] = useState(value ? value.getFullYear() : now.getFullYear());

  const years = [];
  for (let y = now.getFullYear(); y >= 1920; y--) years.push(y);
  const days = [];
  for (let d = 1; d <= 31; d++) days.push(d);
  const monthIndices = MONTHS.map((_, i) => i);

  const handleSet = () => {
    const date = new Date(year, month, day);
    onSet(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-8">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xs">
        <h3 className="text-lg font-semibold text-foreground mb-4">Set date</h3>

        <div className="flex gap-2">
          <ScrollColumn
            items={monthIndices}
            selected={month}
            onSelect={setMonth}
            renderItem={(m) => MONTHS[m]}
          />
          <ScrollColumn items={days} selected={day} onSelect={setDay} />
          <ScrollColumn items={years} selected={year} onSelect={setYear} />
        </div>

        <div className="flex justify-end gap-6 mt-4">
          <button onClick={onCancel} className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Cancel
          </button>
          <button onClick={handleSet} className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Set
          </button>
        </div>
      </div>
    </div>
  );
}