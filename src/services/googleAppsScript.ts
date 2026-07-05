/**
 * Google Apps Script service.
 *
 * All communication with the deployed Apps Script Web App flows through this
 * module. The endpoint URL is read from `VITE_GOOGLE_APPS_SCRIPT_URL` so it
 * can be changed without touching application code.
 *
 * Every function returns an `ApiResult<T>` and never throws to the caller —
 * missing configuration and network errors are surfaced as `success: false`
 * so the UI can render a friendly message instead of crashing.
 */

const API_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined;

/** Standard response shape returned by every service function. */
export type ApiResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; message: string; error?: unknown };

/** Known Apps Script actions. Extend as more endpoints are added. */
export type AppsScriptAction =
  | "submitDocumentationRequest"
  | "submit_request"
  | "getDocumentationRequests"
  | "updateDocumentationRequestStatus"
  | "update_request_status"
  | "submitArticleFeedback";

interface AppsScriptPayload<TPayload = unknown> {
  action: AppsScriptAction;
  payload?: TPayload;
}

/** Domain payload types. Kept intentionally loose to match imported content. */
export interface DocumentationRequestInput {
  title: string;
  category?: string;
  description?: string;
  submittedBy?: string;
  [key: string]: unknown;
}

export interface DocumentationRequest extends DocumentationRequestInput {
  id: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export const DOCUMENTATION_REQUEST_STATUSES = [
  "New",
  "In Review",
  "Drafting",
  "Approved",
  "Published",
  "Archived",
] as const;

export type DocumentationRequestStatus = (typeof DOCUMENTATION_REQUEST_STATUSES)[number];

export interface ArticleFeedbackInput {
  articleSlug: string;
  helpful: boolean;
  comment?: string;
  submittedBy?: string;
  [key: string]: unknown;
}

/** Reusable low-level POST helper. */
async function postToAppsScript<TResponse = unknown, TPayload = unknown>(
  action: AppsScriptAction,
  payload?: TPayload,
): Promise<ApiResult<TResponse>> {
  if (!API_URL) {
    return {
      success: false,
      message: "Google Apps Script endpoint has not been configured.",
    };
  }

  try {
    const body: AppsScriptPayload<TPayload> = { action, payload };
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        // Use text/plain to avoid triggering a CORS preflight (OPTIONS) request.
        // Apps Script Web Apps do not respond to OPTIONS, so JSON content-types
        // cause a 405. The body is still JSON-encoded and parsed server-side.
        "Content-Type": "text/plain;charset=utf-8",
      },
      // but application/json is the correct semantic content-type for our
      // structured payloads. Keep it explicit.
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Request failed with status ${response.status}.`,
      };
    }

    const data = (await response.json()) as TResponse;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "Unable to reach the Google Apps Script endpoint.",
      error,
    };
  }
}

/** Submit a new documentation request from the request form. */
export function submitDocumentationRequest(
  data: DocumentationRequestInput,
): Promise<ApiResult<{ id: string }>> {
  return postToAppsScript("submitDocumentationRequest", data);
}

/** Fetch all documentation requests (used by the Admin dashboard). */
export function getDocumentationRequests(): Promise<
  ApiResult<DocumentationRequest[]>
> {
  return postToAppsScript("getDocumentationRequests");
}

/** Update the status of an existing documentation request. */
export function updateDocumentationRequestStatus(
  requestId: string,
  status: DocumentationRequestStatus,
): Promise<ApiResult<{ id: string; status: DocumentationRequestStatus }>> {
  return postToAppsScript("update_request_status", {
    action: "update_request_status",
    request_id: requestId,
    status,
  });
}

/** Submit end-user feedback for an article. */
export function submitArticleFeedback(
  data: ArticleFeedbackInput,
): Promise<ApiResult<{ id: string }>> {
  return postToAppsScript("submitArticleFeedback", data);
}

/** Convenience flag for UI code — true when the endpoint is configured. */
export const isAppsScriptConfigured = Boolean(API_URL);
