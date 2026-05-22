import { revalidatePath } from 'next/cache';

/** Invalidate server-rendered list and detail pages after client mutations. */
export function revalidateClients(clientId?: string): void {
  revalidatePath('/clients', 'page');
  revalidatePath('/clients/new', 'page');
  revalidatePath('/projects/new', 'page');
  if (clientId) {
    revalidatePath(`/clients/${clientId}`, 'page');
  }
}

export function revalidateProjects(projectId?: string): void {
  revalidatePath('/projects', 'page');
  revalidatePath('/projects/new', 'page');
  if (projectId) {
    revalidatePath(`/projects/${projectId}`, 'page');
  }
}

export function revalidateWorkers(workerId?: string): void {
  revalidatePath('/workers', 'page');
  if (workerId) {
    revalidatePath(`/workers/${workerId}`, 'page');
  }
}
