class classeObject {

  constructor(name, spec1, spec2, spec3, spec4){
    this.name = name;
    this.spec = [spec1, spec2, spec3, spec4];
  }
}

const Discord = require('discord.js');
const mysql = require('mysql');
const client = new Discord.Client();
const settings = require('./settings.json');
const express = require('express');
const app = express();
var isSpecFound = false;

const Chaman = new classeObject("Chaman", "amélioration", "restauration", "élémentaire", null);
const Chasseur = new classeObject("Chasseur", "BM", "précision", "survie", null);
const DH = new classeObject("DH", "dévastation", "vengeance", null, null);
const DK = new classeObject("DK", "givre", "impie", "sang", null);
const Demoniste = new classeObject("Démoniste", "affliction", "démonologie", "destruction", null);
const Druide = new classeObject("Druide", "gardien", "restauration", "équilibre", "farouche");
const Guerrier = new classeObject("Guerrier", "armes", "fureur", "protection", null);
const Mage = new classeObject("Mage", "arcane", "feu", "givre", null);
const Moine = new classeObject("Moine", "tisse-brume", "maitre-brasseur", "marchevent", null);
const Paladin = new classeObject("Paladin", "sacré", "vindicte", "protection", null);
const Pretre = new classeObject("Prêtre", "sacré", "discipline", "ombre", null);
const Voleur = new classeObject("Voleur", "hors-la-loi", "assassinat", "finesse", null);
const classList = [Chaman,Chasseur,DH,DK,Demoniste,Druide,Guerrier,Mage,Moine,Paladin,Pretre,Voleur];

app.listen(process.env.ALWAYSDATA_HTTPD_PORT, process.env.ALWAYSDATA_HTTPD_IP, function () {
  console.log('Example app started!');
});

client.on('ready', () => {
  console.log('I\'m online!');{};
});

var prefix = "$";
client.on('message', message => {
  if(message.channel.name === "general" && message.content.toLowerCase().indexOf('#raidbot') > -1) getEmojis(message);
  if(!message.content.startsWith(prefix)) return; //Prefix verification
  if(message.author.bot) return; //Disable bot response to himself

  const args = message.content.slice(prefix.length).trim().split(/ +/g); // Split the args
  const command = args.shift().toLowerCase(); // Get the command after prefix

  if(command === 'pong'){
    message.reply('ping connard !');
  }else

  if(command === 'wipedata'){
    let allowedRole = message.guild.roles.find("name", "Ecaille émérite");
    let allowedRole2 = message.guild.roles.find("name", "Garde écailles");
    if (message.member.roles.has(allowedRole.id) || message.member.roles.has(allowedRole2.id)) {
      deleteData();
    }else{
      message.reply("Vous n'avez pas les droits suffisants pour lancer cette commande !");
    }
  }else

  if(command === 'raidhelp'){
    let allowedRole = message.guild.roles.find("name", "Ecaille émérite");
    let allowedRole2 = message.guild.roles.find("name", "Garde écailles");
    message.author.send(`Bonjour ! Je suis le RaidComp Bot, celui qui va t'apprendre à t'enregistrer dans la base de données pour les futurs raids des Murlocks !\n\nLa première chose à savoir est que la commande $register permet de t'enregistrer auprès de la base de données ! Si je t'envoie ce message, c'est que tu as soit tapé $raidhelp, soit tapé un $register qui ne correspondait pas aux normes, je vais éclaircir tout ça pour toi :\n\nLa fonction $register te permet d'enregistrer ton personnage. Elle se décompose de la façon suivante : $register CLASSE SPÉ ILVL ROLE(facultatif).\n\nA la place de CLASSE, SPÉ, ILVL et ROLE, tu dois remplacer par ta classe, ta spé, ton ilvl et les rôles que tu peux avoir (à savoir, si tu es un DK Tank et que tu peux DPS, tu marquerais "$register DK sang 925 dps"). Note que tu n'as besoin de t'enregistrer qu'une seule fois, car une fois que tu es dans la base de données, c’est définitif. Tu peux néanmoins changer de spé principale/de personnage en retapant la commande. Cela t’affectera un nouveau personnage par défaut !\n\nVoilà le tableau des classes et de leur spé, pour t'aider à savoir quoi marquer :\n`);
    message.author.send(`\`\`\`\n╒═════════════╤════════════════════════════════════════════╕\n│   Chaman    │ amélioration, restauration, élémentaire    │\n╞═════════════╪════════════════════════════════════════════╡\n│  Chasseur   │ BM, précision, survie                      │\n╞═════════════╪════════════════════════════════════════════╡\n│     DH      │ dévastation, vengeance                     │\n╞═════════════╪════════════════════════════════════════════╡\n│     DK      │ givre, impie, sang                         │\n╞═════════════╪════════════════════════════════════════════╡\n│  Démoniste  │ affliction, démonologie, destruction       │\n╞═════════════╪════════════════════════════════════════════╡\n│   Druide    │ gardien, restauration, équilibre, farouche │\n╞═════════════╪════════════════════════════════════════════╡\n│  Guerrier   │ armes, fureur, protection                  │\n╘═════════════╧════════════════════════════════════════════╛\`\`\``);
    message.author.send(`\`\`\`╒═════════════╤════════════════════════════════════════════╕\n│    Mage     │ arcane, feu, givre                         │\n╞═════════════╪════════════════════════════════════════════╡\n│    Moine    │ tisse-brume, maitre-brasseur, marchevent   │\n╞═════════════╪════════════════════════════════════════════╡\n│   Paladin   │ sacré, vindicte, protection                │\n╞═════════════╪════════════════════════════════════════════╡\n│   Prêtre    │ sacré, discipline, ombre                   │\n╞═════════════╪════════════════════════════════════════════╡\n│   Voleur    │ hors-la-loi, assassinat, finesse           │\n╘═════════════╧════════════════════════════════════════════╛\n\`\`\`\n\nPas besoin de respecter la casse, vous pouvez entrer "$register MoInE TissE-BruME 915 dPs" ou "$register druide equilibre 925 TANK" sans aucun problème !\n\n`);
    if (message.member.roles.has(allowedRole.id) || message.member.roles.has(allowedRole2.id)) {
      message.author.send(`Il existe deux options que seuls les écailles émérites et les garde-écailles peuvent lancer. Ce sont les options "$makeraid" et "$wipedata". Cette première option permet de construire le raid et d'afficher la composition sur le canal, tandis que la seconde réinitialise le tableau des présences. Allez, bonne journée à toi !`);
    }
  }else

  if(command === 'register' && args.length >= 3 && args.length <= 6){
    let [classe, spec, ilvl, role1, role2, role3] = args;
    var TANK = 0;
    var DPS = 0;
    var HEAL = 0;

    for (i=0; i<classList.length; i++){
      if (classList[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() === classe.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()) {
        classe = classList[i].name;
        for (j=0; j<classList[i].spec.length; j++){
          if (classList[i].spec[j] !== null){
            if (classList[i].spec[j].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() === spec.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()) {
              spec = classList[i].spec[j];
              let allowedRole = message.guild.roles.find("name", "Murlock");
              if (message.member.roles.has(allowedRole.id)) {
                var priority = 2;
              } else {
                var priority = 1;
              }
              if (role1 !== undefined) {
                if (role2 !== undefined){
                  if (role3 !== undefined){
                    if (role1.toLowerCase() === 'tank' || role2.toLowerCase() ==='tank' || role3.toLowerCase() === 'tank') TANK = 1;
                    if (role1.toLowerCase() === 'dps' || role2.toLowerCase() ==='dps' || role3.toLowerCase() === 'dps') DPS = 1;
                    if (role1.toLowerCase() === 'heal' || role2.toLowerCase() ==='heal' || role3.toLowerCase() === 'heal') HEAL = 1;
                  }else{
                    if (role1.toLowerCase() === 'tank' || role2.toLowerCase() ==='tank') TANK = 1;
                    if (role1.toLowerCase() === 'dps' || role2.toLowerCase() ==='dps') DPS = 1;
                    if (role1.toLowerCase() === 'heal' || role2.toLowerCase() ==='heal') HEAL = 1;
                  }
                }else{
                  if (role1.toLowerCase() === 'tank') TANK = 1;
                  if (role1.toLowerCase() === 'dps') DPS = 1;
                  if (role1.toLowerCase() === 'heal') HEAL = 1;
                }
              }
              if (classe === 'Voleur' || classe === 'Démoniste' || classe === 'Mage' || classe === 'Chasseur'){
                DPS = 1;
                HEAL = 0;
                TANK = 0;
              }else if (classe === 'Prêtre' || classe === 'Chaman'){
                TANK = 0;
              }else if (classe === 'DH' || classe === 'DK' || classe === 'Guerrier'){
                HEAL = 0;
              }
              if (spec === 'restauration' || spec === 'tisse-brume' || spec === 'sacré' || spec === 'discipline') {
                HEAL = 1;
              }else if (spec === 'vengeance' || spec === 'sang' || spec === 'gardien' || spec === 'protection' || spec === 'maitre-brasseur') {
                TANK = 1;
              } else{
                DPS = 1;
              }
              console.log(DPS, TANK, HEAL);
              addCharacter(`<@!${message.author.id}>`,classe,spec,ilvl,priority,DPS,TANK,HEAL);
              randomSentence(message, classe, spec, ilvl);
              isSpecFound = true;
            }

          }
        }
      }
    }
  }else

  if (command === 'makeraid'){
    let allowedRole = message.guild.roles.find("name", "Ecaille émérite");
    let allowedRole2 = message.guild.roles.find("name", "Garde écailles");
    if (message.member.roles.has(allowedRole.id) || message.member.roles.has(allowedRole2.id)) {
      getPresence(message);
    }else{
      message.reply("Vous n'avez pas les droits suffisants pour lancer cette commande !");
    }
  }else

  if (isSpecFound){
    isSpecFound = false;
  }else if(command === 'register' && args.length != 3){
    message.reply('ta mention est incorrecte, essaie un $raidhelp !');
  }


});

client.login(settings.token);

function addCharacter(DiscordID, Classe, Specialisation, ItemLevel, Priority, DPS, TANK, HEAL){
  var con = mysql.createConnection({
    host: settings.server,
    user: settings.username,
    password: settings.password
  });

  con.connect(function(err) {
    var sql = "INSERT INTO bddsort_raidcomp.raidcomp (DiscordID, Classe, Specialisation, ItemLevel, Priority, DPS, TANK, HEAL) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Classe=?, Specialisation=?, ItemLevel=?, Priority=?, DPS=?, TANK=?, HEAL=?;";
    con.query(sql, [DiscordID, Classe, Specialisation, ItemLevel, Priority, DPS, TANK, HEAL, Classe, Specialisation, ItemLevel, Priority, DPS, TANK, HEAL], function(err, rows, fields) {
      if (err) return console.log(err);
      //  return error if connection refused/lost
      con.end();
    });
  });
}

function addPresence(DiscordID, presence){
  var con = mysql.createConnection({
    host: settings.server,
    user: settings.username,
    password: settings.password
  });

  con.connect(function(err) {
    var sql = "INSERT INTO  bddsort_raidcomp.raidcomptemp (DiscordID, Presence) VALUES (?,  ?) ON DUPLICATE KEY UPDATE Presence=?;";
    con.query(sql, [DiscordID, presence, presence], function(err, rows, fields) {
      if (err) return console.log(err);
      con.end();
    });
  });
}

function deleteData(){
  var con = mysql.createConnection({
    host: settings.server,
    user: settings.username,
    password: settings.password
  });

  con.connect(function(err) {
    var sql = "delete from bddsort_raidcomp.raidcomptemp;";
    con.query(sql, function(err, rows, fields) {
      if (err) return console.log(err);
      con.end();
    });
  });
}

function removePresence(DiscordID){
  var con = mysql.createConnection({
    host: settings.server,
    user: settings.username,
    password: settings.password
  });

  con.connect(function(err) {
    var sql = "DELETE FROM bddsort_raidcomp.raidcomptemp WHERE raidcomptemp.DiscordID = ?;";
    con.query(sql, [DiscordID], function(err, rows, fields) {
      if (err) return console.log(err);
      con.end();
    });
  });
}

function getPresence(message){
  var con = mysql.createConnection({
    host: settings.server,
    user: settings.username,
    password: settings.password
  });

  con.connect(function(err) {
    var sql = "SELECT raidcomp.DiscordID,Classe,Specialisation,ItemLevel,Priority,DPS,TANK,HEAL FROM bddsort_raidcomp.raidcomp, bddsort_raidcomp.raidcomptemp WHERE raidcomp.DiscordID = raidcomptemp.DiscordID AND raidcomptemp.Presence = 1 ORDER BY ItemLevel DESC;";
    con.query(sql, function(err, rows, fields) {
      if (err) return console.log(err);
      con.end();
      var healcount = 0;
      var tankcount = 0;
      var dpscount = 0;
      var tankNames = [];
      var healNames = [];
      var dpsNames = [];
      for (i=0; i<rows.length; i++){
        if (rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') {
          healcount++;
        }else if (rows[i].Specialisation === 'vengeance' || rows[i].Specialisation === 'sang' || rows[i].Specialisation === 'gardien' || rows[i].Specialisation === 'protection' || rows[i].Specialisation === 'maitre-brasseur') {
          tankcount++;
        }else{
          dpscount++;
        }
      }

      //HEAL SCRIPT
      for (j=2; j>=1; j--){
        if (healcount > 2){
          if (healcount > 3){
            for (i=0; healcount > 3 && i<rows.length; i++){
              if ((rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && rows[i].DPS == 1 && rows[i].TANK == 0 && rows[i].Priority == j) {
                rows[i].HEAL = 0;
                healcount--;
                dpscount++;
              }else if ((rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && rows[i].DPS == 0 && rows[i].TANK == 1 && tankcount < 2 && rows[i].Priority == j) {
                rows[i].HEAL = 0;
                rows[i].TANK = 1;
                healcount--;
                tankcount++;
              }else if ((rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && rows[i].DPS == 1 && rows[i].TANK == 1 && rows[i].Priority == j) {
                if (tankcount < 2) {
                  rows[i].HEAL = 0;
                  rows[i].DPS = 0;
                  healcount--;
                  tankcount++;
                }else{
                  rows[i].HEAL = 0;
                  rows[i].TANK = 0;
                  healcount--;
                  dpscount++;
                }
              }
            }
          }
        }else{
          for (i=0; healcount < 3 && i<rows.length; i++){
            if (!(rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && rows[i].HEAL == 1 && rows[i].TANK == 0 && rows[i].Priority == j) {
              if (rows[i].DiscordID === 'Roger') console.log('coucou !');
              rows[i].DPS = 0;
              healcount++;
              dpscount--;
            }else if (!(rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && rows[i].HEAL == 1 && rows[i].DPS == 0 && tankcount > 2 && rows[i].Priority == j) {
              rows[i].TANK = 0;
              healcount++;
              tankcount--;
            }else if (!(rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && rows[i].HEAL == 1 && rows[i].DPS == 1 && rows[i].TANK == 1 && rows[i].Priority == j) {
              if ((rows[i].Specialisation === 'vengeance' || rows[i].Specialisation === 'sang' || rows[i].Specialisation === 'gardien' || rows[i].Specialisation === 'protection' || rows[i].Specialisation === 'maitre-brasseur') && tankcount > 2){
                rows[i].TANK = 0;
                rows[i].DPS = 0;
                healcount++;
                tankcount--;
              }else{
                rows[i].TANK = 0;
                rows[i].DPS = 0;
                healcount++;
                dpscount--;
              }
            }
          }
        }


      //TANK SCRIPT

        if (tankcount > 1){
          if (tankcount > 2){
            for (i=0; tankcount > 2 && i<rows.length; i++){
              if ((rows[i].Specialisation === 'vengeance' || rows[i].Specialisation === 'sang' || rows[i].Specialisation === 'gardien' || rows[i].Specialisation === 'protection' || rows[i].Specialisation === 'maitre-brasseur') && rows[i].DPS == 1 && rows[i].HEAL == 0 && rows[i].Priority == j) {
                rows[i].TANK = 0;
                tankcount--;
                dpscount++;
              }else if ((rows[i].Specialisation==='vengeance' || rows[i].Specialisation==='sang' || rows[i].Specialisation==='gardien' || rows[i].Specialisation==='protection' || rows[i].Specialisation==='maitre-brasseur') && rows[i].DPS == 0 && rows[i].HEAL==1 && healcount<3 && rows[i].Priority == j) {
                rows[i].TANK = 0;
                tankcount--;
                healcount++;
              }else if ((rows[i].Specialisation === 'vengeance' || rows[i].Specialisation === 'sang' || rows[i].Specialisation === 'gardien' || rows[i].Specialisation==='protection' || rows[i].Specialisation==='maitre-brasseur') && rows[i].DPS==1 && rows[i].HEAL==1 && rows[i].Priority == j) {
                if (healcount < 3) {
                  rows[i].TANK = 0;
                  rows[i].DPS = 0;
                  tankcount--;
                  healcount++;
                }else{
                  rows[i].TANK = 0;
                  rows[i].HEAL = 0;
                  tankcount--;
                  dpscount++;
                }
              }
            }
          }
        }else{
          for (i=0; tankcount < 2 && i<rows.length; i++){
            if (!(rows[i].Specialisation === 'vengeance' || rows[i].Specialisation === 'sang' || rows[i].Specialisation === 'gardien' || rows[i].Specialisation==='protection' || rows[i].Specialisation==='maitre-brasseur') && rows[i].TANK == 1 && rows[i].HEAL == 0 && rows[i].Priority == j) {
              rows[i].DPS = 0;
              tankcount++;
              dpscount--;
            }else if (!(rows[i].Specialisation==='vengeance' || rows[i].Specialisation==='sang' || rows[i].Specialisation==='gardien' || rows[i].Specialisation==='protection' || rows[i].Specialisation==='maitre-brasseur') && rows[i].TANK==1 && rows[i].DPS==0 && healcount>3 && rows[i].Priority == j) {
              rows[i].HEAL = 0;
              tankcount++;
              healcount--;
            }else if (!(rows[i].Specialisation==='vengeance' || rows[i].Specialisation==='sang' || rows[i].Specialisation==='gardien' || rows[i].Specialisation==='protection' || rows[i].Specialisation==='maitre-brasseur') && rows[i].TANK==1 && rows[i].DPS==1 && rows[i].HEAL==1 && rows[i].Priority == j){
              if ((rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && healcount > 3){
                rows[i].HEAL = 0;
                rows[i].DPS = 0;
                tankcount++;
                healcount--;
              }else{
                rows[i].HEAL = 0;
                rows[i].DPS = 0;
                tankcount++;
                dpscount--;
              }
            }
          }
        }
      }

      var RaidComp = [2,3,9];

      if (healcount > 3){
        RaidComp = [2,4,14];
      }
      if (healcount < 3){
        RaidComp = [2,2,6];
      }


      for (j=2; j>=1; j--){
        for (i=0; i<rows.length; i++){
          if (rows[i].Priority == j){
            if ((rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && rows[i].DPS == 0 && rows[i].TANK == 0 && healNames.length < RaidComp[1]) {
              healNames[healNames.length] = rows[i].DiscordID;
              console.log(rows[i]);
              console.log('1 ' + `${rows[i]} au tour ${j}`);
            }
          }
        }
        for (i=0; i<rows.length; i++){
          if (rows[i].Priority == j){
            if (!(rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && rows[i].DPS == 0 && rows[i].TANK == 0 && healNames.length < RaidComp[1]){
              healNames[healNames.length] = rows[i].DiscordID;
              console.log(rows[i]);
              console.log('2 ' + `${rows[i]} au tour ${j}`);
            }
          }
        }
        for (i=0; i<rows.length; i++){
          if (rows[i].Priority == j){
            if ((rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline') && (rows[i].DPS == 1 || rows[i].TANK == 1) && healNames.length < RaidComp[1]) {
              healNames[healNames.length] = rows[i].DiscordID;
              console.log(rows[i]);
              console.log('3 ' + `${rows[i]} au tour ${j}`);
            }
          }
        }
        for (i=0; i<rows.length; i++){
          if (rows[i].Priority == j){
            if ((rows[i].Specialisation==='vengeance' || rows[i].Specialisation==='sang' || rows[i].Specialisation==='gardien' || rows[i].Specialisation==='protection' || rows[i].Specialisation==='maitre-brasseur') && rows[i].DPS==0 && rows[i].HEAL==0 && tankNames.length<RaidComp[0]){
              tankNames[tankNames.length] = rows[i].DiscordID;
              console.log(rows[i]);
              console.log('4 ' + `${rows[i]} au tour ${j}`);
            }
          }
        }
        for (i=0; i<rows.length; i++){
          if (rows[i].Priority == j){
            if (!(rows[i].Specialisation==='vengeance' || rows[i].Specialisation==='sang' || rows[i].Specialisation==='gardien' || rows[i].Specialisation==='protection' || rows[i].Specialisation==='maitre-brasseur') && rows[i].DPS==0 && rows[i].HEAL==0 && tankNames.length<RaidComp[0]){
              tankNames[tankNames.length] = rows[i].DiscordID;
              console.log(rows[i]);
              console.log('5 ' + `${rows[i]} au tour ${j}`);
            }
          }
        }
        for (i=0; i<rows.length; i++){
          if (rows[i].Priority == j){
            if ((rows[i].Specialisation==='vengeance' || rows[i].Specialisation==='sang' || rows[i].Specialisation==='gardien' || rows[i].Specialisation==='protection' || rows[i].Specialisation==='maitre-brasseur') && (rows[i].DPS==1 || rows[i].HEAL==1) && tankNames.length<RaidComp[0]){
              tankNames[tankNames.length] = rows[i].DiscordID;
              console.log(rows[i]);
              console.log('6 ' + `${rows[i]} au tour ${j}`);
            }
          }
        }
        for (i=0; i<rows.length; i++){
          if (rows[i].Priority == j){
            if (!(rows[i].Specialisation === 'restauration' || rows[i].Specialisation === 'tisse-brume' || rows[i].Specialisation === 'sacré' || rows[i].Specialisation === 'discipline' || rows[i].Specialisation==='vengeance' || rows[i].Specialisation==='sang' || rows[i].Specialisation==='gardien' || rows[i].Specialisation==='protection' || rows[i].Specialisation==='maitre-brasseur') && rows[i].DPS == 1 && healNames.indexOf(rows[i].DiscordID) < 0 && dpsNames.indexOf(rows[i].DiscordID) && tankNames.indexOf(rows[i].DiscordID) < 0 && dpsNames.length<RaidComp[2]){
              dpsNames[dpsNames.length] = rows[i].DiscordID;
              console.log(rows[i]);
              console.log('7 ' + `${rows[i]} au tour ${j}`);
            }
          }
        }
        for (i=0; i<rows.length; i++){
          if (rows[i].Priority == j){
            if (rows[i].DPS==1 && healNames.indexOf(rows[i].DiscordID) < 0 && tankNames.indexOf(rows[i].DiscordID) && dpsNames.indexOf(rows[i].DiscordID) < 0 && dpsNames.length<RaidComp[2]){
              dpsNames[dpsNames.length] = rows[i].DiscordID;
              console.log(rows[i]);
              console.log('8 ' + `${rows[i]} au tour ${j}`);
            }
          }
        }
      }


      var Réponse = `En fonction de la disponibilité des gens et des rôles qu'ils peuvent avoir, je vous conseille une composition de raid en ${RaidComp[0]}/${RaidComp[1]}/${RaidComp[2]}.\n`;

      if (tankNames.length == 0){
        Réponse = Réponse + `Malheureusement, vous n'avez pas de tank pour ce soir. `;
      }else{
          Réponse = Réponse +`Pour le tanking, le plus cohérent serait d'avoir`
        for (i=0; i<tankNames.length;i++){
          Réponse = Réponse +` ${tankNames[i]} `;
          if (!(tankNames.length-1 == i))  Réponse = Réponse +`et`;
        }
        Réponse = Réponse +`ce soir. `;
      }

      if (healNames.length == 0){
        Réponse = Réponse + `Les soigneurs ne sont hélas pas au rendez-vous. `;
      }else{
          Réponse = Réponse +`Pour les soins, en revanche, je vous propose`
        for (i=0; i<healNames.length;i++){
          Réponse = Réponse +` ${healNames[i]}`;
          if (i < healNames.length-2)  Réponse = Réponse +`,`;
          if (healNames.length-2 == i)  Réponse = Réponse +` et`;
        }
        Réponse = Réponse +`. `;
      }

      if (dpsNames.length == 0){
        Réponse = Réponse + `Les DPS nous font défaut, c'est triste à dire.`;
      }else{
          Réponse = Réponse +`Les DPS retenus sont les suivants : `
        for (i=0; i<dpsNames.length;i++){
          Réponse = Réponse +` ${dpsNames[i]}`;
          if (i < dpsNames.length-2)  Réponse = Réponse +`,`;
          if (dpsNames.length-2 == i)  Réponse = Réponse +` et`;
        }
        Réponse = Réponse +`.`;
      }

      message.reply(Réponse);

    });
  });
}

async function randomSentence(message, classe, spec, ilvl){
  var rand = Math.floor(Math.random() * (100) + 1);
  if(rand <= 24){
    message.channel.send(`Hello ${message.author} ! Donc tu es un ${classe} ${spec} à ${ilvl} d'ilvl, hein ? C'est noté !`);
  }else if(rand >= 25 && rand <= 48){
    message.channel.send(`Yop, t'es enregistré comme un ${classe} ${spec} à ${ilvl} d'item level. J'espère que tu n'as pas menti, ${message.author} !`);
  }else if(rand >= 49 && rand <= 72){
    message.channel.send(`${classe}, ${spec} et ${ilvl} d'ilvl, c'est ça ? C'est enregistré, ${message.author} !`);
  }else if(rand >= 73 && rand <= 96){
    message.channel.send(`${classe}, ${spec} de niveau d'objet ${ilvl}, enregistré dans la base de donnée. Merci, ${message.author} !`);
  }else if(rand >= 97 && rand <= 99){
    message.reply(`Bip bip boup. ${classe} ${spec} et ${ilvl}. Enregistré. MERCI POUR VOTRE COOPÉRATION. Vous avez eu de la chance, humain.`);
  }else if(rand == 100){
    message.author.send(`ERROR. ERROR. ERROR.`);
    await delay(5000);
    message.author.send(`Booting again. Welcome to RaidComp Bot !`);
    await delay(5000);
    message.author.send(`YOU JUST EARNED AN EASTER EGG. CONGRATULATIONS ! TRY $pong ! Oh, and "${classe}", "${spec}", "${ilvl}" registered. Thanks.`);
  }
}

function delay(t) {
  return new Promise(function(resolve) {
      setTimeout(resolve, t)
  });
}

async function getEmojis(message) {
  const messageEmote = message;
  await messageEmote.react("👍");
  await messageEmote.react("❓");
  await messageEmote.react("👎");
  const collecteur = messageEmote.createReactionCollector((reaction, user) => ( user.id !== '390425511429406722'));
  //Quand le collecteur collecte
  collecteur.on('collect', async(reaction, user) => {
   if (reaction.emoji.name === "👍") {
     addPresence(`<@!${reaction.users.last().id}>`, 1);
     reaction.users.last().send("C'est parti pour une soirée de raid de folie !");
     await reaction.remove(reaction.users.last());
   }else if (reaction.emoji.name === "❓") {
     reaction.users.last().send("On espère que tu pourras venir !");
     addPresence(`<@!${reaction.users.last().id}>`, 0);
     await reaction.remove(reaction.users.last());
   }else if (reaction.emoji.name === "👎") {
     reaction.users.last().send("Dommage, ça sera pour une prochaine fois !");
     removePresence(`<@!${reaction.users.last().id}>`);
     await reaction.remove(reaction.users.last());
   }else if (reaction.emoji.name !== '👍' || reaction.emoji.name !== '❓' || reaction.emoji.name !== "👎") {
     reaction.users.last().send("L'emoji ne correspond à aucune reconnue. Elle a donc été retirée de l'annonce, désolé !");
     await reaction.remove(reaction.users.last());
   }
  });
};
