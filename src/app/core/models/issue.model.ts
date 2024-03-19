export interface TopIssue {
  [x: string]: number;
}

export interface TopIssueResponseData {
  top_issue: TopIssue;
}

export interface TopIssueResponse {
  code: number;
  data: TopIssueResponseData;
}
