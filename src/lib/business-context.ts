import type { BusinessDataset } from "@/data";

const currency = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

function formatFinancialRange(dataset: BusinessDataset) {
  const { financials } = dataset;
  if (!financials.length) {
    return "재무 데이터가 없습니다.";
  }
  const first = financials[0];
  const last = financials[financials.length - 1];
  return `${first.month}부터 ${last.month}까지 매출이 기록되어 있고, 최신 월 매출은 ${currency.format(
    last.grossRevenue,
  )}입니다.`;
}

function formatFixedCosts(dataset: BusinessDataset) {
  return dataset.fixedCosts
    .map(
      (item) =>
        `${item.description} (${item.billingCycle}): ${currency.format(item.amount)}`,
    )
    .join("; ");
}

function formatEmployees(dataset: BusinessDataset) {
  return dataset.employees
    .map((emp) => {
      const schedule = emp.schedule
        .map((slot) => `${slot.day} ${slot.startTime}-${slot.endTime}`)
        .join(", ");
      const pay =
        emp.type === "full-time"
          ? `월급 ${currency.format(emp.monthlySalary ?? 0)}`
          : `시급 ${currency.format(emp.hourlyRate ?? 0)}`;
      return `${emp.role} ${emp.name} (${emp.type === "full-time" ? "정직원" : "알바"}, ${pay}) - 근무: ${schedule}`;
    })
    .join("\n");
}

function formatTaxes(dataset: BusinessDataset) {
  return dataset.taxObligations
    .map(
      (tax) =>
        `${tax.name} (${tax.period}) - 금액 ${currency.format(tax.amount)}, 납부기한 ${tax.dueDate}, 상태 ${tax.status}`,
    )
    .join("\n");
}

export function buildBusinessContext(dataset: BusinessDataset): string {
  const profile = dataset.profile;
  return [
    `사업장: ${profile.name} (${profile.brand})`,
    `위치: ${profile.location.city} ${profile.location.district} ${profile.location.addressLine1}`,
    `업종: ${profile.industry}, 개업일: ${profile.foundedAt}`,
    formatFinancialRange(dataset),
    `월 고정비: ${formatFixedCosts(dataset)}`,
    "직원 및 스케줄:",
    formatEmployees(dataset),
    "세무 일정:",
    formatTaxes(dataset),
    "주요 상품:",
    dataset.products
      .map(
        (product) =>
          `${product.name} (${product.category}) - 평균 월 판매 ${product.avgMonthlySales}개, 마진 ${(product.grossMargin * 100).toFixed(1)}%, 가격 ${currency.format(product.price)}`,
      )
      .join("\n"),
    "기억해야 할 사실:",
    dataset.ragFacts.join("\n"),
  ].join("\n");
}
