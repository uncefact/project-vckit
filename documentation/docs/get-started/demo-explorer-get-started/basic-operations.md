---
sidebar_label: 'Basic Operations'
sidebar_position: 3
---
# Basic Operations

## Create an identifier
First of all, you need to create an **identifier**. To do it, visit this URL [`http://localhost:3000/managed-identifiers`](http://localhost:3000/managed-identifiers).
### Step 1
Click **Create New Identifier** button.

![create identifier](/img/create-identifier.png)
### Step 2
Give it an example alias, and select the did type, in this case we use did:key. Then click **Save**

![create identifier 2](/img/create-identifier-2.png)

### Step 3
Here's the identifier you just created, you can click **copy** button to copy the did id (red highlighted) into your clipboard.

![create identifier 3](/img/create-identifier-3.png)

## Issue a Verifiable Credential
Visit this URL [`http://localhost:3000/developer/credential-from-schema`](http://localhost:3000/developer/credential-from-schema) to issue a VC.

### Step 1
1. Select the VC schema from the dropdown.
2. Add Credential subject.
3. Select proof format
4. Select the issuer (the identifier you created at previous step)
5. Click Issue button.

![issue credential](/img/issue-credential.png)

### Step 2
Go to [**Credential**](http://localhost:3000/credentials) page to see the list of issued VC. Here you can download the VC, and verify it in the next step.

![issue credential 3](/img/issue-credential-2.png)

You can also see the details of the VC. At Rendered tab, you can see the rendered version of it, this is made by the [Renderer](https://www.npmjs.com/package/@vckit/renderer) plugin of VCKit.

:::note
The QR code won't work due to being on localhost, and it's not a result of rendering.
:::

![issue credential 4](/img/issue-credential-4.png)

## Verify a VC
Go to [**Credential verifier**](http://localhost:3000/credential-verifier) page to verify a VC. You can upload the VC that you downloaded previously here to verify it.
This is the expected result.

![verify vc](/img/verify-vc.png)

## Revoke a VC
To revoke a VC, do these steps:
1. Go to [**Credential**](http://localhost:3000/credentials) page.
2. Select the VC that you want to revoke.
3. Select tab **Info**
4. Scroll to the bottom of the page, and click **Revoke**

![revoke vc](/img/revoke-vc.png)

Now, if you try to verify this VC again, this will be the result.

![revoke vc 2](/img/revoke-2.png)

You can unrevoke it to make it valid by clicking the **Unrevoke** button.

![revoke vc 3](/img/revoke-3.png)

