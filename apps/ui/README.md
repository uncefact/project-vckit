# Digital Verification Platform Web UI

## White-labelling

VCKit supports white-labelling through the use of configuration files.

### General Configuration

The `src/appConfig.js` file contains general application variables, such as application name and domain name.

### Theme and Styling

The `src/tailwind.js` file contains theme and styling variables, such as primary colour and main background image.

### RJSF Custom Layout

VCKit leverages [RJSF](https://react-jsonschema-form.readthedocs.io/en/latest/) to render schema-driven forms. In order to control the layout of the fields, a custom [ObjectFieldTemplate](https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/custom-templates/#objectfieldtemplate) is implemented with the feature to allow multiple fields to be on the same row. Every row is divided into 12 columns. To specify the number of columns a field can span, include the `uiLayout` in the corresponding object under `uiSchema` in the config file. The index of an item in the layout array corresponds to the position of the child field. If no span is specified for a particular field then the field takes up the entire row by default. The layout can be configured for each breakpoint size:

- sm (min-width: 0)
- md (min-width: 768px)
- lg (min-width: 1024px)

```json
{
    ...,
    "forms": [{
        ...,
        "schema": {
            "type": "object",
            "properties": {
                "firstName": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "address": {
                    "type": "object",
                    "properties": {
                        "streetNumber": {
                            "type": "string"
                        },
                        "streetName": {
                            "type": "string"
                        },
                        "country": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "uiSchema": {
            "uiLayout": {
                "sm": [12, 12, 12],
                "md": [6, 6, 12]
            },
            "address": {
                "uiLayout": {
                    "sm": [12, 12, 12],
                    "md": [6, 6, 12]
                },
            }
        }
    }]
}
```

In the above example, the indices of the fields are as follow:

- `firstName`: 0
- `lastName`: 1
- `address`: 2
  - `streetNumber`: 0
  - `streetName`: 1
  - `country`: 2

`firstName` and `lastName` take up 6 columns each, putting them on the same row. `address` object is given an entire row. However, inside the `address` object, `streetNumber` and `streetName` are on the same row, spanning 6 columns each, and `country` has an entire row to itself.

## Development

We develop primarily on a OS X / Linux environment so please lodge an issue if you are using Windows and find that you cannot successfully set up a local instance of this software.

### OS X / Linux

```bash
npm install
npm run dev
```

### Windows

For Windows you need to set up the toolchain for node-gyp before installing this repository, follow the instructions in https://github.com/nodejs/node-gyp#on-windows.

```bash
npm install
npm run dev
```

### Environmental Variables

`NET` is used for setting the default network, setting it to `mainnet` uses the public Ethereum network. If it is not set it defaults to Ropsten testnet.
It can also take any network names that Ethers.JS supports, such as `rinkeby`, `kovan`, etc.
However do note that there are only drag & drop demo files provided for main net and ropsten.

E.g:

```bash
NET=mainnet npm run dev
```

or

```bash
NET=rinkeby npm run dev
```

### Troubleshooting

To enable debug logs in the browser, set `localStorage.debug="*"`

### Test single feature flag

To test, simply run the following in console and refresh the website:

```
localStorage.setItem("FEATURE_FLAG", JSON.stringify({ADDRESS_BOOK_UPLOAD: true}))
```

or

```
localStorage.FEATURE_FLAG =  JSON.stringify({ADDRESS_BOOK_UPLOAD: true})
```

### Test all feature flags

```
localStorage.setItem("FEATURE_FLAG", JSON.stringify({ALL: true}))
```

or

```
localStorage.FEATURE_FLAG =  JSON.stringify({ALL: true})
```

### Module build failed

If you see module build failure message like:

```
Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
ModuleBuildError: Module build failed (from ./node_modules/sass-loader/lib/loader.js):
Error: ENOENT: no such file or directory, scandir 'D:\opencerts-website\node_modules\node-sass\vendor'
at Object.readdirSync (fs.js:783:3)
```

Try running `npm rebuild`

### Generating CREDITS.md

Run `npx @opengovsg/credits-generator`

### Running single integration test

`npm run integration:single <path>`, for the path, you can copy paste relative path via text editor.

### Managing Netlify CMS

- Enable Identity + Git Gateway
- https://www.netlifycms.org/docs/add-to-your-site/#enable-identity-and-git-gateway

### Inviting users to Netlify CMS

- Go to https://www.netlify.com and login netlify
- Choose `DLT` > `Sites` > `tradetrust.io` site
- Click `Identity`, invite user via email address

### Debugging Netlify CMS locally

https://www.netlifycms.org/docs/beta-features/#working-with-a-local-git-repository

1. run `npx netlify-cms-proxy-server`
2. run `npm run dev`
3. access admin page by `http://localhost:3000/admin/`
