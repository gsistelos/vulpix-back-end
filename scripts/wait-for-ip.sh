#!/usr/bin/env sh

echo "Waiting for $1:$2 to be available..."

while ! nc -z $1 $2; do
	sleep 3
done

sh -c "$3"
