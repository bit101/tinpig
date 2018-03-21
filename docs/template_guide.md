# Tinpig Template Guide

So, you want to write a template. Here's what you need to do:

## Quick Start

1. Create a new folder in `~/.config/tinpig/templates/`. It doesn't matter what it's named, but something close to the template name is nice for organization.

2. Put whatever files and folders you want to be in the template into that new folder.

3. Create a manifest file in the root of that folder, called `tinpig.json`. This should be a valid JSON file with minimally `name` and `description` nodes.

You now have a template. Fire up tinpig and you should see your template listed as an option. Type `tinpig --list` and you should see the name and description.

But let's go into more detail.

## Template Content

Again, the template just a collection of files and folders. When you create a project with tinpig, these files and folders will be copied into the new project folder. It's that simple. OK, it can be more complex than that. See the topics below. But it can be that simple, too.

The template files can be any type of files at all. Source code, markdown, text, images, media, office suite documents, PDFs, PSDs, anything.

You can have top level files and folders, and files and folders within other folders, as deep as you need to go. Just set up the template structure the same way you'd want to structure your content.

You can also add special, template-only files and folders that will not be copied into the project as well. Just add the names of these to the `ignore` section of the tinpig manifest file.

## Token Replacement

One of the useful features of tinpig, of course, is that it does more than just copy files from one location to another. During this copying process, it can customize the content of those files, and even customize the file and folder names.

For any files that contain text content, you can add tokens, in the format `${TOKEN_NAME}`. These will be replaced by real values when the files are copied into the new project location. This is only possible for text-based files, of course. Any kind of binary files will be ignored in this process.

Example: You have a text file with the content:

```
My name is ${NAME}!
```

During project creation, you specify `John` as the token replacement for `NAME`. The file in the new project will contain:

```
My name is John!
```

In addition, you can add tokens to file and folder names, using the format `%TOKEN_NAME%`. This, again, will be replaced by a real value at project creation time.

Example: Your template has a file named:

```
images/logos/%PROJECT_NAME%_logo.png
```

You specify `website` as the value for `PROJECT_NAME` and the file in the project becomes:

```
images/logos/website_logo.png
```

Note that all tokens are global for the project. If you have a token named `PROJECT_NAME` used in several different files and in file or folder names, you will only have to enter a single value for that and that one value will be used everywhere.

Token names do not have to be ALL CAPS, but it is a preferred convention. It makes them easier to spot.


## Manifest Format

Let's look at a sample manifest file to see what goes into it:

``` json

{
  "name": "Webpack/React",
  "description": "Full blown Webpack 4 project with React, Babel, ESLint, etc.",
  "author": "Keith Peters",
  "contact": "https://github.com/bit101",
  "tokens": [
    {
      "name": "PROJECT_NAME"
    },
    {
      "name": "AUTHOR"
    },
    {
      "name": "LICENSE",
      "default": "ISC"
    }
  ],
  "ignore": [ "template_readme.md" ],
  "postMessage": "From inside the project folder, type `npm install` to install dependencies. Then `npm start` to start Webpack Dev Server. Open `localhost:8080` to view the site."
}
```

1. The name of the template. This is what appears in the menu when you run tinpig or ask for a listing of available templates. It's also what you will use if you specify the template name on the command line. i.e.:

```
tinpig --template Webpack/React
```

For this reason, it's best if you avoid using spaces in your template names. Spaces force the user to type quotes around the template name or escape the space character.

2. A description of the template. Displayed in the list of available templates.

3. Author and contact info. Nothing is done with this, but it's good to include.

4. The token list. An array of objects. Each object has a `name` property which is the name of the token, without the brackets or percent signs. The token object can also include a `default` property. This will be displayed in parentheses after the token name when you are entering token replacement values. This template has a `LICENSE` token with a default of `ISC`. You can just hit enter to accept the default, or type your own value.

5. A list of ignored files or folders. This template includes a `template_readme.md` file that contains useful information about the template, but is not needed in the final project. Any files listed here will not be copied into the project - and of course, will not be processed for tokens. Note that the `tinpig.json` manifest file itself is automatically ignored and will not be copied into the project. You don't need to explicitly ignore it.

6. The post-project-creation message. Whatever you want to say to the user who has just created a project from your template. Usually just a short instruction on what to do next to use the project.

Only the `name` and `description` properties are mandatory. All the other are optional.
