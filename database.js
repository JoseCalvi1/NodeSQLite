var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Conectado a la base de datos de SQLite.')
        db.run(`CREATE TABLE videogames (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text UNIQUE, 
            gendre text, 
            age text, 
            CONSTRAINT title_unique UNIQUE (title)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO videogames (title, gendre, age) VALUES (?,?,?)'
                db.run(insert, ["League of Legends","MOBA","10+"])
                db.run(insert, ["Apex Legends","FPS","16+"])
                db.run(insert, ["Call of Duty","FPS","18+"])
            }
        });  
    }
});


module.exports = db