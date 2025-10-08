import type { BusinessDataset } from "@/data";
import { businessDataset, startupDataset } from "@/data";

export type BusinessRole = "cafe-owner" | "it-founder";

const registry: Record<BusinessRole, BusinessDataset> = {
  "cafe-owner": businessDataset,
  "it-founder": startupDataset,
};

export function resolveDataset(role?: string): {
  role: BusinessRole;
  dataset: BusinessDataset;
  displayName: string;
} {
  if (role === "it-founder") {
    return {
      role: "it-founder",
      dataset: registry["it-founder"],
      displayName: "서울체인랩스 대표님",
    };
  }

  return {
    role: "cafe-owner",
    dataset: registry["cafe-owner"],
    displayName: "카페 김비서랩 사장님",
  };
}
