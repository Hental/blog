# react-fiber-architecture

[react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture/)

## key(why)

lazy, priorities, smart(pull)

- In a UI, it's not necessary for every update to be applied immediately; in fact, doing so can be wasteful, causing frames to drop and degrading the user experience.

- Different types of updates have different priorities — an animation update needs to complete more quickly than, say, an update from a data store.

- A push-based approach requires the app (you, the programmer) to decide how to schedule work. A pull-based approach allows the framework (React) to be smart and make those decisions for you.

## target

- pause work and come back to it later.
- assign priority to different types of work.
- reuse previously completed work.
- abort work if it's no longer needed.

## what

fiber represents a unit of work.

Fiber is reimplementation of the stack, specialized for React components. You can think of a single fiber as a virtual stack frame.

## how

- how the scheduler finds the next unit of work to perform.
- how priority is tracked and propagated through the fiber tree.
- how work is flushed and marked as complete.
- how the scheduler knows when to pause and resume work.
- how side-effects (such as lifecycle methods) work.
- what a coroutine is and how it can be used to implement features like context - and layout.


## level

- start => find next => flush
- priority
- pause resume
