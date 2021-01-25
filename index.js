//---------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------\ Readme Generator - Homework 9 /----------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------\ Const for project /----------------------------------------------------------

// getting modules into the JS
const axios = require('axios')
const inquirer = require('inquirer')
const util = require('util')
const fs = require('fs')

// Using functions from modules "util" and "fs"
// Promisify

// we create a constant with the functions from the modules to 
// create a file
const writeFileP = util.promisify(fs.writeFile)

// append data into an existing file
const appendFileP = util.promisify(fs.appendFile)


// first function to ask question to user and also triggers the whole app
promptUser()
  .then(function (answers) {  // all the answers coming from the previous function, and storing them into the "answers" so we can use them in the this function
    
    // calling the generate readme template function and we pass the answers coming from the user
    const readme = generateReadme(answers)

    // creating the file and putting the information inside this new file .md
    return writeFileP('newReadme.md', readme)
  })
  .then(function () {
    //----------------------------------------------------------\ Axios /---------------------------------------------------------------
    inquirer
      .prompt([{
        message: '\nEnter your GitHub username:',
        name: 'username'
      },
      {
        message: 'Enter Github repository name:',
        name: 'repo'
      },
      {
        message: 'Would you like to include the MIT license, inside this project? (type "yes" to accept)',
        name: 'ans',
        default: 'no'
      }
    ])
      .then(function ({ username, repo, ans }) {
        const queryUrl = `https://api.github.com/users/${username}`

        axios.get(queryUrl).then(function (res) {
          const profileImg = res.data.avatar_url
          const fullname = res.data.name

          // appending data to an existing readme file
          appendFileP('newReadme.md', generateBadges(username, repo, profileImg), function (err) {
            if (err) {
              throw err
            }

          })

          if (ans === "yes" ){
            writeFileP('LICENSE.txt', generateLICENSE(fullname),function (err) {
              if (err) {
                throw err
              }
              
            })
            console.log('\x1b[92mSucced!, LICENSE.txt file was created\x1b[39m')
          }
          else{
            console.log('\x1b[91mRejeted!, LICENSE.txt file was not created\x1b[39m')
          }

          console.log(`\x1b[92mSucced!, newReadme.md file was created\x1b[39m`)
        })
  })
    console.log('')
  })
  
  .catch(function (err) {
    console.error(err)
  })