// Generic device frames drawn in CSS (styles in app/globals.css).
// No brand marks: a plain laptop (screen + base) and a plain phone with a pill cut-out.
type Props = {
  kind?: "laptop" | "phone";
  children: React.ReactNode;
  className?: string;
};

export default function DeviceFrame({ kind = "laptop", children, className = "" }: Props) {
  if (kind === "phone") {
    return (
      <div className={`device-phone ${className}`}>
        <div className="dp-screen">{children}</div>
      </div>
    );
  }
  return (
    <div className={`device-laptop ${className}`}>
      <div className="dl-lid">
        <div className="dl-screen">{children}</div>
      </div>
      <div className="dl-base" aria-hidden="true" />
    </div>
  );
}
