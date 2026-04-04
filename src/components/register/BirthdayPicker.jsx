import { useState } from "react";
import { format, setMonth, setDate, setYear, getMonth, getDate, getYear } from "date-fns";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ScrollColumn({ items, selected, onSelect }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      {items.map((item, i) => {
        const isSelected = item.value === selected;
        const isAdjacent = Math.abs(items.findIndex(x => x.value === selected) - i) === 1;
        return (
          <button
            key={item.value}
            onClick={() => onSelect(item.value)}
            className={`w-full text-center py-2 transition-all ${
              isSelected
                ? "font-bold text-gray-900 text-lg border-t border-b border-gray-300"
                : isAdjacent
                ? "text-gray-400 text-base"
                : "text-gray-300 text-sm"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default function BirthdayPicker({ value, onCancel, onSet }) {
  const [month, setMonthState] = useState(getMonth(value));
  const [day, setDayState] = useState(getDate(value));
  const [year, setYearState] = useState(getYear(value));

  const currentYear = new Date().getFullYear();

  const monthItems = MONTHS.map((m, i) => ({ value: i, label: m }));
  const dayItems = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: String(i + 1).padStart(2, "0") }));
  const yearItems = Array.from({ length: 100 }, (_, i) => ({ value: currentYear - i, label: String(currentYear - i) }));

  // Show 3 items: prev, selected, next
  const getVisible = (items, selected) => {
    const idx = items.findIndex(x => x.value === selected);
    return [items[idx - 1], items[idx], items[idx + 1]].filter(Boolean);
  };

  const visibleMonths = getVisible(monthItems, month);
  const visibleDays = getVisible(dayItems, day);
  const visibleYears = getVisible(yearItems, year);

  const handleSet = () => {
    let d = new Date(year, month, day);
    onSet(d);
  };

  return (
    <div className="relative z-50 bg-white rounded-2xl shadow-2xl w-80 p-6 mx-4">
      <h3 className="font-bold text-xl text-gray-900 mb-6">Set date</h3>

      <div className="flex items-center gap-4">
        <ScrollColumn items={visibleMonths} selected={month} onSelect={setMonthState} />
        <ScrollColumn items={visibleDays} selected={day} onSelect={setDayState} />
        <ScrollColumn items={visibleYears} selected={year} onSelect={setYearState} />
      </div>

      <div className="flex justify-end gap-6 mt-6">
        <button onClick={onCancel} className="font-bold text-gray-700 uppercase text-sm tracking-wide">
          CANCEL
        </button>
        <button onClick={handleSet} className="font-bold text-[#1877F2] uppercase text-sm tracking-wide">
          SET
        </button>
      </div>
    </div>
  );
}