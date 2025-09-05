export type TaskNode = { code: string; depends_on_codes?: string[] };

/** Throws with a readable message if a cycle exists. */
export function topoSort<T extends TaskNode>(nodes: T[]): T[] {
  const map = new Map(nodes.map(n => [n.code, n]));
  const indeg = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const n of nodes) {
    indeg.set(n.code, 0);
    adj.set(n.code, []);
  }
  for (const n of nodes) {
    for (const d of (n.depends_on_codes ?? [])) {
      if (!map.has(d)) continue; // allow external deps
      indeg.set(n.code, (indeg.get(n.code) || 0) + 1);
      adj.get(d)!.push(n.code);
    }
  }

  const q: string[] = [];
  for (const [code, deg] of indeg) if (deg === 0) q.push(code);

  const out: T[] = [];
  while (q.length) {
    const u = q.shift()!;
    out.push(map.get(u)!);
    for (const v of adj.get(u)!) {
      indeg.set(v, (indeg.get(v) || 0) - 1);
      if ((indeg.get(v) || 0) === 0) q.push(v);
    }
  }

  if (out.length !== nodes.length) {
    // find a minimal cycle hint
    const remaining = nodes.filter(n => !out.find(o => o.code === n.code)).map(n => n.code);
    throw new Error(`Dependency cycle detected among tasks: ${remaining.join(", ")}`);
  }
  return out;
}