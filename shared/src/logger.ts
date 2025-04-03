const LOG_LEVEL = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4,
} as const;

const CURRENT_LOG_LEVEL = -1;

export const logger = {
  error: (message: string) => {
    if (CURRENT_LOG_LEVEL < LOG_LEVEL.ERROR) return;
    console.error(message);
  },
  warn: (message: string) => {
    if (CURRENT_LOG_LEVEL < LOG_LEVEL.WARN) return;
    console.warn(message);
  },
  info: (message: string) => {
    if (CURRENT_LOG_LEVEL < LOG_LEVEL.INFO) return;
    console.log(`[INFO] ${message}`);
  },
  debug: (message: string) => {
    if (CURRENT_LOG_LEVEL < LOG_LEVEL.DEBUG) return;
    console.log(`[DEBUG] ${message}`);
  },
  trace: (message: string) => {
    if (CURRENT_LOG_LEVEL < LOG_LEVEL.TRACE) return;
    console.log(`[TRACE] ${message}`);
  },
};
