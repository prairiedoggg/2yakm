#!/bin/bash
   set -e
   nginx

# 클라이언트 시작 (5173 포트 사용)
   cd /chicken_pharm/client && npm run preview -- --port 5173 &

   # 서버 시작 (3000 포트 사용)
   cd /chicken_pharm/server && npm start
