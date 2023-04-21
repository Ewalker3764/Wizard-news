const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");


const app = express();

app.use(morgan('dev'));
app.use(express.static('public'))

app.get("/", (req, res) => {
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
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
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
});
app.get('/posts/:id', (req, res, next) => {
  try {
  const id = req.params.id;
  const post = postBank.find(id);

if (!post.id) {
  
  next({
    name: 'PathNotFound',
    message: " Sorry we can't find that post!",
    status: 404,
  });

  } else {
  const html = `<!DOCTYPE html>
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
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.content} 
            | ${post.date}
          </small>
        </div>
      
    </div>
  </body>
</html>`
  
  
  res.send(html);}
  } catch (error) {
    console.error(error);
    next(error);
  }
});
app.use((err, req, res, next) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${err.name}</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <header><img src="/logo.png"/>Wizard News</header>
    <div class="not-found">
      <p>${err.status}: ${err.message}</p>
    </div>
  </body>
  </html>`
  res.send(html)
 

  }
);
const {PORT = 1337} = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
