# 🚀 Guía de Despliegue VPS - ISOFlow3

**Versión:** 3.0  
**Dificultad:** Fácil (Sin conocimientos técnicos requeridos)  
**Tiempo estimado:** 30-45 minutos  
**Última actualización:** Diciembre 2024

## 🎯 Descripción

Esta guía te permitirá desplegar ISOFlow3 en tu servidor VPS de manera completamente automática, sin necesidad de conocimientos técnicos avanzados. El script automatizado se encargará de toda la configuración.

---

## 📋 Requisitos Previos

### **🖥️ Servidor VPS**
- **Sistema operativo**: Ubuntu 20.04+ o Debian 11+
- **RAM mínima**: 2 GB
- **Almacenamiento**: 10 GB mínimo
- **Acceso**: SSH con permisos de sudo

### **🌐 Dominio**
- Un dominio configurado y apuntando a tu VPS
- Ejemplo: `isoflow3.tudominio.com`

### **📧 Email**
- Un email válido para certificados SSL

---

## 🚀 Pasos para el Despliegue

### **Paso 1: Preparar el VPS**

#### **1.1 Conectarse al VPS**
```bash
# Conectarse via SSH (reemplaza con tu IP)
ssh usuario@tu-ip-del-vps

# O si usas un cliente SSH como PuTTY:
# - Host: tu-ip-del-vps
# - Usuario: tu-usuario
# - Puerto: 22
```

#### **1.2 Actualizar el sistema**
```bash
# Ejecutar estos comandos uno por uno:
sudo apt update
sudo apt upgrade -y
```

### **Paso 2: Descargar ISOFlow3**

#### **2.1 Clonar el proyecto**
```bash
# Descargar el proyecto
git clone https://github.com/tu-usuario/isoflow3.git
cd isoflow3
```

#### **2.2 Verificar que todo esté correcto**
```bash
# Verificar que los archivos estén presentes
ls -la
# Deberías ver: backend/, frontend/, scripts/, etc.
```

### **Paso 3: Ejecutar el Script de Despliegue**

#### **3.1 Dar permisos al script**
```bash
# Hacer el script ejecutable
chmod +x scripts/deploy-vps.sh
```

#### **3.2 Ejecutar el despliegue**
```bash
# Ejecutar el script de despliegue
./scripts/deploy-vps.sh
```

#### **3.3 Responder las preguntas**
El script te hará algunas preguntas. Responde así:

```
Ingrese el dominio del servidor: isoflow3.tudominio.com
Ingrese su email para certificados SSL: tu-email@ejemplo.com
Nombre de la base de datos [isoflow3_prod]: [Enter]
Usuario de la base de datos [isoflow3_user]: [Enter]
Contraseña de la base de datos: [Escribe una contraseña segura]
```

**⚠️ IMPORTANTE**: Guarda la contraseña de la base de datos en un lugar seguro.

### **Paso 4: Esperar la Instalación**

El script hará todo automáticamente:

1. ✅ Instalar Node.js y dependencias
2. ✅ Configurar Nginx (servidor web)
3. ✅ Instalar certificado SSL
4. ✅ Configurar la aplicación
5. ✅ Iniciar todos los servicios

**⏱️ Tiempo estimado**: 15-20 minutos

### **Paso 5: Verificar la Instalación**

#### **5.1 Verificar que todo funcione**
```bash
# Ver el estado de la aplicación
sudo /opt/isoflow3/maintenance.sh status
```

Deberías ver algo como:
```
┌─────┬─────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name                │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ isoflow3-backend    │ default     │ N/A     │ fork    │ 1234     │ 2m     │ 0    │ online    │ 0%       │ 45.0mb   │ isoflow3 │ disabled │
└─────┴─────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

#### **5.2 Acceder a la aplicación**
Abre tu navegador y ve a: `https://tu-dominio.com`

Deberías ver la página de inicio de ISOFlow3.

---

## 🔧 Comandos de Mantenimiento

### **📊 Ver Estado de la Aplicación**
```bash
sudo /opt/isoflow3/maintenance.sh status
```

### **📝 Ver Logs (Información de errores)**
```bash
sudo /opt/isoflow3/maintenance.sh logs
```

### **🔄 Reiniciar la Aplicación**
```bash
sudo /opt/isoflow3/maintenance.sh restart
```

### **⏹️ Detener la Aplicación**
```bash
sudo /opt/isoflow3/maintenance.sh stop
```

### **▶️ Iniciar la Aplicación**
```bash
sudo /opt/isoflow3/maintenance.sh start
```

### **🔄 Actualizar la Aplicación**
```bash
sudo /opt/isoflow3/maintenance.sh update
```

---

## 🎯 Configuración Inicial

### **Paso 1: Crear Usuario Administrador**

1. Ve a `https://tu-dominio.com`
2. Haz clic en "Registrarse"
3. Completa el formulario con:
   - **Nombre**: Tu nombre completo
   - **Email**: Tu email
   - **Contraseña**: Una contraseña segura
   - **Organización**: Nombre de tu empresa
4. Haz clic en "Crear cuenta"

### **Paso 2: Configurar la Organización**

1. Inicia sesión con tu cuenta
2. Ve a "Configuración" → "Organización"
3. Completa la información:
   - **Logo**: Sube el logo de tu empresa
   - **Colores**: Personaliza los colores
   - **Datos fiscales**: Información de la empresa
4. Guarda los cambios

### **Paso 3: Configurar Departamentos**

1. Ve a "Recursos Humanos" → "Departamentos"
2. Crea los departamentos de tu empresa:
   - Administración
   - Ventas
   - Producción
   - Calidad
   - etc.

### **Paso 4: Configurar Procesos**

1. Ve a "Procesos" → "Gestión de Procesos"
2. Crea los procesos principales de tu empresa
3. Define indicadores para cada proceso

---

## 🔒 Seguridad

### **✅ Lo que ya está configurado automáticamente:**
- 🔐 Certificado SSL (HTTPS)
- 🛡️ Firewall básico
- 🔒 Usuario dedicado para la aplicación
- 📝 Logs de seguridad
- 🔄 Renovación automática de SSL

### **⚠️ Recomendaciones adicionales:**
- 🔑 Cambiar contraseñas por defecto
- 📧 Configurar notificaciones de seguridad
- 💾 Configurar backups regulares
- 👥 Crear usuarios con permisos limitados

---

## 📊 Monitoreo y Mantenimiento

### **📈 Verificar que todo funcione bien:**
```bash
# Estado de servicios
sudo systemctl status nginx
sudo /opt/isoflow3/maintenance.sh status

# Espacio en disco
df -h

# Uso de memoria
free -h
```

### **🔄 Mantenimiento regular:**
```bash
# Actualizar sistema (mensual)
sudo apt update && sudo apt upgrade -y

# Reiniciar aplicación (si es necesario)
sudo /opt/isoflow3/maintenance.sh restart
```

---

## 🆘 Solución de Problemas

### **❌ La aplicación no carga**
```bash
# Verificar estado
sudo /opt/isoflow3/maintenance.sh status

# Ver logs de errores
sudo /opt/isoflow3/maintenance.sh logs

# Reiniciar aplicación
sudo /opt/isoflow3/maintenance.sh restart
```

### **❌ Error de SSL**
```bash
# Renovar certificado SSL
sudo certbot renew

# Verificar configuración de Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### **❌ Error de base de datos**
```bash
# Verificar archivo de base de datos
ls -la /opt/isoflow3/data.db

# Reinicializar base de datos (¡CUIDADO! Esto borra datos)
cd /opt/isoflow3/backend
sudo -u isoflow3 node init-db.js
```

### **❌ Problemas de permisos**
```bash
# Corregir permisos
sudo chown -R isoflow3:isoflow3 /opt/isoflow3
sudo chmod -R 755 /opt/isoflow3
```

---

## 📞 Soporte

### **📧 Contacto**
- **Email**: soporte@isoflow3.com
- **Documentación**: `/opt/isoflow3/DEPLOYMENT_INFO.md`

### **📋 Información útil para soporte:**
```bash
# Información del sistema
cat /etc/os-release
node --version
nginx -v

# Estado de servicios
sudo systemctl status nginx
sudo /opt/isoflow3/maintenance.sh status

# Logs recientes
sudo tail -n 50 /var/log/nginx/isoflow3_error.log
sudo /opt/isoflow3/maintenance.sh logs
```

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tendrás ISOFlow3 funcionando completamente en tu VPS con:

- ✅ **Aplicación funcionando** en https://tu-dominio.com
- ✅ **SSL configurado** automáticamente
- ✅ **Backup automático** de certificados
- ✅ **Monitoreo** y logs configurados
- ✅ **Comandos de mantenimiento** listos para usar

**¡Tu sistema de gestión de calidad ISO 9001 está listo para usar!** 🚀 