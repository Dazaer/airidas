# Airidas website

[![vue.js](https://img.shields.io/static/v1?label=Vue.js&message=v3.2.19&color=4FC08D&style=flat-square&logo=vuedotjs)](https://vuejs.org/) [![typescript](https://img.shields.io/static/v1?label=TypeScript&message=v4.1.6&color=4FC08D&style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![firebase](https://img.shields.io/static/v1?label=Firebase&message=v9.5.0&color=4FC08D&style=flat-square&logo=firebase)](https://firebase.google.com) [![primevue](https://img.shields.io/static/v1?label=Prime Vue&message=v3.10.0&color=4FC08D&style=flat-square&logo=)](https://www.primefaces.org/primevue) [![fontawesome](https://img.shields.io/static/v1?label=Font Awesome&message=v5.15.4&color=4FC08D&style=flat-square&logo=fontawesome)](https://fontawesome.com/) [![sass](https://img.shields.io/static/v1?label=Sass&message=v1.42.1&color=4FC08D&style=flat-square&logo=sass)](https://sass-lang.com/) [![eslint](https://img.shields.io/static/v1?label=ESLint&message=v6.8.0&color=4FC08D&style=flat-square&logo=eslint)](https://eslint.org) [![netlify](https://img.shields.io/static/v1?label=Netlify&message=Current&color=4FC08D&style=flat-square&logo=netlify)](https://www.netlify.com)

## About
This is a personal project that is developed and delivered based on the requests of a person I know. New features are intended to be gifted as a birthday and/or christmas gift.

Currently as it is mostly for their personal use, the actual website is not publicly accessible yet. Well, _it is_, but you won't be able to do anything unless you have an account (check below for a preview version though).

## Features

### Main requested features
#### Feature Requests
This section was the first implementation and is there for the user to easily create new features to be implemented on next release or report bugs.

- Ability to set priorities for the features

#### Recipes
The first actually requested feature. It serves as a main focal storage point for recipes that can be accessed easily by the family.
Instead of searching through all the different locations where you have saved your recipes you can instead create them here and either link to the recipe's page or write the recipe in the description itself.

- You are able to add multiple tags to each recipe and filter the recipes by tag.
- Anyone who has an account can create recipes and you will see who created which one, but you're only able to edit/delete your own.

### Extra QOL features

- Login system
  - Password reset

## Preview

### [airidas-preview](https://airidas-preview.netlify.app)

##### Login details
Email: _tester@airidaspreview.com_
Password: _preview_
___

This is where you can test the features, however the free firestore database has a limit on how many reads/writes can be done in a day so just keep that in mind.
Also I hope it's obvious that any data you insert is most likely not going to remain forever.

If something is wrong (quota reached/login not working/etc) and you'd like to test it out just contact me and we'll work something out.

## Installation and running the project locally

For the project to run you will need to configure your own [firebase](https://console.firebase.google.com) database.

At some point you will need to run `yarn` in the cmd to get all the dependencies.

### Firebase

Once you've created an account and added a project this is the setup you need.

#### Authentication & Firestore

For authentication all you need to do is set up "Email/Password" sign-in method and add a user.
You will also need to create a firestore database.

#### Config setup

1. In Firebase go to your project settings and add a web app
2. Add a new file named `.env.local` to the root of the project.
3. Add the firebase keys to the newly created file. It should look like this (`VALUE` should not contain the quotes):
```text
VUE_APP_FIREBASE_API_KEY_DEV = VALUE
VUE_APP_FIREBASE_AUTH_DOMAIN_DEV = VALUE
VUE_APP_FIREBASE_PROJECT_ID_DEV = VALUE
VUE_APP_FIREBASE_STORAGE_BUCKET_DEV = VALUE
VUE_APP_FIREBASE_MESSAGING_SENDER_ID_DEV = VALUE
VUE_APP_FIREBASE_APP_ID_DEV = VALUE
VUE_APP_FIREBASE_MEASUREMENT_ID_DEV = VALUE
```
4. Make sure in firebase.ts the key names correspond to the .env.local file names
5. Make sure project.config.ts is using the correct environment

#### Firestore setup

There's a few collections you will need to add manually due to there not existing an interface or automation for creating them:

##### Collection id: global-properties
###### Document id: _recipes-properties_
- **recipesCount**
   - number: 0

##### Collection id: priorities

There is no interface for creating Priorities. You will need to add them to the database yourself following the Model structure.
###### Document id: _1_
- **label**
   - string: Low
- **isActive**
   - boolean: true
   
##### Collection id: recipe-tags
You don't actually have to create this one manually as there is a hidden interface for creating RecipeTags. It is hidden because it's not production ready but it's much easier to work with than having to do the same thing as was done for Priority.

##### Indexing
You will need to create indexes for the queries when they are first utilized (for example when first filtering by recipe tag).
Just open the console and follow the link provided.


## Publishing your own version

If you want to publish your own version of this project with minimal amount of configuration you will need to use [netlify](https://www.netlify.com/) as your hosting provider.

### Netlify
Once you've set up an account:
1. Add new site -> import an existing project
2. Connect to github and select the fork of this project
3. Basic build settings
   - Build command: yarn build
   - Publish directory: dist
4. Deploy site

You should also add the keys created in .env.local to Environment Variables.

## Contributing
If you feel like contributing for some reason, go ahead! However the project is rather specific so it's probably best to discuss any changes if you don't want to waste your time.