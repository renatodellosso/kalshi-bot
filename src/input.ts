export async function confirm(): Promise<boolean> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    stdin.resume();
    stdout.write("Confirm? (y/N): ");

    stdin.once("data", (data) => {
      const input = data.toString().trim().toLowerCase();
      resolve(input === "y" || input === "yes");
    });
  });
}
