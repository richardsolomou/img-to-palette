import { Button, cn } from "@ras-sh/ui";
import { Check } from "lucide-react";
import { useState } from "react";
import type { ColorFormat } from "~/lib/utils/color-formatter";
import { formatOptions } from "~/lib/utils/color-formatter";

type FormatSelectorProps = {
  selectedFormat: ColorFormat;
  onFormatChange: (format: ColorFormat) => void;
};

export function FormatSelector({
  selectedFormat,
  onFormatChange,
}: FormatSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full sm:w-auto">
      <Button
        className="w-full min-w-[140px] justify-between font-mono text-sm sm:w-auto"
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
      >
        Format:{" "}
        {formatOptions.find((opt) => opt.value === selectedFormat)?.label}
        <svg
          aria-label="Dropdown arrow"
          className={cn("size-4 transition-transform", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <title>Dropdown arrow</title>
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <>
          <button
            aria-label="Close dropdown"
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
            type="button"
          />
          <div className="absolute right-0 left-0 z-50 mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg sm:left-auto sm:w-[200px]">
            <div className="p-1">
              {formatOptions.map((option) => (
                <button
                  className={cn(
                    "relative flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-mono text-sm transition-colors hover:bg-zinc-800",
                    selectedFormat === option.value && "bg-zinc-800"
                  )}
                  key={option.value}
                  onClick={() => {
                    onFormatChange(option.value);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  <Check
                    className={cn(
                      "size-4",
                      selectedFormat === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
