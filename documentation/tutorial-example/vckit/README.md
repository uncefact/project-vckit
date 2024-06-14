1. Install dependencies
```bash
npm install
```
2. Create identifier
```bash
node --loader ts-node/esm ./src/create-identifier.ts  
```
3. Get the list of identifiers
```bash
node --loader ts-node/esm ./src/list-identifiers.ts  
```
4. Issue a Vc
```bash
node --loader ts-node/esm ./src/create-credential.ts  
```
5. Verify a Vc
```bash
node --loader ts-node/esm ./src/verify-credential.ts  
```
6. Render a Vc
```bash
node --loader ts-node/esm ./src/render-credential.ts 
```