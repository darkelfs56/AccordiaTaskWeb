export function extractHttpError(err: any): string {
  console.log(`err is: ${err}`);
  if (err?.status && err?.error?.message) {
    return err.error.message;
  }

  return 'An unexpected error occurred.';
}
