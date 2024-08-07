FROM node:20.3.0

WORKDIR /chicken_pharm

RUN apt-get update && apt-get install -y nginx python3 python3-pip build-essential libssl-dev libffi-dev python3-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY server/package*.json ./server/
RUN cd server && npm ci

COPY client/package*.json ./client/
RUN cd client && npm ci

COPY . .

ARG ENV_FILE=.env
COPY ${ENV_FILE} .env

# 클라이언트 빌드
RUN cd client && npm run build

# 서버 빌드
RUN cd server && npm run build

# 클라이언트 빌드 결과물을 서버의 public 디렉토리로 복사
RUN mkdir -p server/public && cp -r client/dist/* server/public/

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

RUN chmod +x /chicken_pharm/start.sh

CMD ["/bin/bash", "-c", "source .env && /chicken_pharm/start.sh"]