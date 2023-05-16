---
title: React DOM APIs
translators: [이나령]
---

<Intro>

The `react-dom` package contains methods that are only supported for the web applications (which run in the browser DOM environment). They are not supported for React Native.
<Trans>`react-dom` 패키지에는 웹 애플리케이션(브라우저 DOM 환경에서 실행되는)에만 지원되는 메서드가 포함되어 있습니다. 이 메서드들은 React Native에서는 지원되지 않습니다.</Trans>

</Intro>

---

## APIs {/*apis*/}

These APIs can be imported from your components. They are rarely used:
<Trans>이러한 API들을 컴포넌트에서 가져올 수 있습니다. 거의 사용되지 않습니다:</Trans>

* [`createPortal`](/reference/react-dom/createPortal) lets you render child components in a different part of the DOM tree.
* [`flushSync`](/reference/react-dom/flushSync) lets you force React to flush a state update and update the DOM synchronously.
<TransBlock>
* [`createPortal`](/reference/react-dom/createPortal)을 사용하면 DOM 트리의 다른 부분에 자식 컴포넌트를 렌더링할 수 있습니다.
* [`flushSync`](/reference/react-dom/flushSync)를 사용하면 React가 state 업데이트를 강제로 플러시(메모리등을 강제로 처리하여 비워냄)하고 DOM을 동기적으로 업데이트할 수 있습니다.
</TransBlock>

---

## Entry points <Trans>진입점</Trans> {/*entry-points*/}

The `react-dom` package provides two additional entry points:
<Trans>React DOM 패키지는 두 개의 추가 진입점을 제공합니다:</Trans>

* [`react-dom/client`](/reference/react-dom/client) contains APIs to render React components on the client (in the browser).
* [`react-dom/server`](/reference/react-dom/server) contains APIs to render React components on the server.
<TransBlock>
* [`react-dom/client`](/reference/react-dom/client) 에는 클라이언트(브라우저)에서 React 컴포넌트를 렌더링하기 위한 API가 포함되어 있습니다.
* [`react-dom/server`](/reference/react-dom/server) 에는 서버에서 React 컴포넌트를 렌더링하기 위한 API가 포함되어 있습니다.
</TransBlock>

---

## Deprecated APIs <Trans>더 이상 사용되지 않는 API</Trans> {/*deprecated-apis*/}

<Deprecated>

These APIs will be removed in a future major version of React.
<Trans>다음 API들은 향후 React의 메인 버전에서 삭제될 예정입니다.</Trans>

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) finds the closest DOM node corresponding to a class component instance.
<Trans>[`findDOMNode`](/reference/react-dom/findDOMNode)는 클래스 컴포넌트 인스턴스에 해당하는 가장 가까운 DOM 노드를 찾습니다.</Trans>

* [`hydrate`](/reference/react-dom/hydrate) mounts a tree into the DOM created from server HTML. Deprecated in favor of [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
<Trans>[`hydrate`](/reference/react-dom/hydrate)는 서버 HTML에서 생성된 DOM에 트리를 마운트합니다. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)로 대체되어 지원 중단되었습니다.</Trans>

* [`render`](/reference/react-dom/render) mounts a tree into the DOM. Deprecated in favor of [`createRoot`](/reference/react-dom/client/createRoot).
<Trans>[`render`](/reference/react-dom/render)는 트리를 DOM에 마운트합니다. [`createRoot`](/reference/react-dom/client/createRoot)로 대체되어 지원 중단되었습니다.</Trans>

* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) unmounts a tree from the DOM. Deprecated in favor of [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount)
<Trans>* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) 는 DOM에서 트리를 언마운트합니다. [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount)로 대체되어 지원 중단되었습니다.</Trans>

