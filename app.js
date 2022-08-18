const express = require("express");
const morgan = require("morgan")
const postBank = require("./postBank");


const app = express();
const { PORT = 1337 } = process.env;
app.use(morgan('dev'));

//static routes
app.use(express.static('public'));



//single post
app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  console.log(postBank.find(id))
  const post = postBank.find(id);
  if (!post.id) {
  res.status(404)
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
    <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
      <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
      <img src="/dumbledore-404.gif" />
      </div>
    </body>
  </html>
  `
res.send(html)
 } else {
// html to send as output
  const html =`<!DOCTYPE html>
  <html>
  <head>
   <title>Wizard News</title>
   <link rel="stylesheet" href="/style.css" />
   </head>
   <body>
   <div class="news-list">
   <header><img src="/logo.png"/>Wizard News</header>
   <div class='news-item'>
   <p>
   <span class="news-position">${post.id}. ▲</span>${post.title}
   <small>(by ${post.name})</small>
   </p>
   <small class="news-info">
   ${post.upvotes} upvotes | ${post.date}
   <p>
   <span class="post-content">${post.content}</span>
   </p>
   </small>
   </div>
   </body>
   </html>`

//send a response
res.send(html);

 }
});

app.get("/", (req, res) => {
  //get the list of posts
    const posts = postBank.list();
   

   const html = `<!DOCTYPE html>
   <html>
     <head>
       <title>Wizard News</title>
       <link rel="stylesheet" href="/style.css" />
     </head>
     <body>
       <div class="news-list">
       <header><img src="/logo.png"/>Wizard News</header>
       ${posts.map
         (post => `
             <div class='news-item'>
             <p>
             <span class="news-position">▲<a href="/posts/${post.id}">${post.title}</a> </span>
             <small>(by ${post.name})</small>
             </p>
             <small class="news-info">
             ${post.upvotes} upvotes | ${post.date}
             </small>
           </div>`
         ).join('')}
       </div>
     </body>
   </html>`

res.send(html);
})

app.use((req, res, next) => {
  const errorMsg = {
    title: "Sorry, this path wasn't found",
    message: "Sorry! This path doesn't exist",
    status: 404,
  };
  next(errorMsg)
})
  
app.use((error, req, res, next) => {
  console.log('am i evenrunning?!!?')
  console.error(error)
  res.status(error.status || 404) 
  const html = `<!DOCTYPE html>
                <html>
                <h1>${error.title}</h1>
                <h2>Error: ${error.status}</h2>
                </html>
                `
  res.send(html);
  
});



app.listen(PORT, () => {
    console.log(`App listening in port ${PORT}`);
})
