/**
 * Structured error handling utilities for server actions.
 *
 * Wraps async server action logic to catch errors consistently,
 * log structured details, and return safe user-facing messages.
 */

type ActionResult<T = void> =
  | { success: true; data: T }
  | { error: string }

/**
 * Wraps a server action function with consistent error handling.
 * Catches thrown errors, logs structured info, and returns a safe message.
 *
 * Usage:
 * ```ts
 * export async function createPost(formData: FormData) {
 *   return safeAction("createPost", async () => {
 *     // your logic here
 *     return { id: "abc" }
 *   })
 * }
 * ```
 */
export async function safeAction<T>(
  actionName: string,
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (err) {
    const errorInfo = extractErrorInfo(err)

    // Structured logging for server-side monitoring
    console.error(JSON.stringify({
      level: "error",
      action: actionName,
      message: errorInfo.message,
      code: errorInfo.code,
      timestamp: new Date().toISOString(),
    }))

    // Return safe user-facing message
    if (err instanceof AppError) {
      return { error: err.userMessage }
    }

    return { error: "Something went wrong. Please try again." }
  }
}

/**
 * Application-specific error with a user-safe message.
 */
export class AppError extends Error {
  public readonly userMessage: string
  public readonly code: string
  public readonly statusCode: number

  constructor(opts: {
    message: string
    userMessage?: string
    code?: string
    statusCode?: number
    cause?: unknown
  }) {
    super(opts.message, { cause: opts.cause })
    this.name = "AppError"
    this.userMessage = opts.userMessage || opts.message
    this.code = opts.code || "INTERNAL_ERROR"
    this.statusCode = opts.statusCode || 500
  }
}

/**
 * Common application errors for reuse.
 */
export const Errors = {
  unauthorized: () =>
    new AppError({
      message: "User not authenticated",
      userMessage: "Please log in to continue.",
      code: "UNAUTHORIZED",
      statusCode: 401,
    }),
  forbidden: () =>
    new AppError({
      message: "Insufficient permissions",
      userMessage: "You don't have permission to do this.",
      code: "FORBIDDEN",
      statusCode: 403,
    }),
  notFound: (resource: string) =>
    new AppError({
      message: `${resource} not found`,
      userMessage: `${resource} could not be found.`,
      code: "NOT_FOUND",
      statusCode: 404,
    }),
  validation: (detail: string) =>
    new AppError({
      message: `Validation failed: ${detail}`,
      userMessage: detail,
      code: "VALIDATION_ERROR",
      statusCode: 400,
    }),
  rateLimited: () =>
    new AppError({
      message: "Rate limit exceeded",
      userMessage: "Too many requests. Please wait and try again.",
      code: "RATE_LIMITED",
      statusCode: 429,
    }),
} as const

function extractErrorInfo(err: unknown): { message: string; code: string } {
  if (err instanceof AppError) {
    return { message: err.message, code: err.code }
  }
  if (err instanceof Error) {
    return { message: err.message, code: "UNHANDLED_ERROR" }
  }
  return { message: String(err), code: "UNKNOWN_ERROR" }
}
