
Who said React can't access a computer's file system? With Node/Express it can.

# React File Manager/Text Editor

Create, Read, Update and Delete files with React and Express.

Files parsed come from the directory: client/src/filesToParse

A list of all files in the directory is displayed. 

Clicking on a file will open an editor where you can:

 1. Edit the text of a file. 
 2. Rename a file
 3. Delete a file

 The + button creates a new file.
 The ** button creates a new directory.
 
 That's pretty much it! 

 FIRST:

create a file named ".env" in the client directory.

add the following variable: REACT_APP_MY_ENV="whateverPasswordYouChoose".

This is a simple hard-coded password protection, useful for remote deployment.
 
# Use "remoteBranch" for remote deployment. 

!!!For remote deployment!!! 

In client/src/text.js, replace the server ip address with your own server ip in ALL axios requests:    
axios("http://myVeryOwnServer:5000/createFile/", ...)

TO RUN: 

1) npm install in root directory

2) cd client

3) npm install

4) back to root directory

5) npm run dev

Cheers!
𝓛ⲉⲓ𝓯 Ⲥⲏꞅⲓ𝛓ⲧⲓⲁⲛ


