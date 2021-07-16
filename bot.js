let needle = require('needle')
let Discord = require('discord.js')
let {MessageEmbed} = require('discord.js')

let URL = 'https://www.leagueofautomatednations.com/alliances.js'
let prefix = '!'

let bot = new Discord.Client()
bot.login('ODY1Mjg2NTg3MzEzODE1NjIz.YPBy7g.vWG9Y8ymIduLWIL1h4Z57TqO0Ig')

bot.on('ready', () => {
	console.log(bot.user.tag + ' is ready')
})

bot.on('message', (msg) =>{
	if(msg.author.id != bot.user.id){	
		let mess = msg.content.toLowerCase()
		let messArr = msg.content.split(' ')
		if(mess.includes(prefix + 'info')){
			let abbreviation = messArr[1]
			needle.get(URL, function(err, res){
				if(err){
					msg.channel.send(err.message)
				}
				else{
					let alliances = res.body
					if(abbreviation == undefined){
						let mainInfoEmbed = new MessageEmbed()
						.setTitle('Main info')
						.addField('alliances list',Object.keys(alliances).sort().join(', '))
						.setDescription('`' + prefix + 'info [shortName]` to get info about alliance')
						msg.channel.send(mainInfoEmbed)
					}
					else if(alliances[abbreviation]){
						/**
						 * @param alliance object
						 * @param alliance.name name
						 * @param alliance.rcl_rank RCL rank
						 * @param alliance.combined_power_rank combined PWR rank
						 * @param alliance.members array of all members
						 * @param alliance.slack_channel slack channel
						 * @param alliance.abbreviation abbreviation
						 * @param alliance.alliance_power_rank PWR rank
						 * @param alliance.combined_gcl_rank combined GCL rank
						 * @param alliance.logo name of alliance logo's file
						 * @param alliance.color color
						 * @param alliance.spawns_rank spawns rank
						 * @param alliance.members_rank member rank
						 * @param alliance.alliance_gcl_rank GCL rank
						 * 
						 */
						let alliance = alliances[abbreviation]
						let allianceInfoEmbed = new MessageEmbed()
						.setAuthor(alliance.name,'https://www.leagueofautomatednations.com/obj/'+alliance.logo,'https://www.leagueofautomatednations.com/a/'+abbreviation)
						.addField('ranking',
							'`RCL: ' + alliance.rcl_rank + '`\n' +
							'`MEMBER_RANK: ' + alliance.members_rank + '`\n' +
							'`PWR: ' + alliance.alliance_power_rank + '|combined: ' + alliance.combined_power_rank + '`\n' +
							'`GCL: ' + alliance.alliance_gcl_rank + '|combined: ' + alliance.combined_gcl_rank + '`'
						)
						.addField('other',
							'`members: ' + alliance.members.length + '` `spawns: ' + alliance.spawns_rank + '`\n' +
							'`slack: #' + alliance.slack_channel + '`'
						)
						msg.channel.send(allianceInfoEmbed)
					}
					else{
						msg.channel.send(
							'alliance `' + abbreviation + '` not found\n!info to get alliances list'
						)
					}
				}
			})
		}
	}
})