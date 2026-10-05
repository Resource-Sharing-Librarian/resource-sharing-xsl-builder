# Letter folders

Each supported letter should keep its letter-specific files inside its own folder.

Recommended layout:

```text
letters/
  letter-folder-name/
    letter-module.js
    letter-template.xsl
    sample-letter.xml
```

Use `letter-module.js` for behavior that should only affect that letter, such as custom metadata choices, label formatting, or conditional XSL replacement. Shared app code should only load the selected letter, read visible fields, and call the selected letter module.

This keeps new letter work from changing older letters by accident.
