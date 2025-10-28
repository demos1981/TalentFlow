#!/bin/bash

# 🛑 TalentFlow - Stop Script
# Зупиняє всі сервіси проекту

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}🛑 TalentFlow Stop Script${NC}"
echo -e "${BLUE}================================${NC}"

print_status "Зупиняю всі сервіси TalentFlow..."

# Зупиняємо Node.js процеси
print_status "Зупиняю Node.js процеси..."

# Знаходимо та зупиняємо backend процеси
BACKEND_PIDS=$(ps aux | grep "npm run dev" | grep "backend" | awk '{print $2}' | tr '\n' ' ')
if [ ! -z "$BACKEND_PIDS" ]; then
    print_status "Зупиняю backend процеси: $BACKEND_PIDS"
    kill $BACKEND_PIDS 2>/dev/null || true
    print_success "Backend процеси зупинено"
else
    print_warning "Backend процеси не знайдено"
fi

# Знаходимо та зупиняємо frontend процеси
FRONTEND_PIDS=$(ps aux | grep "npm run dev" | grep "web" | awk '{print $2}' | tr '\n' ' ')
if [ ! -z "$FRONTEND_PIDS" ]; then
    print_status "Зупиняю frontend процеси: $FRONTEND_PIDS"
    kill $FRONTEND_PIDS 2>/dev/null || true
    print_success "Frontend процеси зупинено"
else
    print_warning "Frontend процеси не знайдено"
fi

# Знаходимо та зупиняємо Vite процеси
VITE_PIDS=$(ps aux | grep "vite" | grep -v grep | awk '{print $2}' | tr '\n' ' ')
if [ ! -z "$VITE_PIDS" ]; then
    print_status "Зупиняю Vite процеси: $VITE_PIDS"
    kill $VITE_PIDS 2>/dev/null || true
    print_success "Vite процеси зупинено"
else
    print_warning "Vite процеси не знайдено"
fi

# Знаходимо та зупиняємо ts-node-dev процеси
TSNODE_PIDS=$(ps aux | grep "ts-node-dev" | grep -v grep | awk '{print $2}' | tr '\n' ' ')
if [ ! -z "$TSNODE_PIDS" ]; then
    print_status "Зупиняю ts-node-dev процеси: $TSNODE_PIDS"
    kill $TSNODE_PIDS 2>/dev/null || true
    print_success "ts-node-dev процеси зупинено"
else
    print_warning "ts-node-dev процеси не знайдено"
fi

# Зупиняємо процеси на портах 3000-3010
print_status "Перевіряю порти 3000-3010..."

for port in {3000..3010}; do
    PID=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$PID" ]; then
        print_status "Зупиняю процес на порту $port (PID: $PID)"
        kill $PID 2>/dev/null || true
    fi
done

print_success "Всі сервіси TalentFlow зупинено!"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}✅ TalentFlow зупинено${NC}"
echo -e "${BLUE}================================${NC}"

echo -e "${YELLOW}💡 Для запуску знову виконайте:${NC}"
echo -e "  ${GREEN}./start.sh${NC}"
