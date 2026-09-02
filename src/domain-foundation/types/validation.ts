export type ValidationStatus = "passed" | "failed";

export interface RuleResult {
  readonly ruleId: string;
  readonly passed: boolean;
  readonly message: string;
}

export interface ValidationReport {
  readonly status: ValidationStatus;
  readonly ruleResults: ReadonlyArray<RuleResult>;
}
