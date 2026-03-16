interface PageHeaderProps {
  title: string;
  subtitle?: string;
  accentWord?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, accentWord, actions }: PageHeaderProps) {
  // Replace accentWord in title with gradient version
  const renderTitle = () => {
    if (!accentWord || !title.includes(accentWord)) {
      return <span>{title}</span>;
    }
    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{accentWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          {renderTitle()}
        </h1>
        {subtitle && (
          <p className="text-slate-400 mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
