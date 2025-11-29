export function StepWrapper({ title, icon, children }: any) {
  return (
    <div>
      <div className="mt-8 mb-20 items-center space-y-3">
        {icon}
        <h1 className="text-2xl font-normal tracking-wide text-slate-900">
          {title}
        </h1>
      </div>
      {children}
    </div>
  );
}
