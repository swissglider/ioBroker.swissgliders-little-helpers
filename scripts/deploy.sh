#!/bin/bash

npm run build

# scp -r www root@192.168.90.1:/opt/iobroker/node_modules/iobroker.swissgliders-little-helpers/

ssh root@192.168.90.1 rm -rf /opt/iobroker/node_modules/iobroker.swissgliders-little-helpers/admin
scp -r admin root@192.168.90.1:/opt/iobroker/node_modules/iobroker.swissgliders-little-helpers/
scp -r io-package.json root@192.168.90.1:/opt/iobroker/node_modules/iobroker.swissgliders-little-helpers/

scp -r build root@192.168.90.1:/opt/iobroker/node_modules/iobroker.swissgliders-little-helpers/

ssh root@192.168.90.1 iobroker upload swissgliders-little-helpers