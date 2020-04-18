const express = require("express");
const bodyParser = require("body-parser");
// Importing Routes
const addMovieRoute = require("./routes/addMovie");
const getMovieRoute = require("./routes/getMovie");
const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next)=> {  
  next();
});

// Add Routes
// app.get("/", movie);
app.use("/movie", addMovieRoute);
app.use("/movie", getMovieRoute);

// catch 404 and forward to error handler
app.use((req, res, next)=> {
  var err = new Error("Not Found");
  err.status = 404;
  res.status(404).json(err);
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err, req, res, next)=> {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next)=> {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

const port = process.env.PORT || 3000;
app.listen(port,function(){
  console.log('listen on 3000')
});