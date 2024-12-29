export const sanitizeInput = (input) => {
    if (typeof input !== "string") return "";

    // Remove HTML tags
    let sanitized = input.replace(/<[^>]*>/g, "");

    // Remove script tags and content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

    // Escape special characters
    sanitized = sanitized
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // Trim whitespace
    sanitized = sanitized.trim();

    return sanitized;
};
