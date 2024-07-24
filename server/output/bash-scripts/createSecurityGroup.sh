#!/bin/bash
GROUP_OUTPUT=$(aws ec2 create-security-group --description "Security group for Redis nodes" --vpc-id vpc-05e65564c244f4fce --group-name "redis-security-group")
GROUP_ID=$(echo $GROUP_OUTPUT | jq -r '.GroupId')

JSON_OUTPUT=$(jq -n   --arg group_id "$GROUP_ID"   '{ GroupId: $group_id }')

# Write JSON output to file
echo "$JSON_OUTPUT" > "server/output/AWSIDs.json"

RULE1=$(aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 6379 --cidr 0.0.0.0/0)
RULE2=$(aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 16379 --cidr 0.0.0.0/0)
RULE3=$(aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 22 --cidr 0.0.0.0/0)


