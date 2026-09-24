type Field = {
  id: string;
  label: string;
  value: string;
  set: (v: string) => void;
  prefix?: string;
  suffix?: string;
};

export function NumberField({ id, label, value, set, prefix, suffix }: Field) {
  return (
    <div>
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="relative">
        {prefix && <span aria-hidden="true" className="absolute left-3 top-3.5 text-sm text-brand-ink-light">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => set(e.target.value)}
          className={`form-control ${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""}`}
        />
        {suffix && <span aria-hidden="true" className="absolute right-3 top-3.5 text-sm text-brand-ink-light">{suffix}</span>}
      </div>
    </div>
  );
}
