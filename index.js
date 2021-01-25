require('dotenv').config();
const express    = require("express");
const bodyParser = require("body-parser");
const app        = express();
const mongoose   = require("mongoose");
const encrypt   = require('mongoose-encryption');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.static(__dirname + "/dosyalar"));


const Schema = mongoose.Schema;
mongoose.connect(process.env.BAGLANTI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const uyeSemasi = new mongoose.Schema({
  email : String,
  sifre : String
});


uyeSemasi.plugin(encrypt, {secret : process.env.ANAHTAR , encryptedFields : ['sifre']})


console.log(process.env.ANAHTAR);


const Kullanici = new mongoose.model("Kullanici", uyeSemasi);

app.get("/", function(req, res){
  res.render("anasayfa");
});

app.get("/kayitol", function(req, res){
  res.render("kayitol");
});

app.post("/kayitol", function(req,res){
  const uye = new Kullanici({
    email : req.body.username,
    sifre : req.body.password
  });

  uye.save(function(err){
    if(err)
      console.log(err);
    else
    res.render("gizlisayfa");

  })

});


app.post("/girisyap", function(req, res){
  const emailGelen = req.body.username;
  const sifreGelen = req.body.password;
  Kullanici.findOne({email : emailGelen}, function(err, gelenVeri){
    if(err){
      console.log(err);
    }else{
      if(gelenVeri){ // gelen veri var mı
        if(gelenVeri.sifre == sifreGelen){
          res.render("gizlisayfa");
        }else{
          res.send("Şifre hatalı");
        }
      }else {
        res.send("Böyle bir kullanıcı yok.");
      }
    }
  });
});

app.get("/giris", function(req, res){
  res.render("giris");
});

app.listen(5000, function(){
  console.log("5000 port'a bağlandık.");
})
