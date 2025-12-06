export function formatOutput(data: unknown, json: boolean): void {
  if (json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (Array.isArray(data)) {
    formatTable(data);
  } else if (typeof data === "object" && data !== null) {
    formatObject(data as Record<string, unknown>);
  } else {
    console.log(data);
  }
}

function formatTable(data: unknown[]): void {
  if (data.length === 0) {
    console.log("No results found.");
    return;
  }

  const headers = Object.keys(data[0] as Record<string, unknown>);
  const widths = headers.map((h) =>
    Math.max(
      h.length,
      ...data.map((row) => {
        const val = (row as Record<string, unknown>)[h];
        return String(val ?? "").slice(0, 40).length;
      }),
    ),
  );

  console.log(headers.map((h, i) => h.padEnd(widths[i] ?? 0)).join(" | "));
  console.log(widths.map((w) => "-".repeat(w)).join("-+-"));

  const displayData = data.slice(0, 20);
  for (const row of displayData) {
    const r = row as Record<string, unknown>;
    console.log(
      headers
        .map((h, i) => {
          const val = String(r[h] ?? "").slice(0, 40);
          return val.padEnd(widths[i] ?? 0);
        })
        .join(" | "),
    );
  }

  if (data.length > 20) {
    console.log(
      `\n... and ${data.length - 20} more results. Use --json for full output.`,
    );
  }
}

function formatObject(data: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      console.log(`${key}: [${value.length} items]`);
    } else if (typeof value === "object" && value !== null) {
      console.log(`${key}:`);
      for (const [k, v] of Object.entries(value)) {
        console.log(`  ${k}: ${v}`);
      }
    } else {
      console.log(`${key}: ${value}`);
    }
  }
}
