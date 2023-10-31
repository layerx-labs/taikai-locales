# TAIKAI locales

We use [UTS Locale Identifiers](https://www.unicode.org/reports/tr35/tr35-59/tr35.html#Identifiers), a standardized format for defining locales, with no specific region to identify (e.g., en, pt, br), to localize all the TAIKAI product (website copy, alerts, errors, email notifications).

## File structure

```
taikai-locales
├── br
│   └── ...
├── en
│   └── emails
│   │   ├── index.js
│   │   ├── common.js
│   │   └── ...hbs
│   └── frontend
│   │   └── ...json
│   └── notifications
│       └── index.js
└── ...
```

## Contribution Guide

Contributing to _TAIKAI locales_ is an ongoing opportunity for both beginners and experienced developers (or not) to enhance open-source resources and foster a stronger community of knowledge-sharing.

If you're new to GitHub, please read the [GitHub Open Source Guide](https://opensource.guide/how-to-contribute/#opening-a-pull-request) to learn how to fork a repository, create a branch, and submit a pull request.

### Emails

Are used for our internal emails in TAIKAI, like:

- Signups confirmation
- Hackathons registration
- Project invites
- Etc.
  In this folder, we have a `index.js` file where are all the _subjects_ and _preheaders_ of emails sent. On the `common.js` file, we have some messages that are common across emails. And on the `[...].hbs` files are all the copies used in the different types of emails.

> [!IMPORTANT]
> These files can contain [HTML tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) (e.g., `<a>`, `<p>`), [handlebars](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Main_features#handlebars) templating (`{{variableName}}`), and other variables that can't be modified or deleted.

### Frontend

Represents all copies in our frontend application and can be found in a [JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) format:

```json
{
  "message_1": "The final text 1",
  "message_2": "The final text 2",
  "message_3": "The final text 3",
}
```

> [!IMPORTANT]
> Please edit only the string between the quotes (e.g., _"The final text 1"_) and don't change the variable name (e.g., `message_1`)

### Notifications

Related to the internal notifications inside the application and can be found in the JS file with the format:

```js
module.exports = {
  allocateReceived: 'You receive {{amount}} VKAI in {{{hackathonName}}}',
  // ...
}
```

The example above can be translated like this:

```js
module.exports = {
  allocateReceived: 'Recebeste {{amount}} VKAI no {{{hackathonName}}}',
  // ...
}
```

> [!IMPORTANT]
> Please don't edit the variable names and the [handlebars](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Main_features#handlebars) templating.

## Support

We're here for you if you need help to start contributing to this repository. You can contact us through [Discord](https://discord.gg/layerx), and our team will help you.
