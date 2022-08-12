---
title: 'Extracting Events out of Effects'
---

<Intro>

When your Effect reads a prop or another reactive value, you have to specify it as a dependency. This ensures that when a re-render causes that value to change, your Effect will re-synchronize using the fresh value. Usually, this is what you want: an Effect that connnects to the selected chat server should re-connect when the selected server changes. However, there are cases where you only want to read a value, but not "react" to its changes. You can't do this inside an Effect, but you can extract an *Event function,* read the value there, and call it from your Effect.

</Intro>

<YouWillLearn>

- Why code inside Effects is reactive
- How to read the latest props and state from Effects using Event functions
- How Event functions are related to Effects and event handlers
- When not to use Event functions

</YouWillLearn>

## Effects are reactive {/*effects-are-reactive*/}




