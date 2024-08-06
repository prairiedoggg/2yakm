   #!/bin/bash
   set -e
   nginx
   # 환경 변수 출력 (디버깅용)
   env

   # 현재 디렉토리 및 파일 구조 출력 (디버깅용)
   pwd
   ls -R /chicken_pharm

   # 클라이언트 시작 (5173 포트 사용)
   cd /chicken_pharm/client && npm run preview -- --port 5173 &

   # 서버 시작 (3000 포트 사용)
   cd /chicken_pharm/server && NODE_ENV=production node dist/server.js
