function isUrl(str) {
    // Regular expression pattern for URL validation
    var pattern = new RegExp(
        "^(https:\\/\\/)" + // Protocol (mandatory)
        "([a-z0-9\\.-]+\\.[a-z]{2,})" + // Domain name
        "(:\\d{2,5})?" + // Port (optional)
        "(\\/\\S*)?$", // Path (optional)
        "i" // Case-insensitive
    );

    // Test the string against the pattern
    return pattern.test(str);
}
module.exports = {
    isUrl
}