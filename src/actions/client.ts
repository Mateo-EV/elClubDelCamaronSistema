"use client";

export async function manageClientError<R, P>(
  fn: (props: P) => Promise<R & { error: string | null }>,
  props: P,
) {
  const { error, ...data } = await fn(props);

  if (error) {
    throw new Error(error);
  }

  return data;
}

// export async function login(props: Parameters<typeof loginServer>[0]) {
//   await manageClientError(loginServer, props);
// }
