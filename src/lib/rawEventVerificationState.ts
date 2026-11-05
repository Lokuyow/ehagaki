export const RAW_EVENT_VERIFICATION_RULE_VERSION = 1;

export type RawEventVerificationState = {
    status: "valid" | "invalid";
    ruleVersion: number;
};
