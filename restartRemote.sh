echo "Pulling changes"
git pull
echo "Stopping music-bot container"
docker stop music-bot
echo "Remove music-bot container"
docker rm music-bot
echo "Build the new music-bot docker image"
docker build -t root/music-bot-image .
echo "Running the new music-bot container"
docker run --name music-bot --restart always -p 6001:6001 -d root/music-bot-image
echo ""

echo "Complete"
echo ""