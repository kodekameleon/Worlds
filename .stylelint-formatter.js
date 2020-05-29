function formatter(results) {
  const msgs = results.flatMap(result =>
    result.warnings.map(
      warning =>
        `${result.source}(${warning.line},${warning.column}): ${warning.severity}: ${warning.text}`
    )
  );
  return msgs.length === 0 ? "" : "\n" + msgs.join("\n");
}

module.exports = formatter;

