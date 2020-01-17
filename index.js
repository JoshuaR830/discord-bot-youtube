require('dotenv').config();
const express = require('express');
const discord = require('discord.js');
const youtube = require('yt-search');
const client = new discord.Client();

const app = express();

var bot_secret_token = process.env.DISCORD_SECRET_TOKEN;
var botChannel;


app.listen(8000, () => console.log('Listening on port 8000!'));


client.login(bot_secret_token);

// app.use(bodyParser.json({
//     verify: function(req, res, buf, encoding) {
//         console.log(buf.toString());
//     }
// }))

client.on('ready', () => {
    client.guilds.forEach((guild) => {
        console.log("- " + guild.name);
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
            if(channel.name === 'general' && channel.type === "text") {
                botChannel = client.channels.get(channel.id);
            }
        });
    })

});

client.on('message', (sentMessage) => {
    var message;
    if(sentMessage.author === client.user) {
        return;
    }

    if(sentMessage.content.substring(0, 3) === '!!!') {
        message = sentMessage.content.slice(3)
        botChannel.send(`Searching for '${message}'`);
        youtube(message, function(err, res) {
            if(err) {
                console.log(err);
                botChannel.send(`Well this is embarassing - I'm broken, but aren't we all`);
                client.user.setActivity("Broken");
                return;
            }

            var videos = res.videos.slice(0, 10);
            var myResponse = '';
            counter = 0;
            videos.forEach(function(video) {
                myResponse += `[${++counter}] ${video.title}\n`;
            });

            myResponse += 'Pick a number from 1 to 10';

            botChannel.send(myResponse);

            const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
            const collector = sentMessage.channel.createMessageCollector(filter);

            collector.videos = videos;
            collector.once('collect', function(m) {
                botChannel.send(this.videos[parseInt(m.content)-1].url);
                // var commandFile = require('./play.js');
                // commandFile.run(client, sentMessage, [this.videos[parseInt(m.content)-1].url], ops)
                

                // const embed = discord.MessageEmbedVideo(new discord.MessageEmbed(new discord.Message()));
                // embed.url = this.videos[parseInt(m.content)-1].url;
                // botChannel.send({embed});
            });

            
            
        })
    }
    
})

