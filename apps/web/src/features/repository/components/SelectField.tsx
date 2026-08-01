import { ChevronDown } from "lucide-react";

type Props = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function SelectField({ label, value, options, onChange }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={16} aria-hidden />
      </div>
    </label>
  );
}
