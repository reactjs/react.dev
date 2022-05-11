---
title: Tilan hallinta
---

<Intro>

Sovelluksesi kasvaessa, kannattaa olla tietoinen miten tilasi on järjestetty sekä miten tieto kulkee komponenttien välilä. Turha tai toistettu tila on yleinen bugien lähde. Tässä luvussa opit miten tila järjestetään hyvin, miten tilapäivityksen logiikka pidetään ylläpidettävänä, sekä miten tila jaetaan kaukaisten komponettien välillä.

</Intro>

<YouWillLearn isChapter={true}>

- [Miten ajatella käyttöliittymän muutoksia tilan muuttuessa](/learn/reacting-to-input-with-state)
- [Miten tila järjestetään hyvin](/learn/choosing-the-state-structure)
- [Miten "tila nostetaan ylös" jotta se voidaan jakaa komponenttien välillä](/learn/sharing-state-between-components)
- [Miten hallita, säilyykö tila vai nollataanko se](/learn/preserving-and-resetting-state)
- [Miten siirretään monimutkainen tilalogiikka funktioon](/learn/extracting-state-logic-into-a-reducer)
- [Miten annetaan tietoa ilman "proppien porausta"](/learn/passing-data-deeply-with-context)
- [Miten skaalata tilaa sovelluksen kasvaessa](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## Tilan reagointi syötteeseen {/*reacting-to-input-with-state*/}

Reactissa et muokkaa käyttöliittymäkoodia suoraan. Esimerkiksi, et kirjoita komentoja kuten "poista painike käytöstä", "ota painike käyttöön", "näytä onnistumisviesti", jne. Sen sijaan kerrot käyttöliittymän, jonka haluat nähdä erilaisissa komponentin tiloissa ("alkutila", "kirjoitetaan -tila", "onnistumistila"), ja sitten vaihdat tilaa käyttäjän syötteen pohjalta. Tämä vastaa samaa kuin miten suunnittelijat ajattelevat käyttöliittymiä.

Tässä on Reactilla rakennettu tietokilpailulomake. Huomaa miten siinä käytetään `status` tilamuuttujaa päättämään mikäli lähetä -painike on käytössä vai ei, ja mikäli onnistumisviesti näytetään.

<Sandpack>

```js
import {useState} from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={answer.length === 0 || status === 'submitting'}>
          Submit
        </button>
        {error !== null && <p className="Error">{error.message}</p>}
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima';
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error {
  color: red;
}
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

Lue **[Reacting to Input with State](/learn/reacting-to-input-with-state)** oppiaksesi lähestymään vuorovaikutusta tilalähtöisellä ajattelutavalla.

</LearnMore>

## Tilarakenteen päättäminen {/*choosing-the-state-structure*/}

Hyvän tilarakenteen päättäminen voi tehdä suuren eron komponenttien välillä, jota on miellyttävä muokata ja korjata, ja sellaisen joka on jatkuva virheiden lähde. Tärkein periaate on se, että tilan ei kuuluisi sisältää tarpeetonta tai toistettua tietoa. Mikäli tilassa on tarpeetonta tietoa, on sen päivitys helppo unohtaa ja esitellä bugeja!

Esimerkiksi tässä lomakkeessa on **tarpeeton** `fullName` tilamuuttuja:

<Sandpack>

```js
import {useState} from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Voit poistaa sen ja yksinkertaistaa koodia laskemalla `fullName` muuttujan komponentin renderöinnin aikana:

<Sandpack>

```js
import {useState} from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Tämä saattaa vaikuttaa pieneltä muutokselta, mutta moni bugi Reactissa on korjattu tällä tavoin.

<LearnMore path="/learn/choosing-the-state-structure">

Lue **[Tilarakenteen päättäminen](/learn/choosing-the-state-structure)** oppiaksesi miten tilan rakenne suunnitellaan bugien välttämiseksi.

</LearnMore>

## Tilan jakaminen komponenttien välillä {/*sharing-state-between-components*/}

Joskus haluat, että kahden komponentin tila muuttuu yhdessä. Tämän tehdäksesi, poista tila molemmista komponenteista ja siirrä se lähmimpään pääkomponenttiin, ja välitä tila alas proppeja käyttäen. Tätä kutsutaan "tilan nostamiseksi ylös", ja se on yksiä yleisimmistä asioista joita tulet tekemään React koodia kirjoittaessasi.

Tässä esimerkissä vain yhden paneelin pitäisi olla aktiivinen kerrallaan. Tämän saavuttamiseksi sen sijaan, että aktiivinen tila säilyisi jokaisen yksittäisen paneelin sisällä, pääkomponentti pitää tilan ja välittää lapsikomponenteilleen tarvittavat propsit.

<Sandpack>

```js
import {useState} from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}>
        With a population of about 2 million, Almaty is Kazakhstan's largest
        city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for
        "apple" and is often translated as "full of apples". In fact, the region
        surrounding Almaty is thought to be the ancestral home of the apple, and
        the wild <i lang="la">Malus sieversii</i> is considered a likely
        candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({title, children, isActive, onShow}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
    </section>
  );
}
```

```css
h3,
p {
  margin: 5px 0px;
}
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

Lue **[Tilan jakaminen komponenttien välillä](/learn/sharing-state-between-components)** oppiaksesi miten tila nostetaan ylös ja komponentit pidetään synkronoituna.

</LearnMore>

## Tilan säilyttäminen ja nollaus {/*preserving-and-resetting-state*/}

Kun uudelleenrenderöit komponenttia, Reactin täytyy päättää mitkä osat puusta pitää (ja päivittää), ja mitkä osat häivittää tai luoda uudelleen alusta alkaen. Useimmissa tapauksissa Reactin automaattinen käyttäytyminen toimii tarpeeksi hyvin. Oletuksena React ylläpitää osat puusta, jotka "vastaavat" aiemmin renderöityä komponettipuuta.

Kuitenkin joskus tämä ei ole sitä mitä haluat. Esimerkiksi, tässä sovelluksessa viestin kirjoittaminen ja käyttäjän vaihtaminen ei tyhjää syötettä. Tämä voi saada käyttäjän vahingossa lähettämään viestin väärälle henkilölle:

<Sandpack>

```js App.js
import {useState} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  );
}

const contacts = [
  {name: 'Taylor', email: 'taylor@mail.com'},
  {name: 'Alice', email: 'alice@mail.com'},
  {name: 'Bob', email: 'bob@mail.com'},
];
```

```js ContactList.js
export default function ContactList({selectedContact, contacts, onSelect}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact}>
            <button
              onClick={() => {
                onSelect(contact);
              }}>
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact}) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Reactilla voit ylikirjoittaa oletustoiminnon, ja _pakottaa_ komponentin tyhjäämään sen tila antamalla sille eri `key` proppi, kuten `<Chat key={email} />`. Tämä kertoo Reactille, että mikäli vastaanottaja on eri, pitäisi `Chat` komponentin olla _eri_ komponentti, joka täytyy luoda uudelleen alusta alkaen uusilla tiedoilla (kuten käyttöliittymän syöttökentät). Nyt vastaanottajien vaihtaminen nollaa syöttökentän--vaikka renderöit saman komponentin.

<Sandpack>

```js App.js
import {useState} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  );
}

const contacts = [
  {name: 'Taylor', email: 'taylor@mail.com'},
  {name: 'Alice', email: 'alice@mail.com'},
  {name: 'Bob', email: 'bob@mail.com'},
];
```

```js ContactList.js
export default function ContactList({selectedContact, contacts, onSelect}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact}>
            <button
              onClick={() => {
                onSelect(contact);
              }}>
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact}) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<LearnMore path="/learn/preserving-and-resetting-state">

Lue **[Tilan säilyttäminen ja nollaus](/learn/preserving-and-resetting-state)** oppiaksesi tilan elämänkaari ja miten sitä hallitaan.

</LearnMore>

## Tilalogiikan siirtäminen reduceriin {/*extracting-state-logic-into-a-reducer*/}

Komponentit, joissa on useita tilapäivityksiä, jotka on hajallaan useisiin tapahtumakäsittelijöihin, voivat olla hankalia ymmärtää. Näihin tapauksiin voit tiivistää kaikki tilamuutoksen logiikan komponentin ulkopuolelle yhteen funktioon, jota kutsutaan "reduceriksi". Tapahtumakäsittelijöistäsi tulee tiivitä, koska ne määrittelevät ainoastaan käyttäjän "toiminnot". Tiedoston lopussa reducer funktio määrittelee miten tila kuuluisi päivittää kuhunkin tapahtumaan nähden!

<Sandpack>

```js App.js
import {useReducer} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Lue **[Tilalogiikan siirtäminen reduceriin](/learn/extracting-state-logic-into-a-reducer)** oppiaksesi miten logiikkaa tiivistetään reducer funktioon.

</LearnMore>

## Tiedon välittäminen syvälle kontekstilla {/*passing-data-deeply-with-context*/}

Usein täytyy antaa tietoa pääkomponentista lapsikomponettiin proppien avulla. Mutta proppien välittämisestä saattaa tulla epämukavaa jos proppeja täytyy antaa useiden komponenttien läpi, tai jos moni komponentti tarvitsee samaa tietoa. Kontekstin avulla pääkomponenti voi asettaa tietyn tiedon saataville kaikkiin komponentteihin pääkomponentin sisällä-riippumatta siitä miten syvällä se on-ilman, että sitä annetaan proppien kautta.

Tässä `Heading` komponentti päättelee sen otsikointitason "kysymällä" sen lähimmältä `Section` komponentilta sen tason. Jokainen `Section` seuraa sen omaa tasoa kysymällä sitä `Section` pääkomponentilta ja lisäämällä siihen yhden. Jokainen `Section` tarjoaa tiedon saataville kaikille sen alakomponenteille ilman, että proppeja täytyy antaa--se tekee sen käyttämällä kontekstia.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import {useContext} from 'react';
import {LevelContext} from './LevelContext.js';

export default function Section({children}) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import {useContext} from 'react';
import {LevelContext} from './LevelContext.js';

export default function Heading({children}) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import {createContext} from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/passing-data-deeply-with-context">

Lue **[Tiedon välittäminen syvälle kontekstilla](/learn/passing-data-deeply-with-context)** oppiaksesi miten käytetään kontekstia proppien välittämisen sijaan.

</LearnMore>

## Skaalaus reducerilla ja kontekstilla {/*scaling-up-with-reducer-and-context*/}

Reducerien avulla voit yhdistää komponentin tilanpäivityslogiikan. Kontekstin avulla voit antaa tietoa syvälle muihin komponentteihin. Voit yhdistää reducereita ja konteksteja yhteen hallitaksesi monimutkaisen ruudun tilaa.

Tällä lähestymistavalla monimutkaisen tilan omaava pääkomponentti hallitsee sitä reducerilla. Muut komponentit syvällä komponenttipuussa voivat lukea tilaa kontekstilla. Ne voivat myös dispatchata eli lähettää toimintoja päivittääkseen tilaa.

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import {TasksProvider} from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js TasksContext.js
import {createContext, useContext, useReducer} from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({children}) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  {id: 0, text: 'Philosopher’s Path', done: true},
  {id: 1, text: 'Visit the temple', done: false},
  {id: 2, text: 'Drink matcha', done: false},
];
```

```js AddTask.js
import {useState, useContext} from 'react';
import {useTasksDispatch} from './TasksContext.js';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          dispatch({
            type: 'added',
            id: nextId++,
            text: text,
          });
        }}>
        Add
      </button>
    </>
  );
}

let nextId = 3;
```

```js TaskList.js
import {useState, useContext} from 'react';
import {useTasks, useTasksDispatch} from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({task}) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value,
              },
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked,
            },
          });
        }}
      />
      {taskContent}
      <button
        onClick={() => {
          dispatch({
            type: 'deleted',
            id: task.id,
          });
        }}>
        Delete
      </button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

Lue **[Skaalaus reducerilla ja kontekstilla](/learn/scaling-up-with-reducer-and-context)** oppiaksesi miten tilan hallinta skaalautuu kasvavassa sovelluksessa.

</LearnMore>

## Mitä seuraavaksi {/*whats-next*/}

Siirry seuraavaksi sivulle [Tilan reagointi syötteeseen](/learn/reacting-to-input-with-state) lukeaksesi tämän luvun sivu kerrallaan!

Tai, jos aiheet ovat tuttuja, mikset lukisi [Escape Hatches](/learn/escape-hatches)?
