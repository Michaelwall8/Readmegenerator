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

  //--------------------------------------------------------------\ Functions /---------------------------------------------------------------
function promptUser () {
  return inquirer.prompt([
    {
      type: 'text',
      name: 'intro message',
      message: "\x1b[95mWelcome to Readme GENERATOR!\x1b[39m" + "\x1b[36m\nAnswer the following questions, in order to create your new Readme File. \nIf you don't answer a question, a default value will be assigned.\nFor badges and MIT license, make sure you insert the correct Github name of your repo.\n>>>> Hit ENTER to get started <<<<\x1b[89m",
      
    },
    {
      type: 'input',
      name: 'name',
      message: "What's the name of your project?",             
      default: 'Project Title'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Describe your project: ',       
      default: 'Description of your project'
    },
    {
      type: 'input',
      name: 'installation',
      message: 'How do you install your application?',
      default: 'Installation steps'
    },
    {
      type: 'input',
      name: 'usage',
      message: 'How do you use it?',
      default: 'Usage of the app'
    },
    {
      type: 'input',
      name: 'test',
      message: 'Add all the tests you did on this app',
      default: 'None'
    },
    {
      type: 'input',
      name: 'version',
      message: 'App version?',
      default: 'v1.0.0'
    }
  ])
  
}

function generateReadme (answers) {
  return `# ${answers.name}
   
  ## Table of Content

  * [Description](#description)
  * [Installation](#installation)
  * [Usage](#usage)
  * [Test](#test)
  * [Contributing](#contributing)
  * [Badges](#badges)
  * [License](#license)
  * [Questions](#questions)

  ## Description
   ${answers.description} 

  ## Installation
   ${answers.installation}

  ## Usage
   ${answers.usage}

  ## Test
  ${answers.test}

  ## Badges
  ![Mike](https://img.shields.io/badge/version-${answers.version}-yellow) `
}

function generateLICENSE (fullname) {
  return `
  MIT License

  Copyright (c) 2020 ${fullname}

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  `
}

function generateBadges (username, repo, profileImg) {
  return `
  ![code size](https://img.shields.io/github/languages/code-size/${username}/${repo})
  ![top lang](https://img.shields.io/github/languages/top/${username}/${repo})
  ![last comit](https://img.shields.io/github/last-commit/${username}/${repo})
  ![vulnera](https://img.shields.io/snyk/vulnerabilities/github/${username}/${repo})

  ## License ![License](https://img.shields.io/github/license/${username}/${repo})
  This project is under the MIT License.
  
  ## Contributing [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)
  This project is under the Contributor Covenant.

  ## Questions ![Social](https://img.shields.io/github/followers/${username}?style=social) 
  ![Profile img](${profileImg})

  E-mail: Hidden
  `
}

// -----------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------\  END  /---------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------

