var express = require("express")
var app = express()
var db = require("./database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

// Iniciar servidor
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Ruta principal
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Listar todos los juegos
app.get("/api/games", (req, res, next) => {
    var sql = "select * from videogames"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// Listar un juego por Id
app.get("/api/game/:id", (req, res, next) => {
    var sql = "select * from videogames where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Añadir un juego
app.post("/api/game/", (req, res, next) => {
    var errors=[]
    if (!req.body.gendre){
        errors.push("No gendre specified");
    }
    if (!req.body.age){
        errors.push("No age specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        title: req.body.title,
        gendre: req.body.gendre,
        age : req.body.age
    }
    var sql ='INSERT INTO videogames (title, gendre, age) VALUES (?,?,?)'
    var params =[data.title, data.gendre, data.age]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})


// Actualizar un juego por Id
app.patch("/api/game/:id", (req, res, next) => {
    var data = {
        title: req.body.title,
        gendre: req.body.gendre,
        age : req.body.age
    }
    db.run(
        `UPDATE videogames set 
           title = coalesce(?,title), 
           gendre = COALESCE(?,gendre), 
           age = coalesce(?,age) 
           WHERE id = ?`,
        [data.title, data.gendre, data.age, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data
            })
    });
})

// Borrar un juego por Id
app.delete("/api/game/:id", (req, res, next) => {
    db.run(
        'DELETE FROM videogames WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})