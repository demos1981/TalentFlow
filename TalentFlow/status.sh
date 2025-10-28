#!/bin/bash

# 📊 TalentFlow - Status Script
# Показує статус всіх сервісів проекту

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}📊 TalentFlow Status Check${NC}"
echo -e "${BLUE}================================${NC}"

# Перевіряємо Node.js процеси
print_status "Перевіряю Node.js процеси..."

echo -e "\n${CYAN}🔧 Backend процеси:${NC}"
BACKEND_PROCESSES=$(ps aux | grep "npm run dev" | grep "backend" | grep -v grep)
if [ ! -z "$BACKEND_PROCESSES" ]; then
    echo -e "${GREEN}✅ Backend запущений${NC}"
    echo "$BACKEND_PROCESSES" | while read line; do
        echo -e "  ${YELLOW}$line${NC}"
    done
else
    echo -e "${RED}❌ Backend не запущений${NC}"
fi

echo -e "\n${CYAN}🌐 Frontend процеси:${NC}"
FRONTEND_PROCESSES=$(ps aux | grep "npm run dev" | grep "web" | grep -v grep)
if [ ! -z "$FRONTEND_PROCESSES" ]; then
    echo -e "${GREEN}✅ Frontend запущений${NC}"
    echo "$FRONTEND_PROCESSES" | while read line; do
        echo -e "  ${YELLOW}$line${NC}"
    done
else
    echo -e "${RED}❌ Frontend не запущений${NC}"
fi

echo -e "\n${CYAN}⚡ Vite процеси:${NC}"
VITE_PROCESSES=$(ps aux | grep "vite" | grep -v grep)
if [ ! -z "$VITE_PROCESSES" ]; then
    echo -e "${GREEN}✅ Vite процеси запущені${NC}"
    echo "$VITE_PROCESSES" | while read line; do
        echo -e "  ${YELLOW}$line${NC}"
    done
else
    echo -e "${RED}❌ Vite процеси не знайдено${NC}"
fi

# Перевіряємо порти
echo -e "\n${CYAN}🔌 Порти (3000-3010):${NC}"
for port in {3000..3010}; do
    if lsof -i :$port > /dev/null 2>&1; then
        SERVICE=$(lsof -i :$port | grep LISTEN | head -1 | awk '{print $1}')
        PID=$(lsof -ti:$port | head -1)
        echo -e "  ${GREEN}✅ Порт $port: $SERVICE (PID: $PID)${NC}"
    else
        echo -e "  ${YELLOW}⚪ Порт $port: вільний${NC}"
    fi
done

# Перевіряємо доступність сервісів
echo -e "\n${CYAN}🌐 Доступність сервісів:${NC}"

# Шукаємо backend
BACKEND_PORT=""
for port in {3000..3010}; do
    if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
        BACKEND_PORT=$port
        break
    fi
done

if [ ! -z "$BACKEND_PORT" ]; then
    echo -e "  ${GREEN}✅ Backend API: http://localhost:$BACKEND_PORT${NC}"
    
    # Тестуємо health endpoint
    HEALTH_RESPONSE=$(curl -s "http://localhost:$BACKEND_PORT/health" 2>/dev/null)
    if [ ! -z "$HEALTH_RESPONSE" ]; then
        echo -e "    ${GREEN}✅ Health check: OK${NC}"
    else
        echo -e "    ${RED}❌ Health check: FAILED${NC}"
    fi
    
    # Тестуємо Swagger
    if curl -s "http://localhost:$BACKEND_PORT/api-docs" > /dev/null 2>&1; then
        echo -e "    ${GREEN}✅ Swagger: http://localhost:$BACKEND_PORT/api-docs${NC}"
    else
        echo -e "    ${RED}❌ Swagger: недоступний${NC}"
    fi
else
    echo -e "  ${RED}❌ Backend API: не знайдено${NC}"
fi

# Шукаємо frontend
FRONTEND_PORT=""
for port in {3000..3010}; do
    if curl -s "http://localhost:$port/" | grep -q "TalentFlow\|React\|Vite" 2>/dev/null; then
        if [ "$port" != "$BACKEND_PORT" ]; then
            FRONTEND_PORT=$port
            break
        fi
    fi
done

if [ ! -z "$FRONTEND_PORT" ]; then
    echo -e "  ${GREEN}✅ Frontend: http://localhost:$FRONTEND_PORT${NC}"
    
    # Перевіряємо відповідь
    if curl -s "http://localhost:$FRONTEND_PORT/" > /dev/null 2>&1; then
        echo -e "    ${GREEN}✅ Frontend відповідає${NC}"
    else
        echo -e "    ${RED}❌ Frontend не відповідає${NC}"
    fi
else
    echo -e "  ${RED}❌ Frontend: не знайдено${NC}"
fi

# Перевіряємо базу даних
echo -e "\n${CYAN}🗄️ База даних:${NC}"
if command -v psql &> /dev/null; then
    if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ PostgreSQL: доступний на localhost:5432${NC}"
    else
        echo -e "  ${RED}❌ PostgreSQL: недоступний на localhost:5432${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠️ PostgreSQL: psql не знайдено${NC}"
fi

# Показуємо корисні команди
echo -e "\n${CYAN}🛠️ Корисні команди:${NC}"
echo -e "  Запустити: ${GREEN}./start.sh${NC}"
echo -e "  Зупинити:  ${RED}./stop.sh${NC}"
echo -e "  Статус:    ${BLUE}./status.sh${NC}"

if [ ! -z "$BACKEND_PORT" ]; then
    echo -e "  API тест:  ${YELLOW}curl http://localhost:$BACKEND_PORT/health${NC}"
fi

if [ ! -z "$FRONTEND_PORT" ]; then
    echo -e "  Сайт:      ${PURPLE}http://localhost:$FRONTEND_PORT${NC}"
fi

echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}📊 Status Check Complete${NC}"
echo -e "${BLUE}================================${NC}"
