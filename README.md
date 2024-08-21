# CSV to JSON Converter

## Dependencies
- Node

## How To Use

1) Place .csv files in input folder
2) `node app`
or run do_the_thing.bat

Converted .json files are created in output folder

## Config
| Parameter | Default | Description |
| --- | --- | --- |
| array_indicator| 'index' | If row 1, col 1 == array_indicator, output JSON as array, else output JSON as object |
| nested_col_delimiter | '/' | Char or substring used to denote a nested column.<br>'key/nestedKey' ==> { ..., "key": { "nestedKey": value }, ... } |
| nested_value_delimiter | '\\:' | Char or substring used to denote a value as a key-pair<br>'key:value' ==> { "key": value } |
| unwanted_filepath_substrings | [] | Removes supplied substrings from output filename.<br>Default output:                                     test.csv --> test.json<br>unwanted_filepath_substrings = ['remove_me_']:      remove_me_test.csv --> test.json  |