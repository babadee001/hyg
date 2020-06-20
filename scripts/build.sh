#!/bin/bash
public_ip_address=$(wget -qO- http://checkip.amazonaws.com)
echo "this computers public ip address is $public_ip_address"
aws ec2 authorize-security-group-ingress --region eu-west-2 --group-id sg-0a4b13c43813deb62 --ip-permissions "[{\"IpProtocol\": \"tcp\", \"FromPort\": 22, \"ToPort\": 22, \"IpRanges\": [{\"CidrIp\": \"${public_ip_address}/32\"}]}]"
ssh ubuntu@3.8.150.78 -v
git clone https://github.com/babadee001/hyg -b static
pm2 start npm -- start
