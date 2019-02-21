---
title: "¡React en español! And Other Languages"
author: [tesseralis]
---

We’re excited to announce an ongoing effort to maintain official translations of the React documentation website into different languages. Thanks to the dedicated efforts of React community members from around the world, React is now being translated into *over 30* languages! You can check out our ongoing efforts in the new [Languages](/languages) page!

In addition, the following three languages have completed translating the core pages of the React Docs! 🎉

* Spanish: [es.reactjs.org](https://es.reactjs.org)
* Japanese: [ja.reactjs.org](https://ja.reactjs.org)
* Brazilian Portuguese [pt-br.reactjs.org](https://pt-br.reactjs.org)

## Why Localization Matters

React is one of the most powerful JavaScript libraries and has [meetups](https://reactjs.org/community/meetups.html) and [conferences](https://reactjs.org/community/conferences.html) all around the world. Not all of the places where React is used has English as a primary language. We'd love to support local communities who use React, and maintaining official translations is one way to do that!

In addition, if there is enough demand in a language community, people *will* create translations for it, as people have done in [Chinese](https://github.com/discountry/react), [Arabic](https://wiki.hsoub.com/React), and [Korean](https://github.com/reactjs/ko.reactjs.org/issues/4). While useful, these resources are also hard to find. With an official translation, people can find the translated docs from the React website itself and translators have access to the React team to clarify any questions.

## Contributing

If you would like to help out on a current translation, check out the [Languages](/languages) page and click on the "Contribute" link for your language.

Can't find your language? If you'd like to maintain your langauge's translation fork, follow the instructions in the [translation repo](https://github.com/reactjs/reactjs.org-translation#starting-a-new-translation)!

## Backstory

Hi everyone! I'm Nat! You may know me as the [polyhedra lady](https://www.youtube.com/watch?v=Ew-UzGC8RqQ). For the past few weeks, I've been helping the React team coordinate their translation effort. Here's how I did it.

Our original approach for translations was to use a SaaS platform that allows users to submit translations. There was already a [pull request](https://github.com/reactjs/reactjs.org/pull/873) to integrate it and my original responsibility was to finish that integration. However, we had concerns about the feasibility of that integration and the current quality of translations on the platform. Our primary concern was ensuring that translations kept up to date with the main repo and didn't become "stale".

Dan encouraged me to look for alternate solutions, and we stumbled across how [Vue](https://vuejs.org) maintained its translations -- through different forks of the main repo on GitHub. In particular, the [Japanese translation](jp.vuejs.org) used a bot to periodically check for changes in the English repo and submits pull requests whenever there is a change.

This approach appealed to us for several reasons:

* It was less code integration to get off the ground.
* It encouraged active maintainers for each repo to ensure quality.
* Contributors already understand GitHub as a platform and are motivated to contribute directly to the React organization.

We started of with an initial trial period of three languages: Spanish, Japanese, and Simplified Chinese. This allowed us to work out any kinks in our process and make sure future translations are set up for success. I wanted to give the translation teams freedom to choose whatever tools they felt comfortable with. The only requirement is a [checklist](https://github.com/reactjs/reactjs.org-translation/blob/master/PROGRESS.template.md) that outlines the order of importance for translating pages. 

After the trial period, we were ready to accept more languages. I created [a script](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/create.js) to automate the creation of the new language repo, and a site, [Is React Translated Yet?](https://isreacttranslatedyet.com), to track progress on the different translations. We started *10* new translations on our first day alone!

Because of the automation, the rest of the maintance went mostly smoothly. We eventually created a [Slack channel](https://rt-slack-invite.herokuapp.com) to make it easier for translators to share information, and I released a guide solidifying the [responsibilities of maintainers](https://github.com/reactjs/reactjs.org-translation/blob/master/maintainer-guide.md). Allowing translators to talk with each other was a great boon -- for example, the Arabic, Persian, and Hebrew translations were able to talk to each other in order to get [right-to-left text](https://en.wikipedia.org/wiki/Right-to-left) working!

## The Bot

The most challenging part was getting the bot to sync changes from the English version of the site. Initially we were using the [che-tsumi](https://github.com/vuejs-jp/che-tsumi) bot created by the Japanese Vue translation team, but we soon decided to build our own bot to suit our needs. In particular, the che-tsumi bot works by [cherry picking](https://git-scm.com/docs/git-cherry-pick) new commits. This ended up causing a cavalade of new issues that were interconnected, especially when [Hooks were released](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html).

In the end, we decided that instead of cherry picking each commit, it made more sense to merge all new commits and create a pull request around once a day. Conflicts are merged as-is and listed in the [pull request](https://github.com/reactjs/pt-BR.reactjs.org/pull/114), leaving a checklist for maintainers to fix.

Creating the [sync script](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/sync.js) was easy enough: it downloads the translated repo, adds the original as a remote, pulls from it, merges the conflicts, and creates a pull request.

The problem was finding a place for the bot to run. I'm a frontend developer for a reason -- Heroku and its ilk are alien to me and *endlessly* frustrating. In fact, until this past Tuesday, I was running the script by hand on my local machine!

The biggest challenge was space. Each fork of the repo is around 100MB -- which takes minutes to clone on my local machine. We have *32* forks, and the free tiers or most deployment platforms I checked limited you to 512MB of storage. 

After lots of notepad calculations, I found a solution: delete each repo once we've finished the script and limit the concurrency of `sync` scripts that run at once to be within the storage requirements. Luckily, Heroku dynos have a much faster Internet connection and are able to clone even the React repo quickly.

There were other smaller issues that I ran into. I tried using the [Heroku Scheduler](https://elements.heroku.com/addons/scheduler) add-on so I didn't have to write any actual `watch` code, but it end up running too inconsistently, and I [had an existential meltdown on Twitter](https://twitter.com/tesseralis/status/1097387938088796160) when I couldn't figure out how to send commits from the Heroku dyno. But in the end, this frontend engineer was able to get the bot working!

There are, as always, improvements I want to make to the bot. Right now it doesn't check whether there is an outstanding pull request before pushing another one. It's still hard to tell the exact change that happened in the original source, and it's possible to miss out on a needed translation change. But I trust the maintainers we've chosen to work through these issues, and the bot is [open-source](https://github.com/reactjs/reactjs.org-translation) if anyone wants to help me make these improvements!

## Thanks

Finally, I would like to extend my gratitude to the following people and groups:

 * The [Vue.js Japan User Group](https://github.com/vuejs-jp) for initiating the idea of having bot-managed translations, and especially [Hanatani Takuma](https://github.com/potato4d) for helping us understand their approach and helping maintian the Japanese translation.
 * [Soichiro Miki](https://github.com/smikitki) for many [contributions](https://github.com/reactjs/reactjs.org/pull/1636) and thoughtful comments on the overall translation process, as well as for maintaining the Japanese translation.
 * All the translation maintainers and contributors who are helping translate React to more than thirty languages.
 * The Spanish translation maintainers: [Alejandro Ñáñez Ortiz](https://github.com/alejandronanez), [Rainer Martínez Fraga](https://github.com/carburo), [David Morales](https://github.com/dmorales), and [Miguel Alejandro Bolivar Portilla](https://github.com/Darking360), and contributors for pushing the Spanish translation through the finish line!
 * [Eric Nakagawa](https://github.com/ericnakagawa) for managing our previous translation process.
 * [Brian Vaughn](https://github.com/bvaughn) for setting up the [languages page](/languages) and managing all the subdomains.

 And finally, thank you to [Dan Abramov](https://github.com/gaearon) for giving me this opportunity and being a great mentor along the way.