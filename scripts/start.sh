#!/bin/bash

# ========================================
# TalentMatch Pro - Quick Start Script
# ========================================

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функція для логування
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Перевірка наявності Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker не встановлено. Будь ласка, встановіть Docker спочатку."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose не встановлено. Будь ласка, встановіть Docker Compose спочатку."
        exit 1
    fi

    # Перевірка чи Docker запущений
    if ! docker info &> /dev/null; then
        error "Docker не запущений. Будь ласка, запустіть Docker спочатку."
        exit 1
    fi

    log "Docker та Docker Compose готові до використання"
}

# Перевірка наявності Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        warning "Node.js не встановлено. Використовуватиму Docker версію."
        return 1
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        warning "Node.js версія нижче 20. Рекомендується версія 20+ для кращої продуктивності."
    else
        log "Node.js версія $(node --version) готова до використання"
    fi
    return 0
}

# Створення необхідних директорій
create_directories() {
    log "Створення необхідних директорій..."
    
    mkdir -p backend/logs
    mkdir -p web/dist
    mkdir -p database/init
    mkdir -p ssl
    
    log "Директорії створено"
}

# Копіювання конфігураційних файлів
setup_config() {
    log "Налаштування конфігурації..."
    
    # Копіювання .env файлу якщо він не існує
    if [ ! -f backend/.env ]; then
        if [ -f backend/env.example ]; then
            cp backend/env.example backend/.env
            warning "Створено backend/.env з прикладу. Будь ласка, налаштуйте змінні середовища."
        else
            warning "Файл backend/.env не знайдено. Створіть його вручну."
        fi
    fi
    
    # Копіювання .env файлу для web якщо він не існує
    if [ ! -f web/.env ]; then
        if [ -f web/env.example ]; then
            cp web/env.example web/.env
            warning "Створено web/.env з прикладу. Будь ласка, налаштуйте змінні середовища."
        fi
    fi
    
    log "Конфігурація налаштована"
}

# Запуск сервісів
start_services() {
    log "Запуск сервісів..."
    
    # Зупинка існуючих контейнерів
    docker-compose down --remove-orphans
    
    # Запуск сервісів
    docker-compose up -d
    
    log "Сервіси запущено"
}

# Очікування готовності сервісів
wait_for_services() {
    log "Очікування готовності сервісів..."
    
    # Очікування готовності бази даних
    log "Очікування готовності бази даних..."
    timeout=60
    counter=0
    
    while ! docker-compose exec -T db pg_isready -U talentmatch_user -d talentmatch &> /dev/null; do
        if [ $counter -ge $timeout ]; then
            error "Таймаут очікування готовності бази даних"
            exit 1
        fi
        sleep 2
        counter=$((counter + 2))
        echo -n "."
    done
    echo ""
    log "База даних готова"
    
    # Очікування готовності Redis
    log "Очікування готовності Redis..."
    timeout=30
    counter=0
    
    while ! docker-compose exec -T redis redis-cli ping &> /dev/null; do
        if [ $counter -ge $timeout ]; then
            error "Таймаут очікування готовності Redis"
            exit 1
        fi
        sleep 2
        counter=$((counter + 2))
        echo -n "."
    done
    echo ""
    log "Redis готовий"
    
    # Очікування готовності backend
    log "Очікування готовності backend..."
    timeout=60
    counter=0
    
    while ! curl -f http://localhost:3000/api/health &> /dev/null; do
        if [ $counter -ge $timeout ]; then
            error "Таймаут очікування готовності backend"
            exit 1
        fi
        sleep 2
        counter=$((counter + 2))
        echo -n "."
    done
    echo ""
    log "Backend готовий"
    
    # Очікування готовності web
    log "Очікування готовності web..."
    timeout=60
    counter=0
    
    while ! curl -f http://localhost:3001 &> /dev/null; do
        if [ $counter -ge $timeout ]; then
            error "Таймаут очікування готовності web"
            exit 1
        fi
        sleep 2
        counter=$((counter + 2))
        echo -n "."
    done
    echo ""
    log "Web додаток готовий"
}

# Показ статусу сервісів
show_status() {
    log "Статус сервісів:"
    docker-compose ps
    
    echo ""
    log "Доступні сервіси:"
    echo -e "${BLUE}Backend API:${NC} http://localhost:3000"
    echo -e "${BLUE}Web додаток:${NC} http://localhost:3001"
    echo -e "${BLUE}API документація:${NC} http://localhost:3000/api/docs"
    echo -e "${BLUE}Health check:${NC} http://localhost:3000/api/health"
    echo -e "${BLUE}База даних:${NC} localhost:5432"
    echo -e "${BLUE}Redis:${NC} localhost:6379"
    echo -e "${BLUE}Adminer (DB):${NC} http://localhost:8080"
    
    echo ""
    log "Логи сервісів:"
    echo -e "${BLUE}Backend:${NC} docker-compose logs -f backend"
    echo -e "${BLUE}Web:${NC} docker-compose logs -f web"
    echo -e "${BLUE}Database:${NC} docker-compose logs -f db"
    echo -e "${BLUE}Redis:${NC} docker-compose logs -f redis"
}

# Головна функція
main() {
    echo -e "${GREEN}"
    echo "========================================"
    echo "  TalentMatch Pro - Quick Start"
    echo "========================================"
    echo -e "${NC}"
    
    # Перевірки
    check_docker
    check_node
    
    # Налаштування
    create_directories
    setup_config
    
    # Запуск
    start_services
    wait_for_services
    
    # Результат
    show_status
    
    echo ""
    log "🎉 TalentMatch Pro успішно запущено!"
    log "Відкрийте http://localhost:3001 у браузері"
}

# Обробка аргументів командного рядка
case "${1:-}" in
    "stop")
        log "Зупинка сервісів..."
        docker-compose down
        log "Сервіси зупинено"
        ;;
    "restart")
        log "Перезапуск сервісів..."
        docker-compose restart
        log "Сервіси перезапущено"
        ;;
    "logs")
        log "Показ логів..."
        docker-compose logs -f
        ;;
    "status")
        log "Статус сервісів:"
        docker-compose ps
        ;;
    "clean")
        log "Очищення контейнерів та томів..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        log "Очищення завершено"
        ;;
    "help"|"-h"|"--help")
        echo "Використання: $0 [команда]"
        echo ""
        echo "Команди:"
        echo "  (без аргументів) - Запуск всіх сервісів"
        echo "  stop              - Зупинка сервісів"
        echo "  restart           - Перезапуск сервісів"
        echo "  logs              - Показ логів"
        echo "  status            - Статус сервісів"
        echo "  clean             - Очищення контейнерів та томів"
        echo "  help              - Показ цієї довідки"
        ;;
    *)
        main
        ;;
esac
