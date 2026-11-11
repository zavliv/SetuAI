import logging
from datetime import UTC, datetime

from app.config import settings
from app.db import get_db
from app.security import hash_password

log = logging.getLogger("setuai.bootstrap")


async def ensure_admin() -> None:
    email = settings.admin_email.strip().lower()
    if not email:
        return
    try:
        db = get_db()
        existing = await db.users.find_one({"email": email}, {"role": 1})
        if existing:
            if existing.get("role") != "admin":
                await db.users.update_one({"email": email}, {"$set": {"role": "admin"}})
                log.info("Made %s an admin", email)
            return

        if len(settings.admin_password) < 8:
            log.warning("No account exists for ADMIN_EMAIL. Set ADMIN_PASSWORD (8+ characters) to create it.")
            return
        await db.users.insert_one(
            {
                "name": "Admin",
                "email": email,
                "password_hash": await hash_password(settings.admin_password),
                "role": "admin",
                "created_at": datetime.now(UTC),
            }
        )
        log.info("Created admin account %s", email)
    except Exception as exc:
        log.warning("Could not set up the admin account: %s", exc)
