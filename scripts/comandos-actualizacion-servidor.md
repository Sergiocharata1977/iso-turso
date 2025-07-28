# 🔄 COMANDOS PARA ACTUALIZAR EL SERVIDOR VPS

## 📋 Pasos para actualizar el servidor con los últimos cambios

### 1. **Conectarse al servidor VPS**
```bash
ssh root@31.97.162.229
```

### 2. **Navegar al directorio del proyecto**
```bash
cd /var/www/isoflow3-master
```

### 3. **Hacer backup de la configuración actual**
```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### 4. **Obtener los últimos cambios de GitHub**
```bash
git fetch origin
git reset --hard origin/main
```

### 5. **Actualizar dependencias del backend**
```bash
cd backend
npm install
```

### 6. **Verificar estructura de base de datos**
```bash
node scripts/verificar-base-datos-completa.js
```

### 7. **Actualizar dependencias del frontend**
```bash
cd ../frontend
npm install
```

### 8. **Construir frontend para producción**
```bash
npm run build
```

### 9. **Reiniciar servicios**
```bash
sudo systemctl restart isoflow3-backend
sudo systemctl restart nginx
```

### 10. **Verificar estado de servicios**
```bash
sudo systemctl status isoflow3-backend
sudo systemctl status nginx
```

## 🚨 Comandos de emergencia (si algo falla)

### **Revisar logs del backend**
```bash
sudo journalctl -u isoflow3-backend -f
```

### **Revisar logs de nginx**
```bash
sudo tail -f /var/log/nginx/error.log
```

### **Restaurar backup si es necesario**
```bash
cp .env.backup.YYYYMMDD_HHMMSS .env
```

### **Reiniciar todo el sistema si es necesario**
```bash
sudo reboot
```

## ✅ Verificación final

### **Probar endpoints del backend**
```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/personal
curl http://localhost:3001/api/puestos
```

### **Verificar frontend**
- Abrir en navegador: `http://31.97.162.229`
- Probar login y navegación a Personal/Puestos

## 📊 Información del servidor

- **IP del servidor**: 31.97.162.229
- **Directorio del proyecto**: `/var/www/isoflow3-master`
- **Puerto backend**: 3001
- **Puerto frontend**: 80 (nginx)
- **Base de datos**: Turso Cloud 