const config = require('./config.js')
const Discord = require('discord.js')
const client = new Discord.Client()
const db = require('./db.js')

console.log('[BOT INICIADO]')

let channelName = '🆔・liberar-id' // Colocar Nome do canal para aprovação

let rolesTypes = {
    aprovado: 'Aprovado', // Colocar Nome do cargo de aprovado
    pendente: 'Pendente', // Colocar Nome do cargo de pendente
}

function addRole(message, name, userMember){
    let role = message.guild.roles.guild.roles.cache.find((role) => role.name == name)

    userMember.roles.add(role)
}

function removeRole(message, name, userMember) {
    let role = message.guild.roles.guild.roles.cache.find((role) => role.name == name)

    userMember.roles.remove(role)
}

async function verifyId(id) {
    let data = await db('vrp_users').select('id').where({id: id})

    if (data[0] == undefined) {
        return false
    } else {
        return true
    }
} 

async function verifyCorrect(message, name, id, userMember) {

    if (name == undefined || id == undefined || Number(id).toString() == 'NaN') {
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
            aprovar(id)
            addRole(message, rolesTypes.aprovado, userMember)
            removeRole(message, rolesTypes.pendente, userMember)

            userMember.setNickname(`${id} | ${name}`)

            message.react("✔️")
            return true
        } else {
            message.react("❌")
            return false
        }

    }
}


async function aprovar(id) {
    await db('vrp_users').update({whitelisted: '1'}).where({id: id})
    return
}

function embedAprovado() {
    const embed = new Discord.MessageEmbed()
    .setTitle("Você teve seu ID Aprovado!")
    .setAuthor("Nome do Servidor", "https://images-na.ssl-images-amazon.com/images/I/51lpm9SpsJL.png")
    .setColor('#FFFFFF')
    .setDescription("Lembre-se, quando entrar no jogo setar o seu nome igual ao mandado no discord (passivel de punição)")
    .setThumbnail("https://images-na.ssl-images-amazon.com/images/I/51lpm9SpsJL.png")
    .setFooter('BOT FEITO POR deco#0825')

    return embed
}

function embedWrong() {
    const embed = new Discord.MessageEmbed()
    .setTitle("Você teve seu ID reprovado!")
    .setAuthor("Nome do Servidor", "https://images-na.ssl-images-amazon.com/images/I/51lpm9SpsJL.png")
    .setColor('#FFFFFF')
    .setDescription("Se possível reenviar o seu nome e id de forma coerente.")
    .setThumbnail("https://images-na.ssl-images-amazon.com/images/I/51lpm9SpsJL.png")
    .setFooter('BOT FEITO POR deco#0825')

    return embed
}

client.on('message', async message => {
    if (message.channel.name != channelName || message.author.id == config.id) {
        return
    }

    let userID = message.author.id
    let userMember = message.guild.members.cache.get(userID)
    
    try {
        var id =  message.content.split(' | ')[0]
        var name = message.content.split(' | ')[1]
    } catch (e) {

    }
   
    if (verifyCorrect(message, name, id, userMember)) {
        message.author.send(embedAprovado())
    } else {
        message.author.send(embedWrong())
    }
	
})

client.login(config.token) 
