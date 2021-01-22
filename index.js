//---------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------\ Readme Generator - Homework 9 /----------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------\ Const for project /----------------------------------------------------------
const axios = require('axios')
const inquirer = require('inquirer')
const util = require('util')
const fs = require('fs')
// Promisify
const writeFileP = util.promisify(fs.writeFile)
const appendFileP = util.promisify(fs.appendFile)


promptUser()
  .then(function (answers) {
    
    const readme = generateReadme(answers)
    return writeFileP('newReadme.md', readme)
  })
  