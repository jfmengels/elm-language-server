import "reflect-metadata";
import { container } from "tsyringe";
import { URI } from "vscode-uri";
import { formatText } from "../src/util/diff";
import { Connection } from "vscode-languageserver";

container.register("Connection", {
  useValue: {
    console: {
      info: (a: string): void => {
        // console.log(a);
      },
      warn: (a: string): void => {
        // console.log(a);
      },
      error: (a: string): void => {
        // console.log(a);
      },
    },
    window: {
      showErrorMessage: (a: string): void => {
        console.log(a);
      },
    },
  },
});
describe("test formatting", () => {
  const connection = container.resolve<Connection>("Connection");
  const pathUri = URI.file(__dirname);

  test("normal format gives correct result", async () => {
    const result = await formatText(
      pathUri,
      "elm-format",
      "module Test",
      connection,
    );

    expect(result).toMatchSnapshot();
  });
});
