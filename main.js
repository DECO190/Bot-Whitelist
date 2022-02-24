const config = require('./config.js')
const Discord = require('discord.js')
const client = new Discord.Client()
const db = require('./db.js')

console.log('[BOT INICIADO]')

let channelName = 'testes' // Colocar Nome do canal para aprovação
let columnName = 'vrp_users' // Coluna onde está o id no banco de dados
let botId = '924183351772999730' // Id da conta do bot

async function verifyId(id) {
    let [data] = await db(columnName).select('id').where({id: id})

    if (data == undefined) {
        return false
    } else {
        return true
    }
} 

async function approve(id) {
    await db(columnName).update({whitelisted: '1'}).where({id: id})
}

function embedAprovado() {
    const embed = new Discord.MessageEmbed()
    .setTitle("Você teve seu ID Aprovado!")
    .setAuthor("Nome do Servidor", "https://images-na.ssl-images-amazon.com/images/I/51lpm9SpsJL.png")
    .setColor('#FFFFFF')
    .setDescription("Lembre-se, quando entrar no jogo setar o seu nome igual ao mandado no discord (passivel de punição)")
    .setThumbnail("https://images-na.ssl-images-amazon.com/images/I/51lpm9SpsJL.png")
    .setFooter('DEVELOPED BY deco#0001')

    return embed
}

function embedWrong() {
    const embed = new Discord.MessageEmbed()
    .setTitle("Você teve seu ID reprovado!")
    .setAuthor("Nome do Servidor", "https://images-na.ssl-images-amazon.com/images/I/51lpm9SpsJL.png")
    .setColor('#FFFFFF')
    .setDescription("Se possível reenviar o seu nome e id de forma coerente.")
    .setThumbnail("https://images-na.ssl-images-amazon.com/images/I/51lpm9SpsJL.png")
    .setFooter('DEVELOPED BY deco#0001')

    return embed
}

async function verifyCorrect(message, name, id, userMember) {
    if (!name || !id || Number(id).toString() == 'NaN') {
        message.reply('Erro de digitação')
        .then(msg => {
            msg.delete({timeout: 5000})
        })
        
        message.react("❌")
        message.author.send(embedWrong())

        return false
    } else {
        let checkedId = await verifyId(id)

        if (checkedId) {
            approve(id)
            
            userMember.setNickname(`${id} | ${name}`)
            message.react("✔️")

            return true
        } else {
            message.react("❌")

            return false
        }

    }
}


client.on('message', async message => {
    if (message.channel.name != channelName || message.author.id == config.id) {
        return
    }

    let userID = message.author.id
    let userMember = message.guild.members.cache.get(userID)
    
    if (!message.content || message.author.id == botId) return

    var id =  message.content.split(' | ')[0]
    var name = message.content.split(' | ')[1]
   
    if (verifyCorrect(message, name, id, userMember)) {
        message.author.send(embedAprovado())
    } else {
        message.author.send(embedWrong())
    }
})

client.login(config.token) 
