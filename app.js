/* Array indicator
        if value in row 1, col 1 == array_indicator, treat JSON as array, else treat JSON as object */
const array_indicator = 'index'

/* nest delimiter
        denotes a column as a nested object or array */
const nest_delimiter = '/'

// strings to remove in output filepath
const strings_to_remove = [
    
]

// built-in node libraries for read/write:
const fs = require('fs')
const readline = require('readline') 

// Error callback:
const errCb = (err) => {if(err){console.log(err)}}

// DO THE THING:
const input_paths = fs.readdirSync('input')
input_paths.forEach(_path => { 

    // INPUT:
    const pathToMyCSV = 'input/' + _path
    const csv_rows = [] // ( index = row number, value = row as nested array ):

    // OUTPUT:
    let output_path = _path.replace(/\.csv$/, '.json')
    strings_to_remove.forEach((str)=>{
        output_path = output_path.replace(str, '')
    })
    const pathToMyJSON = 'output/' + output_path
    let json = {}

    // READ CSV
    const stream = fs.createReadStream(pathToMyCSV)
    const reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity // treats '\r\n' as a single new line
    })
    reader.on('line', (line) => {
        const row = line.split(',')
        csv_rows.push(row)
    })

    // FORMAT CSV AS JSON
    const formatJSON = () => {
        const keys = csv_rows.shift()
        const isArray = (keys[0] == array_indicator)
        keys.shift()
        if (isArray){ json = [] }
        csv_rows.forEach((row, row_num)=>{
            // setup row object
            let row_key = row.shift()
            if (isArray){ row_key = row_num }
            if (!json[row_key]){ json[row_key] = {} }
            
            row.forEach((value, index)=>{
                // check if value has an additional key
                let actual_value = value
                value_array = value.split('\:')
                if (value_array.length == 2){
                    actual_value = {}
                    actual_value[value_array[0]] = value_array[1]
                    // convert blank --> null
                    if (value_array[1] === ''){
                        actual_value[value_array[0]] = null
                    }
                }
                // convert blanks --> null
                if (actual_value === ''){ actual_value = null }
                else if (actual_value === 'TRUE'){actual_value = true}
                else if (actual_value === 'FALSE'){actual_value = false}
                else if (parseInt(actual_value)){actual_value = parseInt(actual_value)}

                // check if key is nested
                let address = json[row_key]
                const key = keys[index]
                if (key){
                    let parsed_key = key.split(nest_delimiter)
                    for (let i = 0; i < parsed_key.length; i++) {
                        if (i !== parsed_key.length - 1){
                            if (!address[parsed_key[i]]){ address[parsed_key[i]] = {} }
                            address = address[parsed_key[i]]
                        }
                    }
                    address[parsed_key[parsed_key.length-1]] = actual_value
                }
            })
        })
        // convert numbered keys to arrays
        const has_all_int_keys = (o) => { return Object.keys(o).every(key => Number.isInteger(Number(key))) }
        const traverse = (o) => {
            for (let key in o){
                if (o.hasOwnProperty(key) && typeof o[key] === 'object' && o[key] !== null){
                    traverse(o[key])
                    if (has_all_int_keys(o[key])){
                        o[key] = Object.values(o[key])
                    }
                }
            }
        }
        traverse(json)
    }

    // WRITE JSON
    const writeJSON = () => {
        fs.writeFile( pathToMyJSON, JSON.stringify(json), errCb )
    }

    // When finished reading file, do the thing
    reader.on('close', () => {
        formatJSON()
        writeJSON()
        console.log('\t', _path, '-->', output_path, ' DONE')
    });
})

