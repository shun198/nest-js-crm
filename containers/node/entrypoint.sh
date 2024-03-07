#!/bin/sh
set -eu

npx prisma migrate dev
npm run start:debug
