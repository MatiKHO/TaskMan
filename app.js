const express = require("express");
const passport = require('passport');
const path = require("path");
const { create } = require("express-handlebars");
const dotenv = require("dotenv");
const session = require('express-session');
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 3000;


const handlebars = create({
  extname:'.hbs',
  defaultLayout:'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
})
app.engine('hbs', handlebars.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; 
  next();
})

app.use('/api', authRoutes);
app.use('/api', taskRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido a Taskman!');
});

app.get('/api/login', (req, res) => {
  res.render('login');
});

app.get('/api/register', (req, res) => {
  res.render('register');
});

app.get('/api/home', async (req, res) => {
  res.render('dashboard', { user: req.user});
});

app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: {userId: req.user.id},
  });
  res.render('tasks', {tasks});
});

app.get('/api/tasks/create', (req, res) => {
  res.render('createTask');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
