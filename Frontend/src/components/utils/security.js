export const sanitizeInput = (input) => {
    if (typeof input !== "string") return "";

    // removes html-like tags
    let sanitized = input.replace(/<[^>]*>/g, "");

    // clean up any scripts
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

    // escape special chars
    sanitized = sanitized
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    sanitized = sanitized.trim();

    return sanitized;
};
