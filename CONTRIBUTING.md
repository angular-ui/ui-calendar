# Contributing

This repository maintains compatibility for existing AngularJS applications.
Keep the directive attributes and FullCalendar method behavior stable.

Use Node from `.nvmrc`, then run:

```bash
npm ci
npm install --global bower grunt-cli
bower install
grunt
```

Every bug fix requires a behavioral Jasmine test. Use conventional commit
messages and explain any compatibility impact in the pull request.
