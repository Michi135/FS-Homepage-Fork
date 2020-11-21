# FS-Homepage

```bash
cd docker
echo "FACTOR_AUTH_SECRET=\"some_long_random_string\"" > .env

//Change https portal from STAGE: "local" to STAGE: "production" for DEPLOYMENT ONLY!

sudo docker-compose up

//Insert 172.23.2.10   www.fsmpi.uni-bayreuth.de fsmpi.uni-bayreuth.de in /etc/hosts if needed
//Magic
```
