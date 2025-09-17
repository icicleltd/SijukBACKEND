export function newId()
{
    // Bun/Node 18+ have crypto.randomUUID
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
