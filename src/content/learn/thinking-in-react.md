---
title: Thinking in React
translatedTitle: React로 사고하기
translators: [김슬기, 정재남]
---

<Intro>

React can change how you think about the designs you look at and the apps you build. When you build a user interface with React, you will first break it apart into pieces called *components*. Then, you will describe the different visual states for each of your components. Finally, you will connect your components together so that the data flows through them. In this tutorial, we’ll guide you through the thought process of building a searchable product data table with React.
<Trans>React는 디자인을 바라보는 방식과 앱을 빌드하는 방식을 바꿀 수 있습니다. React로 사용자 인터페이스를 빌드할 때는 먼저 *컴포넌트*라고 하는 조각으로 분해합니다. 그런 다음 각 컴포넌트에 대해 서로 다른 시각적 상태를 기술합니다. 마지막으로 컴포넌트를 서로 연결해 데이터가 흐르도록 합니다. 이 튜토리얼에서는 React로 검색 가능한 제품 데이터 테이블을 구축하는 사고 과정을 안내합니다.</Trans>

</Intro>

## Start with the mockup<Trans>mockup으로 시작하기</Trans> {/*start-with-the-mockup*/}

Imagine that you already have a JSON API and a mockup from a designer.
<Trans>이미 JSON API와 디자이너의 목업이 있다고 가정해 보겠습니다.</Trans>

The JSON API returns some data that looks like this:
<Trans>JSON API는 다음과 같은 데이터를 반환합니다:</Trans>

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

The mockup looks like this:
<Trans>목업은 다음과 같습니다:</Trans>

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

To implement a UI in React, you will usually follow the same five steps.
<Trans>React에서 UI를 구현하려면 일반적으로 동일한 5단계를 따릅니다.</Trans>

## Step 1: Break the UI into a component hierarchy<Trans>UI를 컴포넌트 계층 구조로 나누기</Trans> {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Start by drawing boxes around every component and subcomponent in the mockup and naming them. If you work with a designer, they may have already named these components in their design tool. Ask them!
<Trans>먼저 목업의 모든 컴포넌트와 하위 컴포넌트 주위에 상자를 그리고 이름을 지정합니다. 디자이너와 함께 작업하는 경우 디자이너가 디자인 도구에서 이러한 컴포넌트의 이름을 이미 지정했을 수 있습니다. 디자이너에게 물어보세요!</Trans>

Depending on your background, you can think about splitting up a design into components in different ways:
<Trans>배경에 따라 디자인을 여러 가지 방식으로 컴포넌트로 분할하는 것을 생각해 볼 수 있습니다:</Trans>

* **Programming**--use the same techniques for deciding if you should create a new function or object. One such technique is the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), that is, a component should ideally only do one thing. If it ends up growing, it should be decomposed into smaller subcomponents. 
* **CSS**--consider what you would make class selectors for. (However, components are a bit less granular.)
* **Design**--consider how you would organize the design's layers.

<TransBlock>
- **프로그래밍 -** 새 함수나 객체를 생성할지 여부를 결정할 때 동일한 기법을 사용합니다. 이러한 기법 중 하나는 [단일 책임 원칙](https://en.wikipedia.org/wiki/Single_responsibility_principle)으로, 컴포넌트는 이상적으로는 한 가지 일만 수행해야 한다는 것입니다. 만약 컴포넌트가 늘어나게 되면 더 작은 하위 컴포넌트로 분해해야 합니다.
- **CSS -** 클래스 선택자를 만들 때 무엇을 위해 만들 것인지 생각해 보세요. (단, 컴포넌트는 조금 덜 세분화되어 있습니다.)
- **디자인 -** 디자인의 레이어를 어떻게 구성할지 고려하세요.
</TransBlock>

If your JSON is well-structured, you'll often find that it naturally maps to the component structure of your UI. That's because UI and data models often have the same information architecture--that is, the same shape. Separate your UI into components, where each component matches one piece of your data model.
<Trans>JSON이 잘 구조화되어 있으면 UI의 컴포넌트 구조에 자연스럽게 매핑되는 것을 종종 발견할 수 있습니다. 이는 UI와 데이터 모델이 동일한 정보 아키텍처, 즉 동일한 형태를 가지고 있는 경우가 많기 때문입니다. UI를 컴포넌트로 분리하면 각 컴포넌트가 데이터 모델의 한 부분과 일치합니다.</Trans>

There are five components on this screen:
<Trans>이 화면에는 5개의 컴포넌트가 있습니다:</Trans>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (grey) contains the entire app.
2. `SearchBar` (blue) receives the user input.
3. `ProductTable` (lavender) displays and filters the list according to the user input.
4. `ProductCategoryRow` (green) displays a heading for each category.
5. `ProductRow`	(yellow) displays a row for each product.
 
<TransBlock>
  1. `FilterableProductTable` (회색)에는 전체 앱이 포함됩니다.
  2. `SearchBar` (파란색)는 사용자 입력을 수신합니다.
  3. `ProductTable` (보라색)은 사용자 입력에 따라 목록을 표시하고 필터링합니다.
  4. `ProductCategoryRow` (녹색)는 각 카테고리에 대한 제목을 표시합니다.
  5. `ProductRow` (노란색)는 각 상품에 대한 행을 표시합니다.
</TransBlock>

If you look at `ProductTable` (lavender), you'll see that the table header (containing the "Name" and "Price" labels) isn't its own component. This is a matter of preference, and you could go either way. For this example, it is a part of `ProductTable` because it appears inside the `ProductTable`'s list. However, if this header grows to be complex (e.g., if you add sorting), you can move it into its own `ProductTableHeader` component.
<Trans>`ProductTable`(보라색)을 보면 테이블 헤더("Name" 및 "Price" 레이블 포함)가 자체 컴포넌트가 아님을 알 수 있습니다. 이것은 선호도의 문제이며 어느 쪽이든 사용할 수 있습니다. 이 예제에서는 `ProductTable`의 목록 안에 표시되므로 `ProductTable`의 일부입니다. 그러나 이 헤더가 복잡해지면(예: 정렬을 추가하는 경우) 이를 별도의 `ProductTableHeader` 컴포넌트로 이동할 수 있습니다.</Trans>

Now that you've identified the components in the mockup, arrange them into a hierarchy. Components that appear within another component in the mockup should appear as a child in the hierarchy:
<Trans>이제 목업에서 컴포넌트를 식별했으므로 계층 구조로 정렬합니다. 목업의 다른 컴포넌트 안에 있는 컴포넌트는 계층 구조에서 하위로 나타나야 합니다:</Trans>

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Step 2: Build a static version in React<Trans>React로 정적인 UI 만들기</Trans> {/*step-2-build-a-static-version-in-react*/}

Now that you have your component hierarchy, it's time to implement your app. The most straightforward approach is to build a version that renders the UI from your data model without adding any interactivity... yet! It's often easier to build the static version first and add interactivity later. Building a static version requires a lot of typing and no thinking, but adding interactivity requires a lot of thinking and not a lot of typing.
<Trans>컴포넌트 계층 구조가 완성되었으니 이제 앱을 구현할 차례입니다. 가장 간단한 접근은 상호작용을 추가하지 않고 데이터 모델에서 UI를 렌더링하는 버전을 만드는 것입니다! 정적 버전을 먼저 만든 다음 상호작용을 별도로 추가하는 것이 더 쉬운 경우가 많습니다. 정적 버전을 만드는 데엔 타이핑이 많이 필요하지만 고민은 크게 필요하지 않은 반면, 상호작용을 추가할 때엔 타이핑보다 고민이 많이 필요합니다.</Trans>

To build a static version of your app that renders your data model, you'll want to build [components](/learn/your-first-component) that reuse other components and pass data using [props.](/learn/passing-props-to-a-component) Props are a way of passing data from parent to child. (If you're familiar with the concept of [state](/learn/state-a-components-memory), don't use state at all to build this static version. State is reserved only for interactivity, that is, data that changes over time. Since this is a static version of the app, you don't need it.)
<Trans>데이터 모델을 렌더링하는 앱의 정적 버전을 만들기 위해서는 다른 컴포넌트를 재사용하는 [components](/learn/your-first-component)를 만들고 [props](/learn/passing-props-to-a-component)를 사용하여 데이터를 전달해야 합니다. props는 부모에서 자식으로 데이터를 전달하는 방식입니다. ([state](/learn/state-a-components-memory)의 개념에 익숙하더라도 이 정적 버전을 빌드할 때에는 state를 아예 사용하지 마세요. state는 상호작용, 즉 시간이 지남에 따라 변하는 데이터에만 사용됩니다. 이 앱은 정적 버전이므로 필요하지 않습니다.)</Trans>

You can either build "top down" by starting with building the components higher up in the hierarchy (like `FilterableProductTable`) or "bottom up" by working from components lower down (like `ProductRow`). In simpler examples, it’s usually easier to go top-down, and on larger projects, it’s easier to go bottom-up.
<Trans>계층 구조에서 상위 컴포넌트부터 '하향식'(예: `FilterableProductTable`)으로 만들거나, 하위 컴포넌트부터 '상향식'(예: `ProductRow`)으로 만들 수 있습니다. 보통 간단한 예시에서는 하향식으로 진행하는 것이 더 쉽고, 대규모 프로젝트에서는 상향식으로 진행하는 것이 더 쉽습니다.</Trans>

<Sandpack>

```jsx App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(If this code looks intimidating, go through the [Quick Start](/learn/) first!)
<Trans>(이 코드가 어렵게 느껴진다면 먼저 [빠른 시작](/learn/)을 살펴보세요!)</Trans>

After building your components, you'll have a library of reusable components that render your data model. Because this is a static app, the components will only return JSX. The component at the top of the hierarchy (`FilterableProductTable`) will take your data model as a prop. This is called _one-way data flow_ because the data flows down from the top-level component to the ones at the bottom of the tree.
<Trans>컴포넌트를 만들고 나면 데이터 모델을 렌더링하는 재사용 가능한 컴포넌트 라이브러리를 갖게 됩니다. 이 앱은 정적 앱이므로 컴포넌트는 JSX만 반환합니다. 계층 구조의 맨 위에 있는 컴포넌트(`FilterableProductTable`)는 데이터 모델을 prop으로 사용합니다. 데이터가 최상위 컴포넌트에서 트리 하단에 있는 컴포넌트로 흘러내리기 때문에 이를 *단방향 데이터 흐름*이라고 합니다.</Trans>

<Pitfall>

At this point, you should not be using any state values. That’s for the next step!
<Trans>아직 어떤 state도 사용하지 마세요. 다음 step에서 쓸 겁니다!</Trans>

</Pitfall>

## Step 3: Find the minimal but complete representation of UI state<Trans>최소한의 완전한 UI state 찾기</Trans> {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

To make the UI interactive, you need to let users change your underlying data model. You will use *state* for this.
<Trans>UI를 상호작용하게 만들려면 사용자가 기반이 되는 데이터 모델을 변경할 수 있도록 해야 합니다. 이를 위해 *state*를 사용합니다.</Trans>

Think of state as the minimal set of changing data that your app needs to remember. The most important principle for structuring state is to keep it [DRY (Don't Repeat Yourself).](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Figure out the absolute minimal representation of the state your application needs and compute everything else on-demand. For example, if you're building a shopping list, you can store the items as an array in state. If you want to also display the number of items in the list, don't store the number of items as another state value--instead, read the length of your array.
<Trans>state를 앱이 기억해야 하는 최소한의 변화하는 데이터 집합으로 생각하세요. state를 구조화할 때 가장 중요한 원칙은 [DRY(직접 반복하지 않기)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)를 유지하는 것입니다. 애플리케이션에 필요한 최소한의 state를 파악하고 그 외의 모든 것을 필요할 때 계산하세요. 예를 들어 쇼핑 목록을 작성하는 경우 항목을 state 배열로 저장할 수 있습니다. 목록에 있는 항목의 개수도 표시하려면 항목의 개수를 다른 state 값으로 저장하는 대신 배열의 길이를 읽으면 됩니다.</Trans>

Now think of all of the pieces of data in this example application:
<Trans>이제 이 예제 애플리케이션의 모든 데이터 조각을 생각해 보세요:</Trans>

1. The original list of products
2. The search text the user has entered
3. The value of the checkbox
4. The filtered list of products
 
<TransBlock>
  1. 제품의 원본 목록
  2. 사용자가 입력한 검색어
  3. 체크박스의 값
  4. 필터링된 제품 목록
</TransBlock>

Which of these are state? Identify the ones that are not:
<Trans>다음 중 어떤 것이 state인가요? 그렇지 않은 것을 식별합니다:</Trans>

* Does it **remain unchanged** over time? If so, it isn't state.
* Is it **passed in from a parent** via props? If so, it isn't state.
* **Can you compute it** based on existing state or props in your component? If so, it *definitely* isn't state!
 
<TransBlock>
- 시간이 지나도 **변하지 않나요**? 그렇다면 state가 아닙니다.
- **부모로부터** props를 통해 **전달**되나요? 그렇다면 state가 아닙니다.
- 컴포넌트의 기존 state 또는 props를 가지고 **계산할 수 있나요**? 그렇다면 *당연히* state가 아닙니다!
</TransBlock>

What's left is probably state.
<Trans>남은 것은 아마도 state일 것입니다.</Trans>

Let's go through them one by one again:
<Trans>다시 한 번 하나씩 살펴봅시다:</Trans>

1. The original list of products is **passed in as props, so it's not state.** 
2. The search text seems to be state since it changes over time and can't be computed from anything.
3. The value of the checkbox seems to be state since it changes over time and can't be computed from anything.
4. The filtered list of products **isn't state because it can be computed** by taking the original list of products and filtering it according to the search text and value of the checkbox.

<TransBlock>
1. 제품 원본 목록은 **props로 전달되었으므로 state가 아닙니다**.
2. 검색어는 시간에 따라 바뀌고 다른 것으로부터 계산할 수 없으므로 state로 볼 수 있습니다.
3. 체크박스의 값은 시간에 따라 바뀌고 다른 것으로부터 계산할 수 없으므로 state로 볼 수 있습니다.
4. 필터링된 제품 목록은 **원본 목록으로부터 검색어 및 체크박스 값을 조합하여 계산할 수 있으므로 state가 아닙니다**.
</TransBlock>

This means only the search text and the value of the checkbox are state! Nicely done!
<Trans>즉, 검색어와 체크박스의 값만 state입니다! 멋지네요!</Trans>

<DeepDive>

#### Props vs State {/*props-vs-state*/}

There are two types of "model" data in React: props and state. The two are very different:
<Trans>React에는 props와 state라는 두 유형의 데이터 "모델"이 있습니다. 둘은 매우 다릅니다:</Trans>

* [**Props** are like arguments you pass](/learn/passing-props-to-a-component) to a function. They let a parent component pass data to a child component and customize its appearance. For example, a `Form` can pass a `color` prop to a `Button`.
* [**State** is like a component’s memory.](/learn/state-a-components-memory) It lets a component keep track of some information and change it in response to interactions. For example, a `Button` might keep track of `isHovered` state.

<TransBlock>
- [Props는 함수가 전달받는 인자](/learn/passing-props-to-a-component)와 같습니다. 부모 컴포넌트가 자식 컴포넌트에 데이터를 넘겨서 자식의 외관을 커스터마이징할 수 있게 해줍니다. 예를 들어 `Form`은 `color` prop을 `Button`에 전달할 수 있습니다.
- [**State**는 컴포넌트의 메모리와 같습니다.](/learn/state-a-components-memory) state는 컴포넌트가 일부 정보를 계속 추적하고 상호작용하여 변화할 수 있게 해줍니다. 예를 들어, `Button`은 `isHovered` state를 추적할 것입니다.
</TransBlock>

Props and state are different, but they work together. A parent component will often keep some information in state (so that it can change it), and *pass it down* to child components as their props. It's okay if the difference still feels fuzzy on the first read. It takes a bit of practice for it to really stick!
<Trans>props와 state는 서로 다르지만 함께 동작합니다. 부모 컴포넌트는 종종 일부 정보를 (변경할 수 있도록) state에 보관하고, 이를 자식 컴포넌트에 props로 *내려보냅니다*. 처음 읽었을 때 그 차이가 모호하게 느껴지더라도 괜찮습니다. 실제로 적용하려면 약간의 연습이 필요할 거에요!</Trans>

</DeepDive>

## Step 4: Identify where your state should live<Trans>state가 어디에 있어야 할지 파악하기</Trans> {/*step-4-identify-where-your-state-should-live*/}

After identifying your app’s minimal state data, you need to identify which component is responsible for changing this state, or *owns* the state. Remember: React uses one-way data flow, passing data down the component hierarchy from parent to child component. It may not be immediately clear which component should own what state. This can be challenging if you’re new to this concept, but you can figure it out by following these steps!
<Trans>앱에서 최소한으로 필요한 state 데이터를 식별한 후에는, 이 state를 변경하는 데 책임이 있는 컴포넌트, 즉 state를 '소유'하는 컴포넌트를 식별해야 합니다. 기억하세요: React는 컴포넌트 계층 구조를 따라 부모 컴포넌트에서 자식 컴포넌트로, 아래로 내려가는 단방향 데이터 흐름을 따릅니다. 당장은 어떤 컴포넌트가 state를 가져야 하는지가 명확하지 않을 수도 있습니다. 이 개념을 처음 접하는 경우 어려울 수 있지만, 다음 과정을 따라가면 이해할 수 있을 거에요!</Trans>

For each piece of state in your application:
<Trans>애플리케이션의 각 state에 대해:</Trans>

1. Identify *every* component that renders something based on that state.
2. Find their closest common parent component--a component above them all in the hierarchy.
3. Decide where the state should live:
  1. Often, you can put the state directly into their common parent.
  2. You can also put the state into some component above their common parent.
  3. If you can't find a component where it makes sense to own the state, create a new component solely for holding the state and add it somewhere in the hierarchy above the common parent component.
 
<TransBlock>
1. 해당 state를 기반으로 렌더링하는 *모든* 컴포넌트를 찾으세요.
2. 가장 가까운 공통 상위 컴포넌트, 즉 계층상 그 state의 영향을 받는 모든 컴포넌트들의 위에 있는 컴포넌트를 찾으세요.
3. state가 어디에 위치할지 결정합시다:
  1. 대개 공통 부모에 state를 그대로 둘 수 있습니다.
  2. 혹은 공통 부모보다 더 상위 컴포넌트에 state를 둘 수도 있습니다.
  3. state를 소유할 적절한 컴포넌트를 찾지 못했다면, state를 소유하는 새 컴포넌트를 만들어 공통 부모 컴포넌트보다 상위에 추가하세요.
</TransBlock>

In the previous step, you found two pieces of state in this application: the search input text, and the value of the checkbox. In this example, they always appear together, so it makes sense to put them into the same place.
<Trans>이전 단계에서는 이 애플리케이션에서 검색어와 체크박스 값이라는 두 state 조각을 발견했습니다. 이 예제에서는 이들이 항상 함께 등장하므로, 이들을 같은 위치에 두는 것이 이치에 맞습니다.</Trans>

Now let's run through our strategy for them:
<Trans>이제 이 state에 대한 전략을 적용해 봅시다:</Trans>

1. **Identify components that use state:**
    * `ProductTable` needs to filter the product list based on that state (search text and checkbox value). 
    * `SearchBar` needs to display that state (search text and checkbox value).
1. **Find their common parent:** The first parent component both components share is `FilterableProductTable`.
2. **Decide where the state lives**: We'll keep the filter text and checked state values in `FilterableProductTable`.

<TransBlock>
1. **state를 사용하는 컴포넌트들 식별하기:**
  - `ProductTable`은 해당 state(검색어 및 체크박스 값)를 기반으로 제품 목록을 필터링해야 합니다.
  - `SearchBar`는 해당 state(검색어 및 체크박스 값)를 표시해야 합니다.
2. **공통 부모 찾기:** 두 컴포넌트가 공유하는 첫 번째 부모 컴포넌트는 `FilterableProductTable`입니다.
3. **state를 어디에 둘지 결정하기:** `FilterableProductTable`에 filter text와 checked state 값을 유지합니다.
</TransBlock>

So the state values will live in `FilterableProductTable`. 
<Trans>이제 state 값은 `FilterableProductTable`에 있습니다.</Trans>

Add state to the component with the [`useState()` Hook.](/reference/react/useState) Hooks are special functions that let you "hook into" React. Add two state variables at the top of `FilterableProductTable` and specify their initial state:
<Trans>[`useState()` 훅으로 컴포넌트에 state를 추가합니다.](/reference/react/useState) 훅은 React에 "끼어들게(hook into)" 해주는 특수한 함수입니다. `FilterableProductTable`의 윗부분에 두 개의 state 변수를 추가하고 애플리케이션의 초기 state를 지정하세요:</Trans>

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as props:
<Trans>그런 다음 `filterText`와 `inStockOnly`를 `ProductTable`과 `SearchBar`에 props로 전달하세요:</Trans>

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

You can start seeing how your application will behave. Edit the `filterText` initial value from `useState('')` to `useState('fruit')` in the sandbox code below. You'll see both the search input text and the table update:
<Trans>이제 애플리케이션이 어떻게 동작하는지 확인할 수 있습니다. 아래 샌드박스 코드에서 `filterText` 초기 값을 `useState('')`에서 `useState('fruit')`로 수정해 보세요. 검색어(fruit)와 데이터 테이블이 모두 업데이트될 것입니다:</Trans>

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Notice that editing the form doesn't work yet. There is a console error in the sandbox above explaining why:
<Trans>Form 편집은 아직 작동하지 않습니다. 위의 샌드박스에서 콘솔 오류가 발생하는 이유를 설명하고 있습니다:</Trans>

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.<br/>
// `onChange` 핸들러가 없는 form 필드에 `value` prop을 제공했습니다. 이렇게 하면 읽기 전용 필드가 렌더링됩니다.
</ConsoleBlock>

In the sandbox above, `ProductTable` and `SearchBar` read the `filterText` and `inStockOnly` props to render the table, the input, and the checkbox. For example, here is how `SearchBar` populates the input value:
<Trans>위의 샌드박스에서 `ProductTable`과 `SearchBar`는 `filterText`와 `inStockOnly` prop을 읽어 테이블, 인풋 및 체크박스를 렌더링합니다. 예를 들어 다음은 `SearchBar`가 입력 값을 채우는 방식입니다:</Trans>

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

However, you haven't added any code to respond to the user actions like typing yet. This will be your final step.
<Trans>하지만 아직 타이핑과 같은 사용자 액션에 응답하는 코드를 추가하지 않았습니다. 이것이 마지막 단계가 될 것입니다.</Trans>

## Step 5: Add inverse data flow<Trans>역방향 데이터 흐름 추가하기</Trans> {/*step-5-add-inverse-data-flow*/}

Currently your app renders correctly with props and state flowing down the hierarchy. But to change the state according to user input, you will need to support data flowing the other way: the form components deep in the hierarchy need to update the state in `FilterableProductTable`. 
<Trans>현재 앱은 props와 state가 계층 구조 아래로 흐르면서 올바르게 렌더링됩니다. 하지만 사용자 입력에 따라 state를 변경하려면 계층 구조상 깊은 곳에 있는 폼 컴포넌트가 높은 곳에 있는 `FilterableProductTable`의 state를 업데이트해야 하므로, 역방향으로도 데이터가 흐를 수 있게 해야 합니다.</Trans>

React makes this data flow explicit, but it requires a little more typing than two-way data binding. If you try to type or check the box in the example above, you'll see that React ignores your input. This is intentional. By writing `<input value={filterText} />`, you've set the `value` prop of the `input` to always be equal to the `filterText` state passed in from `FilterableProductTable`. Since `filterText` state is never set, the input never changes.
<Trans>React의 데이터 흐름은 명쾌하지만, 양방향 데이터 바인딩보다는 약간 더 많은 타이핑이 필요합니다. 위의 예시에서 검색어를 입력하거나 체크박스를 선택하면 React가 이를 무시하는 것을 확인할 수 있습니다. 이것은 의도된 동작입니다. `<input value={filterText} />`를 작성함으로써 `input`의 `value` 프로퍼티가 항상 `FilterableProductTable`에서 전달된 `filterText` state와 같도록 했기 때문입니다. `filterText` state가 절대 변경되지 않으므로 검색어 역시 변하지 않는 것이죠.</Trans>

You want to make it so whenever the user changes the form inputs, the state updates to reflect those changes. The state is owned by `FilterableProductTable`, so only it can call `setFilterText` and `setInStockOnly`. To let `SearchBar` update the `FilterableProductTable`'s state, you need to pass these functions down to `SearchBar`:
<Trans>우리는 사용자가 form 입력을 변경할 때마다 변경 사항을 반영하도록 state도 업데이트하기를 바랍니다. 이 state는 `FilterableProductTable`이 가지고 있으므로 이 컴포넌트만이 `setFilterText` 및 `setInStockOnly`를 호출할 수 있습니다. 하위에 있는 `SearchBar`가 상위에 있는 `FilterableProductTable`의 state를 대신 업데이트할 수 있도록 하려면, 이 함수들을 `SearchBar`에 전달해야 합니다:</Trans>

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

Inside the `SearchBar`, you will add the `onChange` event handlers and set the parent state from them:
<Trans>`SearchBar` 안에 `onChange` 이벤트 핸들러를 추가하고 이 핸들러에서 부모 state를 변경하도록 합시다:</Trans>

```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="Search..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

Now the application fully works!
<Trans>이제 애플리케이션이 완전히 작동합니다!</Trans>

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

You can learn all about handling events and updating state in the [Adding Interactivity](/learn/adding-interactivity) section.
<Trans>이벤트 처리 및 state 업데이트에 대한 보다 자세한 내용은 [상호작용 추가하기](/learn/adding-interactivity) 섹션에서 확인할 수 있습니다.</Trans>

## Where to go from here<Trans>이제 어디로 갈까요?</Trans> {/*where-to-go-from-here*/}

This was a very brief introduction to how to think about building components and applications with React. You can [start a React project](/learn/installation) right now or [dive deeper on all the syntax](/learn/describing-the-ui) used in this tutorial.
<Trans>지금까지 React로 컴포넌트와 애플리케이션을 구축하는 방법에 대해 아주 간략하게 소개했습니다. 지금 바로 [React 프로젝트를 시작](/learn/installation)해도 좋고, 이 자습서에서 사용된 [모든 구문을 더 자세히 살펴볼](/learn/describing-the-ui) 수도 있습니다.</Trans>
