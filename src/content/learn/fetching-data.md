---
title: Fetching Data
---

<Intro>

The data rendered in your React app may come from a variety of sources and in many cases, your components may need to "wait" for the data to be fetched before they can render.

In this chapter, we will go over common data sources and how to fetch and use that data in your React components.

</Intro>

<YouWillLearn>

* Static and dynamic data and how it affects data access
* How to fetch data in your components and examples of common data sources
* How components "wait" for data to be fetched

</YouWillLearn>

## Static and Dynamic Data {/*static-and-dynamic-data*/}

In our previous React examples, we've used local variables to hold data that our components use.

```js
const ESTABLISHED_YEAR = 1986;

function CompanyFooter() {
  return <p>Quality since {ESTABLISHED_YEAR}</p>;
}
```
In this component, the data is the year we store in the local variable `ESTABLISHED_YEAR`.

Our app may also use ESTABLISHED_YEAR in other places so we can decouple the data from our UI and provide the data in a separate module.

```js
import ESTABLISHED_YEAR from "./data";

function CompanyFooter() {
  return <p>Quality since {ESTABLISHED_YEAR}</p>;
}
```

In both of these examples, the data is set and read once for `CompanyFooter`. The examples read the data outside of the component function so every-time the component is rendered, it refers to the same data.

This works because the nature of the data in this example is unchanging. An establishment year for a company is a historical record that will not be updated in the future. We refer to this type of data as **static**.

On the other hand, there may be data that is ever-changing or unique to a user or location. Consider a Weather app that renders the temperature of a local city, the temperature data powering that app will frequently update. We refer to this type of data as **dynamic** data.

Generally, the labels "static" and "dynamic" refer to guarantees we can make about the data and who can access it. Static data usually means the data does not change often (yearly, monthly) or that its update schedule is predictable or controlled. As well, it can mean that the data is the same no matter who is asking for it.

Dynamic data may be updated by the minute or by users, which is unpredictable. It may also be unique to a certain user or locale-specific.

<Illustration>
Illustration of static, dynamic data. Statically, we can use an example of a train timetable schedule.
</Illustration>

The reason why we distinguish static and dynamic data is it affects how often we need to fetch the data. For dynamic data, we want to display current, "fresh", data to our users. To do this, we'll need to re-fetch the data periodically in case of updates. One way to do this is to fetch data in a component function.

## Fetching data in a component {/*fetching-data-in-a-component*/}

Consider a temperature component in a weather app. In this example, we assume there is a local file that is continually updated with the current temperature in the city of Los Angeles.

```js
import { readFile } from "node:fs/promises";

async function LATemperature() {
  const temp = await readFile("/path/to/temperature");
  return <p>The current temperature in Los Angeles is: {temp}</p>;
}
```

During render, we read the temperature and render it in the component. We use the function `readFile` from the `fs` package to read the local file. Don't worry about the `await`, `async` keywords for now, we'll dive deeper into that in the next section. The important thing is that we are reading a data source during the render function. Every time the component renders, the data is read again.

An important thing to note is that the component doesn't know when the data has changed. The component must be told to re-render, and only then will it read "fresh" data.

#### Fetching data from a database {/*fetching-data-from-a-database*/}

Beyond reading from a file, another common data source is a [database](https://en.wikipedia.org/wiki/Database). You can imagine a database like a collection of spreadsheets, with each individual spreadsheet being referred to as a "table". Just like a spreadsheet, a table contains column names and every entry in the table is a row of data.

Imagine we have a table named 'weather' in a database, with the columns:
 * `temp` - the temperature recorded
 * `city` - the city the temperature was recorded
 * `date` - the date of the recorded temperature

Here, we query our imaginary weather table in our component.

```js
import { Client } from "pg";
import connectionConfig from "./config";

const client = new Client(connectionConfig);
await client.connect();

async function LATemperature() {
  const temp = await client.query(
    `SELECT temp, date FROM weather WHERE city = 'Los Angeles' ORDER BY date DESC`,
  );
  return (
    <p>
      The current temperature in LA is: {temp}. Last updated {date}.
    </p>
  );
}
```
First, we establish our database connection and then we send our query to the database to get the temperature.

Databases are often queried through a database server. Database servers may be running locally on your machine, or may be accessible through a network. `connectionConfig` will contain the address of where the database server is running.

<Note>
Our example uses an external library, [node-postgres](https://node-postgres.com/) to access a fictional Postgres database. There are many other types of databases and JavaScript libraries to interface with them. The details don't matter in this case and the main point is to illustrate that data is often stored on remote database servers and roughly what that access looks like in a React component.
</Note>

#### Fetching data from an API {/*fetching-data-from-an-api*/}

Similar to database servers, there may be other services you can fetch data from. A common example is using a third-party service to access data you don't own or maintain. These third-party services will provide an API, an interface for you to structure your data request.

Here is an example of a weather service that offers an API to get the latest temperature data for Los Angeles. To get the temperature, the API requires us provide the longitude and latitude of the location we're interested in. 

```js
async function LATemperature() {
  const { temperature } = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`,
  );
  return <p>The current temperature in Los Angeles is: {temp}.</p>;
}
```

An API service will usually provide documentation on how to make a request to their server and how the data is returned to you.

## Waiting for asynchronous data during render {/*waiting-for-data-during-render*/}

You'll notice that once we started to read data during render, we began to use the keywords `async` and `await` in our component. Let's dive deeper into what that means.

```js
import { readFile } from "node:fs/promises";

async function LATemperature() {
  const tempPromise = readFile("/path/to/temperature");
  const temp = await tempPromise;
  return <p>The current temperature in LA is: {temp}</p>;
}
```

In our local file example, we imported the function `readFile` from a file streaming package. `readFile` is an asynchronous function that takes in a file path and returns the file contents. An asynchronous function means that JavaScript does not pause execution to wait for the function to finish. Instead, it returns a Promise, a container for its future return value.

An analogy to calling an asynchronous function is like taking your clothes to the dry cleaners. You've given the work to clean your clothes to someone else, leaving you free to do other things. The dry cleaners give you a ticket, a promise, that they will complete this work and notify you when they're done. When the work is done successfully, the Promise is considered resolved.

<Illustration>
Illustration of the parallel work while getting dry cleaning
</Illustration>

Now, imagine you are trying to render the component `LATemperature`. The first thing you do is kick off the asynchronous work of reading the temperature file and you've received `tempPromise` as a Promise. Now, you're free to do the next set of work. But wait, the next instruction requires you to know the temperature, yet all we have is a Promise. The Promise may or may not be ready with the actual temperature value.

Here is where `await` comes in. `await` is a keyword that is used before a Promise and tells JavaScript to pause running the current function and wait for the Promise to resolve.Then, when it is resolved, await will unwrap the Promise container to return the value. We use await on tempPromise to pause our component rendering until the file is read and receive the value returned.

In our analogy, this would be similar to waiting at the dry cleaners for them to finish because the next chore on your todo list requires those clothes. Thus, preventing you from doing anything else in the meantime.

Our other examples of fetching data from a database server or making a network request to an API endpoint are also asynchronous operations that return Promises.


<DeepDive>

####  When to use await {/*when-to-use-await*/}

Generally, you'll want to kick off asynchronous work as early as possible so that you can maximize the amount of work you can do before needing to `await` the Promise returned.

Due to the simple nature of our component, our example needed to immediately await the asynchronous operation because the component render was blocked on that data.

Here is an example where we are able to kick off the asynchronous work and then do some synchronous work in the meantime, and then finally await the data just before it is used.

```js
async function HoveringButton({ userContext, label, lastTouchPoint }) {
  // async operation
  const localePromise = getLocale(userContext);

  // expensive calculation
  const offset = calculateNewOffset(lastTouchPoint);

  return ...
}
```

</DeepDive>

You'll notice that our component function declarations now have an `async` prefix. This is also a JavaScript keyword and any function that uses `await` will need to be marked with `async`. If a function `await`s a Promise, it itself becomes asynchronous.

Imagine being the parent function calling the `LATemperature` component function. When you call `LATemperature` and it gets to the instruction of `await`-ing `readFilePromise`, JavaScript execution returns to you and you receive a Promise that promises to give you the completed render of `LATemperature`.

<DeepDive>

#### Why is dynamic data-fetching asynchronous vs. static data reads? {/*why-is-dynamic-data-fetching-asynchronous-vs-static-data-reads*/}

TODO: go into build-time and run-time data access

</DeepDive>

## Recap {/*recap*/}

* Data is the content we display in our React apps.
* Static data refers to data that changes infrequently or within your control.
* Dynamic data refers to data that changes frequently or unpredictably.
* For dynamic data, you'll likely want to read your data in your component function so that it reads "fresh" data for every render.
* Accessing during component render, is often an asynchronous operation.
* Asynchronous functions perform work asynchronously to its calling function. They return Promises, a container for its future return value.
* You can tell your React components to wait for an asynchronous operation by await-ing the Promise returned.
