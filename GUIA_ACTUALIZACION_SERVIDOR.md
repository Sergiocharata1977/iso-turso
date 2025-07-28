# 🔄 GUÍA DE ACTUALIZACIÓN DEL SERVIDOR VPS - ISOFlow3

## 📋 Resumen Ejecutivo

Esta guía explica el proceso completo para actualizar el servidor VPS después de hacer cambios en el repositorio de GitHub. Incluye todos los comandos necesarios y su función específica.

---

## 🚀 Proceso de Actualización Completo

### **Paso 1: Conectar al Servidor**
```bash
ssh root@31.97.162.229
```
**Función:** Establece conexión SSH con el servidor VPS para ejecutar comandos remotamente.

### **Paso 2: Navegar al Proyecto**
```bash
cd /var/www/isoflow3
```
**Función:** Cambia al directorio raíz del proyecto donde están los archivos de la aplicación.

### **Paso 3: Verificar Estado Actual**
```bash
ls -la
```
**Función:** Lista todos los archivos y directorios para verificar que estamos en la ubicación correcta.

### **Paso 4: Hacer Backup de Configuración**
```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```
**Función:** Crea una copia de seguridad del archivo de configuración con timestamp para poder restaurarlo si algo sale mal.

### **Paso 5: Actualizar Código desde GitHub**
```bash
git fetch origin
git reset --hard origin/main
```
**Función:** 
- `git fetch origin`: Descarga los últimos cambios del repositorio remoto
- `git reset --hard origin/main`: Actualiza el código local con los cambios más recientes

### **Paso 6: Actualizar Dependencias del Backend**
```bash
cd backend
npm install
```
**Función:** Instala o actualiza todas las dependencias de Node.js necesarias para el backend.

### **Paso 7: Verificar Estructura de Base de Datos**
```bash
node scripts/verificar-base-datos-completa.js
```
**Función:** Ejecuta un script que verifica que todas las tablas de la base de datos existan y estén correctamente configuradas.

### **Paso 8: Actualizar Dependencias del Frontend**
```bash
cd ../frontend
npm install
```
**Función:** Instala o actualiza todas las dependencias de Node.js necesarias para el frontend.

### **Paso 9: Construir Frontend para Producción**
```bash
npm run build
```
**Función:** Compila el código del frontend (React/Vite) en archivos optimizados para producción que se guardan en el directorio `dist/`.

### **Paso 10: Reiniciar Backend con PM2**
```bash
cd ..
pm2 restart isoflow-backend
pm2 save
```
**Función:** 
- `pm2 restart isoflow-backend`: Reinicia la aplicación del backend
- `pm2 save`: Guarda la configuración actual de PM2 para que persista después de reinicios

### **Paso 11: Reiniciar Nginx**
```bash
systemctl restart nginx
```
**Función:** Reinicia el servidor web Nginx para que sirva los nuevos archivos del frontend y mantenga la configuración del proxy.

### **Paso 12: Verificar Estado de Servicios**
```bash
pm2 status
systemctl status nginx
```
**Función:** Verifica que tanto el backend (PM2) como el frontend (Nginx) estén funcionando correctamente.

---

## 🔍 Comandos de Diagnóstico

### **Verificar Logs del Backend**
```bash
pm2 logs isoflow-backend --lines 20
```
**Función:** Muestra los últimos 20 logs del backend para detectar errores.

### **Verificar Logs de Nginx**
```bash
tail -20 /var/log/nginx/isoflow3_error.log
```
**Función:** Muestra los últimos 20 errores del servidor web.

### **Probar API del Backend**
```bash
curl http://localhost:5000/api/health
```
**Función:** Prueba si el backend está respondiendo correctamente.

### **Probar Frontend**
```bash
curl -I http://localhost
```
**Función:** Verifica que el frontend esté siendo servido correctamente por Nginx.

---

## 🚨 Comandos de Emergencia

### **Restaurar Backup de Configuración**
```bash
cp .env.backup.YYYYMMDD_HHMMSS .env
```
**Función:** Restaura la configuración anterior si algo sale mal.

### **Reiniciar Todo el Sistema**
```bash
sudo reboot
```
**Función:** Reinicia completamente el servidor (último recurso).

### **Verificar Espacio en Disco**
```bash
df -h
```
**Función:** Verifica el espacio disponible en el disco duro.

---

## 📊 Verificación Final

### **Checklist de Verificación**
- [ ] Backend responde en puerto 5000
- [ ] Frontend se carga correctamente
- [ ] No hay errores en la consola del navegador
- [ ] Las llamadas API funcionan
- [ ] Los datos se cargan correctamente

### **URLs de Verificación**
- **Frontend**: `http://31.97.162.229`
- **Backend API**: `http://31.97.162.229/api/health`
- **Logs Backend**: `pm2 logs isoflow-backend`
- **Logs Nginx**: `tail -f /var/log/nginx/isoflow3_error.log`

---

## 💡 Consejos Importantes

1. **Siempre hacer backup** antes de actualizar
2. **Verificar logs** después de cada actualización
3. **Probar la aplicación** en el navegador
4. **Mantener registro** de las actualizaciones realizadas
5. **Tener un plan de rollback** en caso de problemas

---

## 🔧 Solución de Problemas Comunes

### **Error: "No se pudo obtener la lista de..."**
- Verificar que el backend esté corriendo: `pm2 status`
- Verificar logs del backend: `pm2 logs isoflow-backend`

### **Error: "Failed to load resource"**
- Verificar configuración de nginx: `nginx -t`
- Verificar logs de nginx: `tail -f /var/log/nginx/isoflow3_error.log`

### **Error: "Permission denied"**
- Verificar permisos: `ls -la`
- Corregir permisos: `chmod +x archivo`

---

*Última actualización: Julio 2025* 