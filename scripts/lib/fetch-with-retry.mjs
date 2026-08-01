export async function fetchWithRetry(
  input,
  { attempts = 4, timeoutMs = 15_000, ...init } = {},
) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(input, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (response.status < 500 && response.status !== 429) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts) {
      const delayMs = 400 * (2 ** (attempt - 1));
      console.warn(`External inventory request failed (attempt ${attempt}/${attempts}); retrying in ${delayMs}ms`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
