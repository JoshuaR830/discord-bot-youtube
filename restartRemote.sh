echo "Pulling changes"
git pull
echo "Stopping musicBot container"
docker stop musicBot
echo "Remove musicBot container"
docker rm musicBot
echo "Build the new musicBot docker image"
docker build -t root/musicBot-image .
echo "Running the new musicBot container"
docker run --name musicBot --restart always -p 38119:8001 -d root/musicBot-image
echo ""

echo "Complete"
echo ""