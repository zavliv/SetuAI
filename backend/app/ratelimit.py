import time

from fastapi import HTTPException


class LoginLimiter:
    def __init__(self, max_failures: int = 5, window_seconds: int = 15 * 60):
        self.max_failures = max_failures
        self.window = window_seconds
        self._failures: dict[str, list[float]] = {}

    def _recent(self, key: str) -> list[float]:
        cutoff = time.monotonic() - self.window
        recent = [t for t in self._failures.get(key, []) if t > cutoff]
        if recent:
            self._failures[key] = recent
        else:
            self._failures.pop(key, None)
        return recent

    def check(self, key: str) -> None:
        recent = self._recent(key)
        if len(recent) >= self.max_failures:
            retry = int(self.window - (time.monotonic() - recent[0])) + 1
            raise HTTPException(
                429,
                "Too many attempts. Please wait a few minutes and try again.",
                headers={"Retry-After": str(max(retry, 1))},
            )

    def fail(self, key: str) -> None:
        self._failures.setdefault(key, []).append(time.monotonic())

    def reset(self, key: str) -> None:
        self._failures.pop(key, None)


limiter = LoginLimiter()
