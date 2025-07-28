# 🔄 COMANDOS CORREGIDOS PARA ACTUALIZAR EL SERVIDOR VPS

## 📋 Pasos para actualizar el servidor con los últimos cambios

### 1. **Conectarse al servidor VPS**
```bash
ssh root@31.97.162.229
```

### 2. **Verificar la ubicación del proyecto**
```bash
ls -la /var/www/
ls -la /var/www/isoflow3/
```

### 3. **Navegar al directorio del proyecto**
```bash
cd /var/www/isoflow3
```

### 4. **Hacer backup de la configuración actual**
```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### 5. **Verificar si es un repositorio git**
```bash
ls -la .git/
```

### 6. **Si no es un repositorio git, inicializarlo**
```bash
git init
git remote add origin https://github.com/Sergiocharata1977/iso-turso.git
```

### 7. **Obtener los últimos cambios de GitHub**
```bash
git fetch origin
git reset --hard origin/main
```

### 8. **Actualizar dependencias del backend**
```bash
cd backend
npm install
```

### 9. **Verificar estructura de base de datos**
```bash
node scripts/verificar-base-datos-completa.js
```

### 10. **Actualizar dependencias del frontend**
```bash
cd ../frontend
npm install
```

### 11. **Construir frontend para producción**
```bash
npm run build
```

### 12. **Volver al directorio raíz**
```bash
cd ..
```

### 13. **Reiniciar servicios con PM2**
```bash
pm2 restart isoflow3-backend
pm2 save
```

### 14. **Reiniciar nginx**
```bash
systemctl restart nginx
```

### 15. **Verificar estado de servicios**
```bash
pm2 status
systemctl status nginx
```

## 🚨 Comandos de emergencia (si algo falla)

### **Revisar logs de PM2**
```bash
pm2 logs isoflow3-backend --lines 50
```

### **Revisar logs de nginx**
```bash
tail -f /var/log/nginx/isoflow3_access.log
tail -f /var/log/nginx/isoflow3_error.log
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
curl http://localhost:5000/api/health
curl http://localhost:5000/api/personal
curl http://localhost:5000/api/puestos
```

### **Verificar frontend**
- Abrir en navegador: `http://31.97.162.229`
- Probar login y navegación a Personal/Puestos

## 📊 Información del servidor

- **IP del servidor**: 31.97.162.229
- **Directorio del proyecto**: `/var/www/isoflow3`
- **Puerto backend**: 5000 (PM2)
- **Puerto frontend**: 80 (nginx)
- **Base de datos**: Turso Cloud
- **Gestor de procesos**: PM2

## 🔍 Comandos de diagnóstico

### **Verificar procesos activos**
```bash
ps aux | grep node
pm2 list
```

### **Verificar puertos en uso**
```bash
netstat -tlnp | grep :5000
netstat -tlnp | grep :80
```

### **Verificar configuración de nginx**
```bash
nginx -t
cat /etc/nginx/sites-enabled/isoflow3
``` 