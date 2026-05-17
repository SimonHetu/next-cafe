/** Plain UTF-8 text responses with an explicit Content-Type (avoids “missing Content-Type” findings). */
export function plainTextResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
