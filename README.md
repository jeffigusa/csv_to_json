# CSV to JSON Converter

## How To Use

1) Place .csv files in input folder
2) `node app.js`
or run do_the_thing.bat

Converted .json files are created in output folder

## Config Variables

**array_indicator**
if Row 0, Column 0 of a csv file == array_indicator (default 'index') then output json will be assembled as an array, otherwise it will be outputted as an object

**nest_delimiter**
Use nest delimiter (default '/') to denote a nested value. i.e. a column header of 'key/nestedKey' will result in { ..., "key": { "nestedKey": value }, ... }

**strings_to_remove**
Remove unwanted substrings from the output filename by adding them to strings_to_remove
    Default output:                             test.csv --> test.json
    Using strings_to_remove = ['remove_me_']:   remove_me_test.csv --> test.json