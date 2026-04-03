import type { AccountUpdate, ExecutionItem } from "@/types";

/**
 * Full "Plans for this week" from last week's notes and execution progress.
 */
export function getPlansForThisWeek(
  accountUpdates: AccountUpdate[],
  executionItems: ExecutionItem[]
): string {
  const recentUpdates = accountUpdates.slice(0, 4);
  const toAdvance = executionItems.filter(
    (i) => i.status === "in_progress" || i.status === "ready" || i.status === "blocked"
  );
  const lines: string[] = [];

  if (recentUpdates.length > 0) {
    lines.push("From last week's notes and updates:");
    recentUpdates.forEach((u) => {
      const note = u.note.trim();
      if (note && note !== "—") lines.push(`• ${u.title}: ${note.slice(0, 120)}${note.length > 120 ? "…" : ""}`);
      else lines.push(`• ${u.title} (${u.createdAt})`);
    });
  }

  if (toAdvance.length > 0) {
    if (lines.length) lines.push("");
    lines.push("Where things need to progress:");
    toAdvance.slice(0, 5).forEach((i) => {
      const status = i.status === "blocked" ? " [blocked]" : "";
      lines.push(`• ${i.title} · ${i.owner} · ${i.dueLabel}${status}`);
    });
  }

  if (lines.length === 0) {
    return "No recent notes or updates yet. Add an account update or move items forward in the Deal Plan to see suggested plans here.";
  }

  return lines.join("\n");
}

const MAX_BULLET = 32;

function truncate(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max).trimEnd().replace(/\s+\S*$/, "") + "…";
}

/**
 * Short 2–3 bullet summary for the Plans battle card.
 */
export function getPlansForThisWeekShort(
  accountUpdates: AccountUpdate[],
  executionItems: ExecutionItem[]
): string {
  const toAdvance = executionItems.filter(
    (i) => i.status === "in_progress" || i.status === "ready" || i.status === "blocked"
  );
  const bullets: string[] = [];

  if (accountUpdates.length > 0) {
    bullets.push(`Follow up: ${truncate(accountUpdates[0].title, MAX_BULLET)}`);
  }
  if (toAdvance.length > 0) {
    toAdvance.slice(0, 2).forEach((i) => {
      bullets.push(truncate(i.title, MAX_BULLET));
    });
  }

  if (bullets.length === 0) {
    return "• Add an update or move Deal Plan items to see plans.";
  }

  return bullets.map((b) => `• ${b}`).join("\n");
}
