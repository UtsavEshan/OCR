const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const {TesseractWorker} = require ("tesseract.js")
const worker = new TesseractWorker();

// ==============================================================
//settings
app.set("view engine", "ejs");
// creating a storage
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});
// =================================
// making a file
const upload = multer({storage: storage}).single('avatar');

//routes
app.get('/', (req,res) => {
    res.render("index");
});

app.get('/upload',(req,res)=>{
    res.render("")
})

app.post("/upload", (req,res) => {
    upload(req,res,  err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
          if(err) return console.log(err);

          worker.recognize(data, "eng", {tessjs_create_pdf: '1'})
          .progress(progress => {
              console.log(progress);
          })
          .then(result => {
              res.send(result.text);
          })
          .finally(() => worker.terminate)
        })
    })
});



///listen
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));



