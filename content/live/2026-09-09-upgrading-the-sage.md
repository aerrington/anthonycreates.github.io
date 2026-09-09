---
title: Upgrading the Sage
date: 2026-09-09
kind: made
projects: [always-never]
draft: true
---

[Always Never](https://alwaysnever.uk/) is my tiny game about inventing proverbs a word at a time. It's inspired by word-at-a-time improv games such as 3-Headed Expert. It's still evolving, but it's live [here](https://alwaysnever.uk/).

I created it in a week or so in July for OpenAI Build Week. I had to freeze my work on it after that for a while until the competition results were announced (no surprises, I didn't win!).

In recent weeks, I've been working on some improvements.

First, I wanted to give it a visual makeover. I liked the SVG Sage which got created as part of my initial prototype, but I wanted more sophisticated animation.

I got GPT Image to render a series of images of the Sage in different poses to reflect his mood (pleased, frustrated, excited, etc.). I then fed these into Claude Design to work out how to integrate them into the site.

Secondly, I really wanted to work on the quality of the Sage's word selection and choices. This is where the game really lives or dies — it has to be fun, and preferably a little wacky. The proverbs that get created need to make sense grammatically, but also have a certain playful, whimsical humour to them. That means improving the selection of words that the Sage offers each round, choosing a good follow-up from the Sage, and better identifying when the proverb might be complete.

This has taken me into interesting terrain. Here's a summary of some things the algorithm is now doing, explained by the model in simple terms ("ELI5, without resorting to inventive metaphors").

<!-- Add the model's summary and supporting material here. -->

I find it exciting, and a little odd, to be able to develop things like this without needing to master the underlying algorithms and research that they depend on.
