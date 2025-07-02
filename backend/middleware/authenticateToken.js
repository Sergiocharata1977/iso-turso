import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'isoflow3_secret_key'; // Asegúrate de que esta clave sea la misma que usas para firmar los tokens

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (token == null) {
    return res.status(401).json({ error: 'No token proporcionado. Acceso denegado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Token inválido.' });
      }
      return res.status(403).json({ error: 'Fallo en la autenticación del token.' });
    }

    // El payload del token (userPayload) se espera que contenga:
    // - id: el ID del usuario
    // - tenant_id: el ID del tenant al que pertenece el usuario
    // Se adjuntan estos datos a req.user para su uso en rutas protegidas y servicios.
    req.user = {
      id: userPayload.id,          // ID del usuario
      tenant_id: userPayload.tenant_id  // ID del tenant
    };
    next();
  });
};

export default authenticateToken;
