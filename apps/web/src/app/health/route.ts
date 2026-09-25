// Load balancer health check. Kept independent of the API so a slow API doesn't cycle web tasks.
export function GET() {
  return Response.json({ status: 'ok' });
}
