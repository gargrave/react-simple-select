# React Simple Select

This is a fairly small-ish implementation of a select-like component in React.
As the name suggests, the goal is to make a relatively simple version, so if
you're looking for something with all of the bells and whistles, you may have
better luck with [react-select](https://github.com/JedWatson/react-select).

I would definitely advise against using this in any production projects. I have
pretty minimal time to work on it, and it's mostly just a fun side project for
me (i.e. I cannot guarantee any level of support).

[Click here to view the docs](https://gargrave.github.io/react-simple-select)

## Getting Started

- Install:
  - `yarn add @gargrave/react-simple-select`
- Initialize the styles somewhere near the root of your project:
  - `@import '@gargrave/react-simple-select/dist/react-simple-select.css'`
  - Technically, you don't _have_ to import these styles, but this does
    apply the default styling to the component, which I think you will in
    most cases. (You can pass in custom styles to override the defaults if
    you wish.)
- Use the `Select` component in your project! A _very_ rough example might
  look something like this. (Until I have better docs, you can take a look at my
  [demo project](https://github.com/gargrave/react-simple-select-demo/blob/master/src/demo/DemoTS.tsx))

## Todo

These are few items on my current road map, although I don't have any specific ETA:

- [ ] Better docs (see the section below)
- [ ] Groupable options
- [ ] Disabled options
- [ ] Editable options (i.e. type to add a new option)
- [ ] Multi-select
- [ ] Accessibility

## Docs

Right now (and for the foreseeable future), the docs are just my Styleguidist build.
[Click here to view the docs](https://gargrave.github.io/react-simple-select). They need
a little touching up before they will be very useful, but that is on my short list.

### Docs Todo

- [ ] Better code snippets for examples (snippets are hidden right now)
- [ ] More examples for various props
