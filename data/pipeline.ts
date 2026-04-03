/**
 * Territory pipeline. Populate when you receive accounts from the previous rep.
 * Until then, pipeline is empty.
 */

export type PipelineStage =
  | "Discovery"
  | "Champion Build"
  | "POV Selected"
  | "Pilot Design"
  | "Security Review"
  | "Legal Review"
  | "Procurement"
  | "Negotiation"
  | "Closed";

export interface PipelineRow {
  accountId: string;
  accountName: string;
  stage: PipelineStage;
  valueM: number;
  nextStep: string;
}

/** No accounts until you receive the 15 from the previous rep. */
export const pipelineRows: PipelineRow[] = [];
