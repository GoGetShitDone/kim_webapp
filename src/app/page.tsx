import Link from "next/link";

const roles = [
  {
    id: "cafe-owner",
    title: "카페 김비서랩 사장님",
    description: "강남 카페 김비서랩 · 매출·세무·직원 운영 데이터 연동",
    href: "/splash?role=cafe-owner",
    active: true,
  },
  {
    id: "it-founder",
    title: "서울체인랩스 대표님",
    description: "서울체인랩스 · 블록체인 + AI 시리즈 A 스타트업 데이터 연동",
    href: "/splash?role=it-founder",
    active: true,
  },
];

export default function RoleSelectionPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-12 px-6 py-16 text-slate-100">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.6em] text-slate-400">
          김비서 시작하기
        </p>
        <h1 className="mt-4 text-4xl font-semibold">DEMO 역할 선택하기</h1>
        <p className="mt-6 text-sm text-slate-300">
          역할에 맞는 데이터와 워크플로를 기반 시뮬레이션
        </p>
      </header>

      <div className="grid w-full max-w-4xl gap-14 md:grid-cols-2">
        {roles.map((role) =>
          role.active ? (
            <Link
              key={role.id}
              href={role.href}
              className="group flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/10 p-6 transition hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white group-hover:text-brand">
                  {role.title}
                </h2>
                <p className="text-sm text-slate-300 group-hover:text-brand/80">
                  {role.description}
                </p>
              </div>
            </Link>
          ) : (
            <div
              key={role.id}
              className="flex flex-col justify-between rounded-[2rem] border border-white/5 bg-white/5 p-6 text-slate-400 opacity-60"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.4em]">
                  준비 중
                </p>
                <h2 className="text-2xl font-semibold">{role.title}</h2>
                <p className="text-sm">{role.description}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                곧 공개됩니다
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
