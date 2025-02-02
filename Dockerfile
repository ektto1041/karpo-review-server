# 베이스 이미지 선택 (Node.js LTS 버전 사용)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 애플리케이션 코드 복사
COPY . .

# 컨테이너가 수신할 포트 정의
EXPOSE 80

# 애플리케이션 실행
CMD ["npm", "run", "start"]
