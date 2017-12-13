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

client.on('ready', () => {
  console.log('I\'m online!');{};
});

var prefix = "$";
client.on('message', message => {
  if(!message.content.startsWith(prefix)) return; //Prefix verification
  if(message.author.bot) return; //Disable bot response to himself

  const args = message.content.slice(prefix.length).trim().split(/ +/g); // Split the args
  const command = args.shift().toLowerCase(); // Get the command after prefix

  if(command === 'ping'){
    message.reply('pong');
  }

  if(command === 'pong'){
    message.reply('ping connard !');
  }

  if(command === 'register' && args.length == 3){
    let [classe, spec, ilvl] = args;

    for (i=0; i<classList.length; i++){
      if (classList[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() === classe.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()) {
        classe = classList[i].name;
        for (j=0; j<classList[i].spec.length; j++){
          if (classList[i].spec[j].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() === spec.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()) {
            spec = classList[i].spec[j];
            let allowedRole = message.guild.roles.find("name", "Murlock");
            if (message.member.roles.has(allowedRole.id)) {
              var priority = 2;
            } else {
              var priority = 1;
            }
            addCharacter(`${message.author.username}#${message.author.discriminator}`,classe,spec,ilvl,priority)
            message.author.send(`Hello ${message.author.username}#${message.author.discriminator} ! Donc tu es un ${classe} ${spec} à ${ilvl} d'ilvl, hein ? C'est noté !`);
            return;
          }
        }
      }
    }
  }
});

client.login(settings.token);

function addCharacter(DiscordID, Classe, Specialisation, ItemLevel, Priority){
  var con = mysql.createConnection({
    host: settings.server,
    user: settings.username,
    password: settings.password
  });

  con.connect(function(err) {
    var sql = "INSERT INTO bddsort_raidcomp.raidcomp (DiscordID, Classe, Specialisation, ItemLevel, Priority) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Classe=?, Specialisation=?, ItemLevel=?, Priority=?;";
    con.query(sql, [DiscordID, Classe, Specialisation, ItemLevel, Priority, Classe, Specialisation, ItemLevel, Priority], function(err, rows, fields) {
      if (err) return console.log(err);
      //  you need to end your connection inside here.
      con.end();
    });
  });
}
