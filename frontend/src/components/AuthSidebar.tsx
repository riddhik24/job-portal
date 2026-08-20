interface AuthSidebarProps {
  role: string;
}

export default function AuthSidebar({ role }: AuthSidebarProps) {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-slate-900 z-0" />

      {/* Logo Branding */}
      <div className="relative z-10 flex items-center space-x-3 text-lg font-bold tracking-tight">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-extrabold text-white">
          JP
        </div>
        <span>JobPortal Inc.</span>
      </div>

      {/* Dynamic Marketing Quote */}
      <div className="relative z-10 max-w-lg space-y-4">
        <blockquote className="text-xl font-medium leading-relaxed">
          {role === "candidate"
            ? "“Found my dream role in tech within 2 weeks of creating my profile. The application tracking made following up effortless.”"
            : "“Posting jobs and shortlisting top-tier engineers has never been faster. Our hiring cycle dropped by 40%.”"}
        </blockquote>
        <div className="text-sm text-slate-400">
          <p className="font-semibold text-slate-200">
            {role === "candidate" ? "Sarah Jenkins" : "David Miller"}
          </p>
          <p>
            {role === "candidate"
              ? "Senior Full-Stack Developer"
              : "Head of Talent at TechCorp"}
          </p>
        </div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 text-xs text-slate-500">
        © 2026 JobPortal Inc. All rights reserved.
      </div>
    </div>
  );
}
