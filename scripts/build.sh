#!/bin/bash
public_ip_address=$(wget -qO- http://checkip.amazonaws.com)
echo 'ec2-3-8-150-78.eu-west-2.compute.amazonaws.com,3.8.150.78 ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBIz0XjKb/TlssBaPEGHF3NsEft/NOWY+NAEsaknXK5ZG0dUqcOnKxMCCkrd++mtdEeIEGxgNXdz3KSMDEqddY24=' >> ~/.ssh/known_hosts
echo "this computers public ip address is $public_ip_address"
aws ec2 authorize-security-group-ingress --region eu-west-2 --group-id sg-0a4b13c43813deb62 --ip-permissions "[{\"IpProtocol\": \"tcp\", \"FromPort\": 22, \"ToPort\": 22, \"IpRanges\": [{\"CidrIp\": \"${public_ip_address}/32\"}]}]"
ssh -t ubuntu@3.8.150.78 <<-'ENDSSH'
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
  sudo ~/.nvm/nvm.sh
  sudo nvm install node
  npm install pm2 -g
  if [ -d hyg ]; then
    cd hyg
    git pull
    pwd
    npm install
  else
    git clone ssh://git@github.com/babadee001/hyg.git -b static
    cd hyg
    pwd
    npm install
  fi
  pm2 start npm -- start
ENDSSH
aws ec2 revoke-security-group-ingress --region eu-west-2 --group-id sg-0a4b13c43813deb62 --protocol tcp --port 22 --cidr "${public_ip_address}/32"
