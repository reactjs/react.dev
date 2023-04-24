---
title: Start a New React Project
translatedTitle: 새 React 프로젝트 시작하기
translators: [정재남, 이상희, 유한나라]
---

<Intro>

If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community. Frameworks provide features that most apps and sites eventually need, including routing, data fetching, and generating HTML.
<Trans>새 앱이나 새 웹사이트를 React로 완전히 구축하려면 커뮤니티에서 인기 있는 React 기반 프레임워크 중 하나를 선택하는 것이 좋습니다. 프레임워크는 라우팅, 데이터 페치하기, HTML 생성 등 대부분의 앱과 사이트에서 궁극적으로 필요로 하는 기능을 제공합니다.</Trans>

</Intro>

<Note>

**You need to install [Node.js](https://nodejs.org/en/) for local development.** You can *also* choose to use Node.js in production, but you don't have to. Many React frameworks support export to a static HTML/CSS/JS folder.
<Trans>**로컬 개발을 위해서는 [Node.js](https://nodejs.org/en/)를 설치해야 합니다.** 프로덕션 환경에서 Node.js를 *선택*하여 사용할 수도 있지만, 반드시 그럴 필요는 없습니다. 많은 React 프레임워크가 정적 HTML/CSS/JS 폴더로 내보내기를 지원합니다.</Trans>

</Note>

## Production-grade React frameworks<Trans>프로덕션 등급 React 프레임워크</Trans> {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) is a full-stack React framework.** It's versatile and lets you create React apps of any size--from a mostly static blog to a complex dynamic application. To create a new Next.js project, run in your terminal:
<Trans>**[Next.js](https://nextjs.org/)는 풀스택 React 프레임워크입니다.** 이 프레임워크는 다용도로 사용할 수 있으며, 정적인 블로그부터 복잡한 동적 애플리케이션에 이르기까지 모든 규모의 React 앱을 만들 수 있습니다. 새 Next.js 프로젝트를 생성하려면 터미널에서 실행하세요:</Trans>

<TerminalBlock>
npx create-next-app
</TerminalBlock>

If you're new to Next.js, check out the [Next.js tutorial.](https://nextjs.org/learn/foundations/about-nextjs)
<Trans>Next.js를 처음 사용하는 경우 [Next.js 튜토리얼](https://nextjs.org/learn/foundations/about-nextjs)을 확인하세요.</Trans>

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/deployment) to any Node.js or serverless hosting, or to your own server. [Fully static Next.js apps](https://nextjs.org/docs/advanced-features/static-html-export) can be deployed to any static hosting.
<Trans>Next.js는 [Vercel](https://vercel.com/)에서 유지 관리합니다. Node.js 또는 서버리스 호스팅 또는 자체 서버에 [Next.js 앱을 배포](https://nextjs.org/docs/deployment)할 수 있습니다. [완전히 정적인 Next.js 앱](https://nextjs.org/docs/advanced-features/static-html-export)은 모든 정적 호스팅에 배포할 수 있습니다.</Trans>

### Remix {/*remix*/}

**[Remix](https://remix.run/) is a full-stack React framework with nested routing.** It lets you break your app into nested parts that can load data in parallel and refresh in response to the user actions. To create a new Remix project, run:
<Trans>**[Remix](https://remix.run/)는 중첩 라우팅을 지원하는 풀스택 React 프레임워크입니다.** 이 프레임워크를 사용하면 데이터를 병렬로 로드하고 사용자 동작에 따라 새로 고칠 수 있는 중첩된 부분으로 앱을 분할할 수 있습니다. 새 Remix 프로젝트를 생성하려면 다음을 실행하세요:</Trans>

<TerminalBlock>
npx create-remix
</TerminalBlock>

If you're new to Remix, check out the Remix [blog tutorial](https://remix.run/docs/en/main/tutorials/blog) (short) and [app tutorial](https://remix.run/docs/en/main/tutorials/jokes) (long).
<Trans>Remix를 처음 사용하는 경우 Remix [블로그 튜토리얼](https://remix.run/docs/en/main/tutorials/blog)(short) 및 [앱 튜토리얼](https://remix.run/docs/en/main/tutorials/jokes)(long)을 확인하세요.</Trans>

Remix is maintained by [Shopify](https://www.shopify.com/). When you create a Remix project, you need to [pick your deployment target](https://remix.run/docs/en/main/guides/deployment). You can deploy a Remix app to any Node.js or serverless hosting by using or writing an [adapter](https://remix.run/docs/en/main/other-api/adapter).
<Trans>Remix는 [Shopify](https://www.shopify.com/)에서 유지 관리합니다. Remix 프로젝트를 생성할 때 [배포 대상 선택](https://remix.run/docs/en/main/guides/deployment)을 해야 합니다. [어댑터]([https://remix.run/docs/en/main/other-api/adapter](https://remix.run/docs/en/main/other-api/adapter))를 사용하거나 작성하여 모든 Node.js 또는 서버리스 호스팅에 Remix 앱을 배포할 수 있습니다.</Trans>

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) is a React framework for fast CMS-backed websites.** Its rich plugin ecosystem and its GraphQL data layer simplify integrating content, APIs, and services into one website. To create a new Gatsby project, run:
<Trans>**[개츠비](https://www.gatsbyjs.com/)는 빠른 CMS 지원 웹사이트를 위한 React 프레임워크입니다.** 풍부한 플러그인 생태계와 GraphQL 데이터 레이어는 콘텐츠, API, 서비스를 하나의 웹사이트로 통합하는 작업을 간소화합니다. 새 개츠비 프로젝트를 생성하려면 다음을 실행하세요:</Trans>

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

If you're new to Gatsby, check out the [Gatsby tutorial.](https://www.gatsbyjs.com/docs/tutorial/)
<Trans>개츠비를 처음 사용하는 경우 [개츠비 튜토리얼](https://www.gatsbyjs.com/docs/tutorial/)을 확인하세요.</Trans>

Gatsby is maintained by [Netlify](https://www.netlify.com/). You can [deploy a fully static Gatsby site](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) to any static hosting. If you opt into using server-only features, make sure your hosting provider supports them for Gatsby.
<Trans>개츠비는 [Netlify](https://www.netlify.com/)에서 유지 관리합니다. 정적 호스팅에 [완전 정적 개츠비 사이트 배포](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting)를 할 수 있습니다. 서버 전용 기능을 사용하기로 선택한 경우 호스팅 제공업체가 개츠비에서 해당 기능을 지원하는지 확인하세요.</Trans>

### Expo (for native apps) {/*expo*/}

**[Expo](https://expo.dev/) is a React framework that lets you create universal Android, iOS, and web apps with truly native UIs.** It provides an SDK for [React Native](https://reactnative.dev/) that makes the native parts easier to use. To create a new Expo project, run:
<Trans>[**엑스포**](https://expo.dev/)는 진정한 네이티브 UI를 갖춘 범용 안드로이드, iOS, 웹 앱을 만들 수 있는 React 프레임워크이며, 네이티브 부분을 더 쉽게 사용할 수 있는 [React Native](https://reactnative.dev/) 용 SDK를 제공합니다. 새 엑스포 프로젝트를 생성하려면 다음을 실행합니다:</Trans>

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

If you're new to Expo, check out the [Expo tutorial](https://docs.expo.dev/tutorial/introduction/).
<Trans>엑스포를 처음 사용하는 경우, [엑스포 튜토리얼](https://docs.expo.dev/tutorial/introduction/)을 참고하세요.</Trans>

Expo is maintained by [Expo (the company)](https://expo.dev/about). Building apps with Expo is free, and you can submit them to the Google and Apple app stores without restrictions. Expo additionally provides opt-in paid cloud services.
<Trans>엑스포는 [엑스포(회사)](https://expo.dev/about)에서 유지 관리합니다. 엑스포를 사용하여 앱을 만드는 것은 무료이며, 제한 없이 구글 및 애플 앱스토어에 제출할 수 있습니다. 엑스포는 옵트인 유료 클라우드 서비스를 추가로 제공합니다.</Trans>

<DeepDive>

#### Can I use React without a framework?<Trans>프레임워크 없이 React를 사용할 수 있나요?</Trans> {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**
<Trans>[페이지 일부에 React를 사용하는 방식](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)으로 프레임워크 없이도 React를 사용할 수 있습니다. **하지만 새 앱이나 사이트를 완전히 React로 구축하는 경우에는 프레임워크를 사용하는 것이 좋습니다.**</Trans>

Here's why.
<Trans>그 이유는 다음과 같습니다.</Trans>

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.
<Trans>처음에는 routing이나 데이터 페칭이 필요하지 않더라도 이를 위한 라이브러리를 추가하고싶을 것입니다. 새로운 기능이 추가될 때마다 JavaScript 번들이 증가함에 따라 모든 경로에 대한 코드를 개별적으로 분할하는 방법을 찾아야 할 수 있습니다. 데이터 페칭의 요구사항이 복잡해지면 서버-클라이언트 네트워크 워터폴이 발생하여 앱이 매우 느리게 느껴질 수 있습니다. 네트워크 상태가 좋지않은 사용자나 저사양기기를 사용하는 사용자가 대상에 더 많이 포함되므로 서버 또는 빌드 시간 중에 컨텐츠를 우선적으로 표시하기 위해 컴포넌트에서 HTML을 생성해야 할 수 있습니다. 서버 또는 빌드 중에 일부 코드를 실행하도록 설정을 변경하는 것은 매우 까다로울 수 있습니다.</Trans>

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.
<Trans>**이러한 문제는 React에만 국한된 것이 아닙니다. 이것은 Svelte에 SvelteKit이 있고, Vue에 Nuxt가 있는 이유입니다.** 이러한 문제를 해결하려면 번들러를 라우터 및 데이터 페칭 라이브러리와 통합해야합니다. 초기 설정은 어렵지 않지만 시간이 지나면서 앱이 커져도 빠르게 로드되는 앱을 만드는 데에는 미묘한 차이가 있습니다. 최소한의 앱의 코드를 전송하면서 페이지에 필요한 모든 데이터와 함께 클라이언트-서버를 한 번으로 전송하는 방법이 좋습니다. 당신은 점진적인 개선을 지원하기 위해 JavaScript 코드가 실행하기 전에 페이지가 인터랙티브하게 표시되기를 원할 것입니다. 어디서나 호스팅이 가능하며 JavaScript가 비활성화한 상태에서도 작동하는 마케팅 페이지용 정적 HTML폴더를 생성하고 싶을 수 있습니다. 이런 기능을 직접 구축한다면 상당한 노력이 필요합니다.</Trans>

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).
<Trans>**이 페이지의 React 프레임워크는 사용자가 추가작업을 하지 않아도 기본적으로 같은 문제를 해결합니다.** 매우 간결하게 시작한 다음, 필요에 따라 앱을 확장할 수도 있습니다. 각 React 프레임워크에는 커뮤니티가 있으며 질문에 대한 답을 찾고 툴을 업그래이드 하는 것이 더 쉽습니다. 또한 프레임워크는 코드에 구조를 부여하여 다른 사람들이 다른 프로젝트간의 컨텍스트와 기술을 유지할 수 있도록 도와줍니다. 반대로 사용자 정의 설정을 사용하면, 지원되지 않는 의존성 버전에 갇히기 쉬우며, 커뮤니티나 업그레이드 경로가 없는 (그리고 과거에 만들었던 프레임워크와 마찬가지로 더 엉성하게 설계된) 자체 프레임워크를 만들게 될 것입니다.</Trans>

If you're still not convinced, or your app has unusual constraints not served well by these frameworks and you'd like to roll your own custom setup, we can't stop you--go for it! Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.
<Trans>여전히 확신이 서지 않거나 앱에 프레임워크가 적용되지 않는 제약조건이 있어서 자신만의 사용자 지정 설정을 적용하고 싶다면, 저희는 막을수 없습니다- 그렇게 하세요! npm에서 `react` 및 `react-dom` 을 가져오고, [Vite](https://vitejs.dev/) 또는 [Parcel](https://parceljs.org/) 같은 번들러로 사용자 정적 빌드 프로세스를 설정하고, 라우팅, 정적 생성 또는 서버 측 렌더링을 위해 다른 도구를 추가하세요.</Trans>

</DeepDive>

## Bleeding-edge React frameworks<Trans>최첨단 React 프레임워크</Trans> {/*bleeding-edge-react-frameworks*/}

As we've explored how to continue improving React, we realized that integrating React more closely with frameworks (specifically, with routing, bundling, and server technologies) is our biggest opportunity to help React users build better apps. The Next.js team has agreed to collaborate with us in researching, developing, integrating, and testing framework-agnostic bleeding-edge React features like [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
<Trans>React를 지속적으로 개선하는 방법을 모색하면서, React를 프레임워크(특히 라우팅, 번들링 및 서버 기술)와 더 긴밀하게 통합하는 것이 React 사용자가 더 나은 앱을 구축할 수 있도록 도울 수 있는 가장 큰 기회라는 것을 깨달았습니다. Next.js 팀은 [React 서버 컴포넌트](https://react.dev/blog/2020/12/21/data-fetching-with-react-server-components)와 같이 프레임워크에 구애받지 않는 최첨단 React 기능을 연구, 개발, 통합 및 테스트하는 데 우리와 협력하기로 합의했습니다.</Trans>

These features are getting closer to being production-ready every day, and we've been in talks with other bundler and framework developers about integrating them. Our hope is that in a year or two, all frameworks listed on this page will have full support for these features. (If you're a framework author interested in partnering with us to experiment with these features, please let us know!)
<Trans>이러한 기능들은 매일 프로덕션에 사용할 수 있는 단계에 가까워지고 있으며, 다른 번들러 및 프레임워크 개발자들과도 통합에 대해 논의하고 있습니다. 1~2년 안에 이 페이지에 나열된 모든 프레임워크가 이러한 기능을 완벽하게 지원하게 되기를 희망합니다. (이러한 기능을 실험해보고 싶은 프레임워크 작성자가 있다면 알려주세요!)</Trans>

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://beta.nextjs.org/docs/getting-started) is a redesign of the Next.js APIs aiming to fulfill the React team’s full-stack architecture vision.** It lets you fetch data in asynchronous components that run on the server or even during the build.
<Trans>[**Next.js의 앱 라우터](https://beta.nextjs.org/docs/getting-started)는 React 팀의 풀스택 아키텍처 비전을 실현하기 위해 Next.js API를 재설계한 것입니다.** 서버에서 실행되거나 빌드 중에도 비동기 컴포넌트에서 데이터를 페치할 수 있도록 해줍니다.</Trans>

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/deployment) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://beta.nextjs.org/docs/configuring/static-export) which doesn't require a server.
<Trans>Next.js는 [Vercel](https://vercel.com/)에서 유지 관리합니다. Next.js 앱을]([https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)) 모든 Node.js 또는 서버리스 호스팅 또는 자체 서버에 배포할 수 있습니다. 정적 내보내기는 Next.js의 앱 라우터에서 지원하기로 [계획되어 있습니다.](https://beta.nextjs.org/docs/app-directory-roadmap#configuration)</Trans>

<Pitfall>

Next.js's App Router is **currently in beta and is not yet recommended for production** (as of Mar 2023). To experiment with it in an existing Next.js project, [follow this incremental migration guide](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).
<Trans>Next.js의 앱 라우터는 현재 베타버전이며 아직 프로덕션에는 권장되지 않습니다.(2023년 3월기준). 기존 Next.js 프로젝트에서 실험해 보려면 이 [점진적 마이그래이션 가이드를 따르세요](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).</Trans>

</Pitfall>

<DeepDive>

#### Which features make up the React team’s full-stack architecture vision?<Trans>React팀의 풀스택 아키텍처 비전을 구성하는 기능은 무엇인가요?</Trans> {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js's App Router bundler fully implements the official [React Server Components specification](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). This lets you mix build-time, server-only, and interactive components in a single React tree.
<Trans>Next.js의 앱 라우터 번들러는 공식 [React 서버 컴포넌트 사양](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)을 완벽하게 구현합니다. 이를 통해 빌드 타임, 서버 전용, 인터랙티브 컴포넌트를 단일 React트리에서 혼합할 수 있습니다.</Trans>

For example, you can write a server-only React component as an `async` function that reads from a database or from a file. Then you can pass data down from it to your interactive components:
<Trans>예를 들어 서버전용 React 컴포넌트를 데이터베이스나 파일에서 읽는 `async` 함수로 작성할 수 있습니다. 그런 다음 데이터를 인터랙티브 컴포넌트로 전달할 수 있습니다.</Trans>

```js
// This component runs *only* on the server (or during the build).
// 이 컴포넌트는 서버에서 (또는 빌드 중에) *단독적으로* 실행됩니다.
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  // 1. 서버에 있으므로 데이터 레이어와 대화할 수 있습니다. API 엔드포인트는 필요하지 않습니다.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  // 2. 원하는 만큼 렌더링 로직을 추가합니다. JavaScript 번들을 더 크게 만들지는 않습니다.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  // 3. 브라우저에서 실행될 컴포넌트에 데이터를 전달합니다.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js's App Router also integrates [data fetching with Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). This lets you specify a loading state (like a skeleton placeholder) for different parts of your user interface directly in your React tree:
<Trans>Next.js의 App Router는 [데이터 페칭과 Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks)를 통합하기도 합니다.  이를 통해 사용자 인터페이스의 여러 부분에 대한 로딩 state(예: 스켈레톤 placeholder)를 React 트리에서 직접 지정할 수 있습니다.</Trans>

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components and Suspense are React features rather than Next.js features. However, adopting them at the framework level requires buy-in and non-trivial implementation work. At the moment, the Next.js App Router is the most complete implementation. The React team is working with bundler developers to make these features easier to implement in the next generation of frameworks.
<Trans>서버 컴포넌트와 Suspense는 Next.js 기능이 아닌 React 기능입니다. 그러나 프레임워크 수준에서 이를 채택하려면 동의를 구하고 사소한 구현 작업이 필요합니다. 현재로서는 Next.js 앱 라우터가 가장 완벽하게 구현되어 있습니다. React팀은 차세대 프레임워크에서 이러한 기능을 더 쉽게 구현할 수 있도록 번들러 개발자와 협력하고 있습니다.</Trans>

</DeepDive>
