import { testCodeAction } from "./codeActionTestBase";

describe("add new function parameter", () => {
  it("can add parameter to function", async () => {
    const source = `
--@ Test.elm
module Test exposing (..)


outer : number
outer =
    something
      --^
`;

    const expectedSource = `
--@ Test.elm
module Test exposing (..)


outer : something -> number
outer something =
    something
`;

    await testCodeAction(
      source,
      [{ title: `Add new parameter to 'outer'` }],
      expectedSource,
    );
  });

  it("should infer correct types when adding to the type signature", async () => {
    const source = `
--@ Test.elm
module Test exposing (..)


outer : Int
outer =
    maybeToIntOrZero (Just "one")
    --^
`;

    const expectedSource = `
--@ Test.elm
module Test exposing (..)


outer : (Maybe String -> Int) -> Int
outer maybeToIntOrZero =
    maybeToIntOrZero (Just "one")
`;

    await testCodeAction(
      source,
      [{ title: `Add new parameter to 'outer'` }],
      expectedSource,
    );
  });

  it("can add parameters to local functions", async () => {
    const source = `
--@ Test.elm
module Test exposing (..)


outer : ()
outer =
    let
        inner =
            something
            --^

    in
    ()
`;

    const expectedSource = `
--@ Test.elm
module Test exposing (..)


outer : ()
outer =
    let
        inner something =
            something

    in
    ()
`;

    await testCodeAction(
      source,
      [{ title: `Add new parameter to 'inner'` }],
      expectedSource,
    );
  });

  it("can add parameters to outer functions from usage in local functions", async () => {
    const source = `
--@ Test.elm
module Test exposing (..)


outer : ()
outer =
    let
        inner =
            something
            --^

    in
    ()
`;

    const expectedSource = `
--@ Test.elm
module Test exposing (..)


outer : something -> ()
outer something =
    let
        inner something =
            something

    in
    ()
`;

    await testCodeAction(
      source,
      [{ title: `Add new parameter to 'outer'` }],
      expectedSource,
    );
  });

  it("can infer parameters that are aliased", async () => {
    const source = `
--@ Browser.Navigation.elm
module Browser.Navigation exposing
  ( Key
  , replaceUrl
  )

type Key = Key

replaceUrl : Key -> String -> Cmd msg
replaceUrl =
  Elm.Kernel.Browser.replaceUrl

--@ Test.elm
module Test exposing (..)

import Browser.Navigation as Nav


replaceUrl : Route -> Cmd msg
replaceUrl route =
    Nav.replaceUrl key (routeToString route)
                  --^
`;

    const expectedSource = `
--@ Test.elm
module Test exposing (..)

import Browser.Navigation as Nav


replaceUrl : Route - Nav.key -> Cmd msg
replaceUrl route key =
    Nav.replaceUrl key (routeToString route)
`;

    await testCodeAction(
      source,
      [{ title: `Add new parameter to 'replaceUrl'` }],
      expectedSource,
    );
  });
});
