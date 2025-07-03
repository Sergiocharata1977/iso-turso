import { tursoClient } from '../lib/tursoClient.js';

// Obtener la configuración actual
export const getConfiguracion = async (req, res) => {
  try {
    const result = await tursoClient.execute('SELECT * FROM direccion_configuracion WHERE id = 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró la configuración.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener la configuración de dirección:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar la configuración
export const updateConfiguracion = async (req, res) => {
  const { politica_calidad, alcance, estrategia } = req.body;
  const now = new Date().toISOString();

  // Por ahora solo manejamos los campos de texto.
  // Las URLs de las imágenes se manejarán más adelante cuando implementemos la subida de archivos.

  try {
    const result = await tursoClient.execute({
      sql: `
        UPDATE direccion_configuracion
        SET 
          politica_calidad = ?,
          alcance = ?,
          estrategia = ?,
          updated_at = ?
        WHERE id = 1;
      `,
      args: [politica_calidad, alcance, estrategia, now]
    });

    if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'No se encontró la configuración para actualizar.' });
    }

    res.status(200).json({ message: 'Configuración actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar la configuración de dirección:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
