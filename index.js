require('dotenv').config();
const express = require('express');
const discord = require('discord.js');
const youtube = require('yt-search');
const client = new discord.Client();
const ytdl = require('ytdl-core');

const streamOptions = { seek: 0, volume: 1 };
const broadcast = client.createVoiceBroadcast();

const app = express();

var bot_secret_token = process.env.DISCORD_SECRET_TOKEN;
var textChannel;
var voiceChannel;


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
            if(channel.name === 'meme-spam' && channel.type === "text") {
                textChannel = client.channels.get(channel.id);
            }

            if(channel.name === 'General' && channel.type === 'voice') {
                voiceChannel = client.channels.get(channel.id);
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
        textChannel.send(`Searching for '${message}'`);
        youtube(message, function(err, res) {
            if(err) {
                console.log(err);
                textChannel.send(`Well this is embarassing - I'm broken, but aren't we all`);
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

            textChannel.send(myResponse);

            const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
            const collector = sentMessage.channel.createMessageCollector(filter);

            collector.videos = videos;
            collector.once('collect', function(m) {
                textChannel.send(videos[parseInt(m.content)-1].url);

                voiceChannel.join().then(function(connection){
                    console.log('Connected!');
                    var url = videos[parseInt(m.content)-1].url;
                    console.log(url);
                    console.log("https://youtube.com/watch?v=cO9UdtorHa4");
                    // const dispatcher = voiceConnection.playStream(ytdl("https://www.youtube.com/watch?v=cO9UdtorHa4"));
                    const stream = ytdl(`"${url}"`, {filter : 'audioonly'});
                    // voiceConnection.playOpusStream(stream);

                    console.log(stream);
                    broadcast.playStream(stream);
                    const dispatcher = connection.playBroadcast(broadcast);
                    // const dispatcher = connection.playBroadcast(connection.playStream(ytdl(url)));
                })
                .catch(console.error);
            });

            
            
        })
    }
    
})

