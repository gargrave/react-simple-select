# React Simple Select

This is a fairly small-ish implementation of a select-like component in React.
As the name suggests, the goal is to make a relatively simple version, so if
you're looking for something with all of the bells and whistles, you may have
better luck with [react-select](https://github.com/JedWatson/react-select).

I would definitely advise against using this in any production projects. I have
pretty minimal time to work on it, and it's mostly just a fun side project for
me (i.e. I cannot guarantee any level of support).

[Click here to view the docs](https://gargrave.github.io/react-simple-select)

## Why?

Why make this when other options like `react-select` already cover all of these
options and more?

You're right, `react-select` is a crazy good component, and I am certainly not
trying to compete with it (hence why I suggested you might be better off using
it for production projects). But there are a few reasons I wanted to build this:

- It's a fun project, so why not?
- There are a few "I would do this different" aspects of other libs that I
  wanted to try
  - Build with fewer (if any) external dependencies (aside from React,
    obviously)
  - Allow for more friendly and flexible custom styling of every aspect of the
    component
  - Build it to be testable--some of the other libraries are notoriously
    difficult to test properly

## Getting Started

- Install:
  - `yarn add @gargrave/react-simple-select`
- Initialize the styles somewhere near the root of your project:
  - `@import '@gargrave/react-simple-select/dist/react-simple-select.css'`
  - Technically, you don't _have_ to import these styles, but this does apply
    the default styling to the component, which I think you will in most cases.
    (You can pass in custom styles to override the defaults if you wish.)
- Use the `Select` component in your project! A _very_ rough example might look
  something like this. (Until I have better docs, you can take a look at my
  [demo project](https://github.com/gargrave/react-simple-select-demo/blob/master/src/demo/DemoTS.tsx))

## Todo

These are few items on my current road map, although I don't have any specific
ETA:

- [ ] Customizable styling (in progress)
- [ ] Accessibility additions (e.g. better ARIA handling for current lists)
- [ ] Custom option rendering (e.g. render options as components instead of just
      strings)
- [ ] Add ability to specify `data-testid` attributes to all "testable" parts of
      the component
- [ ] Groupable options
- [ ] Editable options (i.e. type to add a new option)
- [ ] Multi-select
- [x] Async searching/loading (in progress)

## Docs

Right now (and for the foreseeable future), the docs are just my Styleguidist
build.
[Click here to view the docs](https://gargrave.github.io/react-simple-select).
