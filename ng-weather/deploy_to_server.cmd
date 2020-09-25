USERNAME=ubuntu
KEYFILE=~/avvaimet.pem
SERVER=ec2-13-48-45-90.eu-north-1.compute.amazonaws.com
PORT=22
SERVER_DIR=/var/www/ng-weather
FILENAME=build.tar

rm $FILENAME
tar cvf $FILENAME dist/ng-weather

ssh -i $KEYFILE -p $PORT $USERNAME@$SERVER "cd $SERVER_DIR && rm -rf *"
scp -i $KEYFILE -P $PORT $FILENAME $USERNAME@$SERVER:$SERVER_DIR
ssh -i $KEYFILE -p $PORT $USERNAME@$SERVER "cd $SERVER_DIR && tar xvf $FILENAME --strip-components 2"
