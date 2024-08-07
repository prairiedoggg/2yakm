FROM node:20.3.0

WORKDIR /chicken_pharm

# Nginx, Python 및 필요한 도구 설치
RUN apt-get update && apt-get install -y nginx python3 python3-pip build-essential libssl-dev libffi-dev python3-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 서버 의존성 설치
COPY server/package*.json ./server/
RUN cd server && npm ci

# 클라이언트 의존성 설치
COPY client/package*.json ./client/
RUN cd client && npm ci

# 소스 코드 복사
COPY . .

# .env 파일 처리
#ARG ENV_FILE=.env
#COPY ${ENV_FILE} .env

# 클라이언트 빌드
RUN cd client && npm run build || echo "클라이언트 빌드 중 오류 발생"

# 서버 빌드
RUN cd server && npm run build

# NGINX 설정 복사
COPY nginx.conf /etc/nginx
COPY default /etc/nginx/sites-available/default

# 포트 설정
EXPOSE 80 3000 5173

# 시작 스크립트 권한 설정
RUN chmod +x /chicken_pharm/start.sh

# 시작 명령 설정
CMD ["/bin/bash", "-c", "source .env && /chicken_pharm/start.sh"]
