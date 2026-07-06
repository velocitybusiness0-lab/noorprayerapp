/**
 * Side-effect handlers a successful scan may trigger, registered by other
 * features so the scan screen stays decoupled. Blocking (Phase 6) registers
 * the unblock handler here.
 */
type AsyncHandler = () => Promise<void> | void;

let unblockHandler: AsyncHandler | null = null;

export function setUnblockHandler(handler: AsyncHandler | null): void {
  unblockHandler = handler;
}

export async function runUnblock(): Promise<void> {
  await unblockHandler?.();
}
