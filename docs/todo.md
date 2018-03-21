- special token names
  - user name (defined in config) `${TINPIG_USER_NAME}`
  - user email (defined in config) `${TINPIG_USER_EMAIL}`
    - even better would be a way to use these as default replacement values in the manifest. i.e.:
```
{
  "name": "USER_NAME",
  "default": "TINPIG_USER_NAME"
}
```
In the flow, the user would see:

```
- USERNAME (Keith Peters):
```
But also, you could use these directly in text content and not be prompted at all:

```
My name is ${TINPIG_USER_NAME}.
```

  - project folder `${TINPIG_PROJECT_FOLDER}`
  - project path `${TINPIG_PROJECT_PATH}`
  - date. maybe date format string. `${TINPIG_DATE(%d%m%y)}` (integrate time format library?)
    - Actually, not sure how useful this would be. It would just be the time/date that the project itself was created. 
