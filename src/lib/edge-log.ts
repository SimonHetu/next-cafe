/**
 * Edge Middleware–safe structured logs (stdout via console).
 * Do not import Winston here.
 */

export type EdgeLogLevel = "info" | "warn" | "error";

export function edgeLog(
  level: EdgeLogLevel,
  payload: Record<string, unknown>
): void {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    component: "middleware",
    ...payload,
  });
  switch (level) {
    case "error":
      console.error(line);
      break;
    case "warn":
      console.warn(line);
      break;
    default:
      console.info(line);
  }
}
