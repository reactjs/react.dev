---
title: "Denial of Service and Source Code Exposure in React Server Components"
author: The React Team
date: 2025/12/11
description: Security researchers have found and disclosed two additional vulnerabilities in React Server Components while attempting to exploit the patches in last week’s critical vulnerability. High vulnerability Denial of Service (CVE-2025-55184), and medium vulnerability Source Code Exposure (CVE-2025-55183)


---

December 11, 2025 by [The React Team](/community/team)

_Updated January 26, 2026._

---

<Intro>

Security researchers have found and disclosed two additional vulnerabilities in React Server Components while attempting to exploit the patches in last week’s critical vulnerability.

**These new vulnerabilities do not allow for Remote Code Execution.** The patch for React2Shell remains effective at mitigating the Remote Code Execution exploit.

</Intro>

---

The new vulnerabilities are disclosed as:

- **Denial of Service - High Severity**: [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184), [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779), and [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864) (CVSS 7.5)
- **Source Code Exposure - Medium Severity**: [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) (CVSS 5.3)

We recommend upgrading immediately due to the severity of the newly disclosed vulnerabilities.

<Note>

#### The patches published earlier are vulnerable. {/*the-patches-published-earlier-are-vulnerable*/}

If you already updated for the previous vulnerabilities, you will need to update again.

If you updated to 19.0.3, 19.1.4, and 19.2.3, [these are incomplete](#additional-fix-published), and you will need to update again.

Please see [the instructions in the previous post](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions) for upgrade steps.

-----

_Updated January 26, 2026._

</Note>

Further details of these vulnerabilities will be provided after the rollout of the fixes are complete.

## Immediate Action Required {/*immediate-action-required*/}

These vulnerabilities are present in the same packages and versions as [CVE-2025-55182](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components).

This includes 19.0.0, 19.0.1, 19.0.2, 19.0.3, 19.1.0, 19.1.1, 19.1.2, 19.1.3, 19.2.0, 19.2.1, 19.2.2, and 19.2.3 of:

* [react-server-dom-webpack](https://www.npmjs.com/package/react-server-dom-webpack)
* [react-server-dom-parcel](https://www.npmjs.com/package/react-server-dom-parcel)
* [react-server-dom-turbopack](https://www.npmjs.com/package/react-server-dom-turbopack?activeTab=readme)

Fixes were backported to versions 19.0.4, 19.1.5, and 19.2.4. If you are using any of the above packages please upgrade to any of the fixed versions immediately.

As before, if your app’s React code does not use a server, your app is not affected by these vulnerabilities. If your app does not use a framework, bundler, or bundler plugin that supports React Server Components, your app is not affected by these vulnerabilities.

<Note>

#### It’s common for critical CVEs to uncover follow‑up vulnerabilities. {/*its-common-for-critical-cves-to-uncover-followup-vulnerabilities*/}

When a critical vulnerability is disclosed, researchers scrutinize adjacent code paths looking for variant exploit techniques to test whether the initial mitigation can be bypassed.

This pattern shows up across the industry, not just in JavaScript. For example, after [Log4Shell](https://nvd.nist.gov/vuln/detail/cve-2021-44228), additional CVEs ([1](https://nvd.nist.gov/vuln/detail/cve-2021-45046), [2](https://nvd.nist.gov/vuln/detail/cve-2021-45105)) were reported as the community probed the original fix.

Additional disclosures can be frustrating, but they are generally a sign of a healthy response cycle.

</Note>

### Affected frameworks and bundlers {/*affected-frameworks-and-bundlers*/}

Some React frameworks and bundlers depended on, had peer dependencies for, or included the vulnerable React packages. The following React frameworks & bundlers are affected: [next](https://www.npmjs.com/package/next), [react-router](https://www.npmjs.com/package/react-router), [waku](https://www.npmjs.com/package/waku), [@parcel/rsc](https://www.npmjs.com/package/@parcel/rsc), [@vite/rsc-plugin](https://www.npmjs.com/package/@vitejs/plugin-rsc), and [rwsdk](https://www.npmjs.com/package/rwsdk).

Please see [the instructions in the previous post](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions) for upgrade steps.

### Hosting Provider Mitigations {/*hosting-provider-mitigations*/}

As before, we have worked with a number of hosting providers to apply temporary mitigations.

You should not depend on these to secure your app, and still update immediately.

### React Native {/*react-native*/}

For React Native users not using a monorepo or `react-dom`, your `react` version should be pinned in your `package.json`, and there are no additional steps needed.

If you are using React Native in a monorepo, you should update _only_ the impacted packages if they are installed:

- `react-server-dom-webpack`
- `react-server-dom-parcel`
- `react-server-dom-turbopack`

This is required to mitigate the security advisories, but you do not need to update `react` and `react-dom` so this will not cause the version mismatch error in React Native.

See [this issue](https://github.com/facebook/react-native/issues/54772#issuecomment-3617929832) for more information.

---

## High Severity: Multiple Denial of Service {/*high-severity-multiple-denial-of-service*/}

**CVEs:** [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864)
**Base Score:** 7.5 (High)
**Date**: January 26, 2026

Security researchers discovered additional DoS vulnerabilities still exist in React Server Components.

The vulnerabilities are triggered by sending specially crafted HTTP requests to Server Function endpoints, and could lead to server crashes, out-of-memory exceptions or excessive CPU usage; depending on the vulnerable code path being exercised, the application configuration and application code.

The patches published January 26th mitigate these DoS vulnerabilities.

<Note>

#### Additional fixes published {/*additional-fix-published*/}

The original fix addressing the DoS in [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) was incomplete.

This left previous versions vulnerable. Versions 19.0.4, 19.1.5, 19.2.4 are safe.

-----

_Updated January 26, 2026._

</Note>

---

## High Severity: Denial of Service {/*high-severity-denial-of-service*/}

**CVEs:** [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) and [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779)
**Base Score:** 7.5 (High)

Security researchers have discovered that a malicious HTTP request can be crafted and sent to any Server Functions endpoint that, when deserialized by React, can cause an infinite loop that hangs the server process and consumes CPU. Even if your app does not implement any React Server Function endpoints it may still be vulnerable if your app supports React Server Components.

This creates a vulnerability vector where an attacker may be able to deny users from accessing the product, and potentially have a  performance impact on the server environment.

The patches published today mitigate by preventing the infinite loop.

## Medium Severity: Source Code Exposure {/*low-severity-source-code-exposure*/}

**CVE:** [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183)
**Base Score**: 5.3 (Medium)

A security researcher has discovered that a malicious HTTP request sent to a vulnerable Server Function may unsafely return the source code of any Server Function. Exploitation requires the existence of a Server Function which explicitly or implicitly exposes a stringified argument:

```javascript
'use server';

export async function serverFunction(name) {
  const conn = db.createConnection('SECRET KEY');
  const user = await conn.createUser(name); // implicitly stringified, leaked in db

  return {
   id: user.id,
   message: `Hello, ${name}!` // explicitly stringified, leaked in reply
  }}
```

An attacker may be able to leak the following:

```txt
0:{"a":"$@1","f":"","b":"Wy43RxUKdxmr5iuBzJ1pN"}
1:{"id":"tva1sfodwq","message":"Hello, async function(a){console.log(\"serverFunction\");let b=i.createConnection(\"SECRET KEY\");return{id:(await b.createUser(a)).id,message:`Hello, ${a}!`}}!"}
```

The patches published today prevent stringifying the Server Function source code.

<Note>

#### Only secrets in source code may be exposed. {/*only-secrets-in-source-code-may-be-exposed*/}

Secrets hardcoded in source code may be exposed, but runtime secrets such as `process.env.SECRET` are not affected.

The scope of the exposed code is limited to the code inside the Server Function, which may include other functions depending on the amount of inlining your bundler provides. 

Always verify against production bundles.

</Note>

---

## Timeline {/*timeline*/}
* **December 3rd**: Leak reported to Vercel and [Meta Bug Bounty](https://bugbounty.meta.com/) by [Andrew MacPherson](https://github.com/AndrewMohawk).
* **December 4th**: Initial DoS reported to [Meta Bug Bounty](https://bugbounty.meta.com/) by [RyotaK](https://ryotak.net).
* **December 6th**: Both issues confirmed by the React team, and the team began investigating.
* **December 7th**: Initial fixes created and the React team began verifying and planning new patch.
* **December 8th**: Affected hosting providers and open source projects notified.
* **December 10th**: Hosting provider mitigations in place and patches verified.
* **December 11th**: Additional DoS reported to [Meta Bug Bounty](https://bugbounty.meta.com/) by Shinsaku Nomura.
* **December 11th**: Patches published and publicly disclosed as [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) and [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184).
* **December 11th**: Missing DoS case found internally, patched and publicly disclosed as [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779).
* **January 26th**: Additional DoS cases found, patched, and publicly disclosed as [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864).
---

## Attribution {/*attribution*/}

Thank you to [Andrew MacPherson (AndrewMohawk)](https://github.com/AndrewMohawk) for reporting the Source Code Exposure, [RyotaK](https://ryotak.net) from GMO Flatt Security Inc and Shinsaku Nomura of Bitforest Co., Ltd. for reporting the Denial of Service vulnerabilities. Thank you to [Mufeed VH](https://x.com/mufeedvh) from [Winfunc Research](https://winfunc.com), [Joachim Viide](https://jviide.iki.fi), [RyotaK](https://ryotak.net) from [GMO Flatt Security Inc](https://flatt.tech/en/) and Xiangwei Zhang of Tencent Security YUNDING LAB for reporting the additional DoS vulnerabilities.
