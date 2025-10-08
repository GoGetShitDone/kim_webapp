import Link from "next/link";
import { resolveDataset } from "@/lib/datasets";

const currency = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "short",
  day: "numeric",
});

function getUpcomingTax(dataset: ReturnType<typeof resolveDataset>["dataset"]) {
  const upcoming = [...dataset.taxObligations].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )[0];
  if (!upcoming) {
    return { label: "세무 일정", value: "예정 없음" };
  }
  return {
    label: upcoming.name,
    value: `${dateFormatter.format(new Date(upcoming.dueDate))} · ${currency.format(
      upcoming.amount,
    )}`,
  };
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { dataset, displayName, role } = resolveDataset(searchParams.role);
  const latest = dataset.financials.at(-1);
  const totalEmployees = dataset.employees.length;
  const fullTime = dataset.employees.filter(
    (emp) => emp.type === "full-time",
  ).length;
  const partTime = totalEmployees - fullTime;
  const headcountHelperParts = [
    fullTime ? `정직원 ${fullTime}` : null,
    partTime ? `알바 ${partTime}` : null,
  ].filter(Boolean);
  const upcomingTax = getUpcomingTax(dataset);

  const metrics = [
    {
      title: "최근 월 매출",
      value: latest ? currency.format(latest.grossRevenue) : "데이터 없음",
      helper: latest ? latest.month : undefined,
    },
    {
      title: "현재 팀 구성",
      value: `${totalEmployees}명`,
      helper: headcountHelperParts.length ? headcountHelperParts.join(" · ") : undefined,
    },
    {
      title: "다가오는 세무 일정",
      value: upcomingTax.value,
      helper: upcomingTax.label,
    },
  ];

  const chatHref = `/chat?role=${encodeURIComponent(role)}`;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[24rem] flex-col gap-6 px-5 py-8 text-slate-100">
      <header className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-slate-400">
          김비서 대시보드
        </p>
        <h1 className="text-[28px] font-semibold leading-snug text-white">
          {displayName} 백오피스 스냅샷
        </h1>
        <p className="text-sm text-slate-300">
          지표는 실시간으로 동기화됩니다. 필요하면 바로 AI에게 다음 조치를 요청하세요.
        </p>
      </header>

      <section className="space-y-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-[1.5rem] border border-white/12 bg-gradient-to-br from-white/10 via-white/5 to-transparent px-6 py-4 shadow-lg shadow-black/20"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
              {metric.title}
            </p>
            <p className="mt-2 text-xl font-semibold text-white">{metric.value}</p>
            {metric.helper ? (
              <p className="mt-1 text-xs text-slate-300">{metric.helper}</p>
            ) : null}
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-[1.5rem] border border-brand/40 bg-slate-950/80 px-5 py-6 text-center shadow-xl shadow-brand/30">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-[pulseGradient_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.55),transparent_60%)]" />
          <div className="absolute inset-0 animate-[pulseGradient_10s_linear_infinite] bg-[radial-gradient(circle_at_80%_30%,rgba(129,230,217,0.45),transparent_65%)]" />
        </div>
        <div className="relative z-10 px-1">
          <h2 className="text-xl font-semibold text-white">김비서에게 물어보세요</h2>
          <p className="mt-4 text-xs text-slate-200">
            매출·세무·직원 운영 등 궁금한 점을 자연어로 바로 확인할 수 있어요. 한 번의 클릭으로 바로 대화할 수 있습니다.
          </p>
          <Link
            href={chatHref}
            className="relative mt-5 inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(251,113,133,0.35)] transition hover:scale-[1.03] hover:shadow-[0_18px_45px_rgba(251,191,36,0.45)] active:scale-[0.97]"
          >
            <span className="absolute inset-0 rounded-full border border-white/20 bg-[linear-gradient(120deg,#fb7185_0%,#f97316_25%,#fbbf24_50%,#c084fc_75%,#fb7185_100%)] bg-[length:220%_220%] opacity-95 animate-[sunsetFlow_7s_ease-in-out_infinite]" />
            <span className="absolute inset-[2px] rounded-full bg-slate-950/40 backdrop-blur-[3px]" />
            <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              AI 대화 시작하기
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
