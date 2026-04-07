import * as fs from "fs";
import * as path from "path";

describe("build and packaging regressions", () => {
  it("package.json files field includes src/ for source map resolution (Ref #529)", () => {
    const pkgPath = path.resolve(__dirname, "../../package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const files: string[] = pkg.files || [];
    const includesSrc = files.some(
      (f: string) => f === "src" || f.startsWith("src/"),
    );
    expect(includesSrc).toBe(true);
  });
});
