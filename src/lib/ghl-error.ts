export function ghlSyncErrorCode(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "GHL transaction measurement is not configured") {
    return "ghl-configuration-missing";
  }
  if (message === "GHL transaction measurement credential is invalid") {
    return "ghl-credential-invalid";
  }
  const status = /^GHL API [^\r\n]* returned HTTP ([45]\d{2})$/.exec(message)?.[1];
  return status ? `ghl-api-http-${status}` : "ghl-sync-failed";
}
