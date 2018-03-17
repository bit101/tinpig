# tinpig

## Concept:

- Binary executable.
  - language?
    - Rust
    - nodejs
    - Python
    - Ruby
- config file
  - `.config/tinpig/config`
  - options?
- folder of templates
  - `.config/tinpig/templates/`
  - template is a subfolder
    - template contains files
    - template can contain other folders
    - files can be of any type
    - text based files can contain relaceable tokens
      - probably `${token}`
    - file and folder names can also contain tokens
      - probably `%token%`
    - template contains tinpig.json manifest file
      - name of project
      - project description
      - ignore list - files that won't be copied
      - ignoreContentToken list - files that won't have tokens replaced in conent
      - lists names of all tokens in order they will be asked for
        - token, defaultValue
      - pre-template action
      - post-template action
- command line
  - `tinpig` - fully interactive
  - `tinpig --out=project_dir_name` - specify project dir
  - `tinpig --out=path/to/project_dir_name` - project with full path
  - `tinpig --template=template` - specify template
  - `tinpig --out=project_dir_name --template template` - specify project dir and template
  - `tinpig --list` - list templates
  - defaults to current dir
  - template is template name from manifest
- functionality
  - check config
    - no config - make config
    - read config
  - check templates
    - no template - copy sample templates
    - read templates
  - if no template specified (no `--template` arg)
    - presents a numbered list of templates based on template name in manifest
    - prompts for number input
  - if template specified with `--template` arg
    - look for that template name and use it.
    - fail if it doesn't exist
  - if no project dir specified with `--out`, prompt for project dir
  - execute pre-template action if any
  - prompts for each token found in manifest list (defaults if any in parens)
  - gets user input for each token, saves
  - copies each folder and file from template to new project dir
  - changes any file/dir names based on tokens
  - replaces any tokens within text based files
  - execute post-template action if any


Sample structure:

```
~
  .config
    tinpig
      config
      templates
        html
          tinpig.json
          index.html
          src
            main.js
          styles
            css
        npm
          tinpig.json
          package.json (could be tokenized to mimic npm init flow)
          src
            main.js
          webpack.config.js
          .babelrc
          .eslintrc
          readme.md
```
