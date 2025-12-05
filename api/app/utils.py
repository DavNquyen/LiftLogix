"""Utility functions for LiftLogix API"""

import re
from typing import Optional


def validate_password(password: str) -> Optional[str]:
    """
    Validate password strength.

    Returns None if valid, error message string if invalid.

    Requirements:
    - At least 12 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < 12:
        return "Password must be at least 12 characters long"

    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter"

    if not re.search(r"[0-9]", password):
        return "Password must contain at least one digit"

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)"

    return None


def sanitize_search_query(query: str, max_length: int = 100) -> str:
    """
    Sanitize user search query to prevent injection attacks.

    Args:
        query: Raw search query from user
        max_length: Maximum allowed query length

    Returns:
        Sanitized query string
    """
    # Strip whitespace and limit length
    sanitized = query.strip()[:max_length]

    # Remove null bytes (can cause issues in some DBs)
    sanitized = sanitized.replace('\x00', '')

    return sanitized
