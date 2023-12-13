# TAIKAI locales

We use [UTS Locale Identifiers](https://www.unicode.org/reports/tr35/tr35-59/tr35.html#Identifiers), a standardized format for defining locales, with no specific region to identify (e.g., en, pt, br), to localize all the TAIKAI product (website copy, alerts, errors, email notifications).

## File structure

```
taikai-locales
├── lib
│   ├── locales
│   │   ├── br
│   │   │   ├── emails
│   │   │   │   ├── common.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── [...].hbs
│   │   │   ├── frontend
│   │   │   │   ├── [...].json
│   │   │   └── notifications
│   │   │       └── index.ts
│   │   ├── en
│   │   │   ├── emails
│   │   │   │   ├── common.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── [...].hbs
│   │   │   ├── frontend
│   │   │   │   ├── index.ts
│   │   │   │   ├── [...].json
│   │   │   └── notifications
│   │   │       └── index.ts
│   │   └── ...
│   ├── types
│   │   └── index.ts
│   └── ...
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
  In this folder, we have a `index.ts` file where are all the _subjects_ and _preheaders_ of emails sent. On the `common.ts` file, we have some messages that are common across emails. And on the `[...].hbs` files are all the copies used in the different types of emails.

> [!IMPORTANT]
> These files can contain [HTML tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) (e.g., `<a>`, `<p>`), [handlebars](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Main_features#handlebars) templating (`{{variableName}}`), and other variables that shouldn't be modified or deleted.

### Frontend

Represents all copies in our frontend application and can be found in a [JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) format:

```json
{
  "message_1": "The final text 1",
  "message_2": "The final text 2",
  "message_3": "The final text 3"
}
```

> [!IMPORTANT]
> Please edit only the string between the quotes (e.g., _"The final text 1"_) and don't change the variable name (e.g., `message_1`)

### Notifications

Related to the internal notifications inside the application and can be found in the TS file with the format:

```ts
export default {
  allocateReceived: 'You receive {{amount}} VKAI in {{{hackathonName}}}',
  // ...
};
```

The example above can be translated like this:

```ts
export default {
  allocateReceived: 'Recebeste {{amount}} VKAI no {{{hackathonName}}}',
  // ...
};
```

> [!IMPORTANT]
> All the template variables should be used on the translation and please don't edit the variable's names and the [handlebars](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Main_features#handlebars) templating.

### Types

After you add a new locale, please add it to the `types/index.ts` file, on the `Locale` type, like this:

```ts
export type Locale = 'en' | 'br' | '<MY_NEW_LOCALE>';

// Where <MY_NEW_LOCALE> is the new locale you added. For example, 'es', 'fr', 'de', etc.
```

## How To Run
### Locally

To visualize your changes in another repository/project, execute the following commands:
```
npm run build
```
```
npm pack
```
After that, it will create file with a name `taikai-locales[version].tgz` in the root of your project. Copy its relative path, then proceed to another project and execute:
```
npm i /Users/[path-to-project]/taikai-locales[version].tgz
```

### Remote
In order to be able to see the changes live (e.g: CI environment), one must publish a new version (to do it you must be logged to the NPM first):
- Go to package.json and bump the version of your release (beta or alpha) - e.g: `1.0.0-alpha.3` to `1.0.0-alpha.4`
- Then execute the command below:
```
npm run build
```
```
npm run deploy
```

## Support

We're here for you if you need help to start contributing to this repository. You can contact us through [Discord](https://discord.gg/layerx), and our team will help you.
