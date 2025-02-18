# Tools

This directory contains tools that are used to expose as library or API.

## Usage

### API

Run server with `pnpm vckit server` command.
Open browser and navigate to `http://localhost:3332/api-docs#post-/computeHash`.

### Library

Install `@uncefact/vckit-tools` package with `pnpm i @uncefact/vckit-tools` command.
Use `computeHash` function from `@uncefact/vckit-tools` package.

## Run unit test

Run `pnpm run test:packages` command.

## Config in agent config file

```yml
...
constants:
  methods:
    ...
    # Add method for MultibaseEncodedSHA256
    - computeHash

...
agent:
  $require: '@veramo/core#Agent'
  $args:
    plugins:
        ...
        # Add tools plugin for MultibaseEncodedSHA256
        - $require: '@uncefact/vckit-tools?#MultibaseEncodedSHA256'
```
